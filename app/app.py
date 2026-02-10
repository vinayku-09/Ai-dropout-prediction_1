import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import pandas as pd
import numpy as np
import joblib
import shap
import io
import os

# --- Configuration ---
MODEL_PATH = 'dropout_prediction_model.joblib'

# ==============================================================================
#  1. FEATURE ENGINEERING LOGIC (from feature_engineering.py)
# ==============================================================================
def process_data_for_prediction(students_df, attendance_df, assessments_df, activities_df, fees_df):
    """
    Takes raw dataframes and returns a tuple:
    1. A dataframe with rich engineered features and student_id.
    2. A dataframe processed and aligned for direct model input.
    """
    # Convert date columns safely
    attendance_df['date'] = pd.to_datetime(attendance_df['date'], errors='coerce')
    assessments_df['submission_date'] = pd.to_datetime(assessments_df['submission_date'], errors='coerce')
    assessments_df['due_date'] = pd.to_datetime(assessments_df['due_date'], errors='coerce')
    fees_df['payment_date'] = pd.to_datetime(fees_df['payment_date'], errors='coerce')
    fees_df['due_date'] = pd.to_datetime(fees_df['due_date'], errors='coerce')
    activities_df['date'] = pd.to_datetime(activities_df['date'], errors='coerce')
    
    # --- Attendance Features ---
    attendance_summary = attendance_df.groupby('student_id')['is_present'].agg(
        present_days=lambda x: x.sum()
    ).reset_index()
    total_days = (attendance_df['date'].max() - attendance_df['date'].min()).days + 1
    attendance_summary['overall_attendance_pct'] = (attendance_summary['present_days'] / total_days).fillna(0)
    
    semester_midpoint = attendance_df['date'].min() + pd.to_timedelta(total_days / 2, unit='d')
    first_half = attendance_df[attendance_df['date'] < semester_midpoint].groupby('student_id')['is_present'].mean()
    second_half = attendance_df[attendance_df['date'] >= semester_midpoint].groupby('student_id')['is_present'].mean()
    attendance_velocity = (second_half - first_half).rename('attendance_velocity').fillna(0)
    attendance_summary = attendance_summary.set_index('student_id').join(attendance_velocity).reset_index()

    # --- Assessment Features ---
    assessments_df['submission_delay'] = (assessments_df['submission_date'] - assessments_df['due_date']).dt.days.fillna(0).clip(lower=0)
    assessments_df['score_pct'] = (assessments_df['score_obtained'] / assessments_df['max_score']) * 100
    assessment_summary = assessments_df.groupby('student_id').agg(
        avg_score_pct=('score_pct', 'mean'),
        avg_submission_delay=('submission_delay', 'mean')
    ).reset_index()

    # --- Fee Features ---
    unpaid_mask = fees_df['payment_date'].isna()
    fees_df.loc[unpaid_mask, 'payment_delay'] = 90
    if not unpaid_mask.all():
         fees_df.loc[~unpaid_mask, 'payment_delay'] = (fees_df.loc[~unpaid_mask, 'payment_date'] - fees_df.loc[~unpaid_mask, 'due_date']).dt.days
    fees_df['payment_delay'] = fees_df['payment_delay'].fillna(0).clip(lower=0)

    fees_df['is_partially_paid'] = (fees_df['amount_paid'] < fees_df['amount_due']).astype(int)
    fee_summary = fees_df.groupby('student_id').agg(
        payment_delay=('payment_delay', 'max'),
        is_partially_paid=('is_partially_paid', 'max'),
        reminders_sent_max=('reminders_sent', 'max')
    ).reset_index()

    # --- Activity Features ---
    activity_summary = activities_df.groupby('student_id')['activity_type'].count().to_frame('total_activities')
    lms_logins = activities_df[activities_df['activity_type'] == 'LMS Login'].groupby('student_id')['date'].count().rename('lms_logins')
    activity_summary = activity_summary.join(lms_logins).fillna(0)
    activity_summary.reset_index(inplace=True)

    # --- MERGE ALL FEATURES ---
    df = students_df.set_index('student_id')
    df = df.join(attendance_summary.set_index('student_id'))
    df = df.join(assessment_summary.set_index('student_id'))
    df = df.join(fee_summary.set_index('student_id'))
    df = df.join(activity_summary.set_index('student_id'))
    
    rich_features_df = df.reset_index()
    rich_features_df.fillna(0, inplace=True)
    
    # --- PREPARE DATAFRAME FOR MODEL ---
    model_input_df = df.drop(columns=['archetype'], errors='ignore')
    model_input_df = pd.get_dummies(model_input_df, columns=['course'], dtype=int)
    model_input_df.fillna(0, inplace=True)
    
    return rich_features_df, model_input_df


# ==============================================================================
#  2. PREDICTION LOGIC (from prediction.py)
# ==============================================================================
def load_model_and_predict_with_shap(rich_features_df, model_input_df):
    """
    Loads the model, predicts risk, and generates SHAP explanations for high-risk cases.
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at '{MODEL_PATH}'. Please place the trained model in the same directory as this script.")

    model_data = joblib.load(MODEL_PATH)
    model = model_data['model']
    feature_names = model_data['feature_names']
    explainer = shap.TreeExplainer(model)
    
    # Align Columns with the Model's Training Features
    model_features_df = pd.DataFrame(columns=feature_names)
    final_df = pd.concat([model_features_df, model_input_df], sort=False).fillna(0)
    final_df = final_df[feature_names]

    probabilities = model.predict_proba(final_df)[:, 1]
    shap_values = explainer.shap_values(final_df)
    
    results = []
    for i, (sid, prob) in enumerate(zip(rich_features_df['student_id'], probabilities)):
        risk_category = "High Risk" if prob > 0.5 else "Low Risk"
        result = {
            "student_id": sid,
            "risk_score": round(float(prob), 4),
            "risk_category": risk_category
        }

        if risk_category == "High Risk":
            shap_vals_for_prediction = shap_values[1] if isinstance(shap_values, list) else shap_values
            shap_df = pd.DataFrame([shap_vals_for_prediction[i]], columns=feature_names)
            top_features = shap_df.T.sort_values(by=0, ascending=False).head(3)
            
            explanation_parts = []
            for feature, _ in top_features.iterrows():
                feature_value = rich_features_df.loc[i, feature] if feature in rich_features_df.columns else final_df.loc[i, feature]
                if isinstance(feature_value, float):
                    feature_value = f"{feature_value:.2f}"
                explanation_parts.append(f"`{feature}` of {feature_value}")
            
            result["explanation"] = "Risk increased by: " + ", ".join(explanation_parts) + "."
            
        results.append(result)
        
    return results

# ==============================================================================
#  3. FASTAPI APP (from main.py)
# ==============================================================================
app = FastAPI(
    title="Explainable AI Dropout Prediction API",
    description="A single-file API to ingest student data, predict dropout risk, and provide SHAP-based explanations.",
    version="3.0.0"
)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Dropout Prediction API! It is running."}

@app.post("/predict", tags=["Prediction"])
async def predict_dropout(files: List[UploadFile] = File(..., description="Upload the 5 required .xlsx files.")):
    try:
        file_dict = {f.filename: f for f in files}
        required_files = ["students.xlsx", "attendance.xlsx", "assessments.xlsx", "activities.xlsx", "fees.xlsx"]
        
        if not all(f in file_dict for f in required_files):
            raise HTTPException(status_code=400, detail=f"Missing files. Please upload all 5: {required_files}")

        dfs = {name.split('.')[0]: pd.read_excel(io.BytesIO(await file.read())) for name, file in file_dict.items()}
        
        features_df, model_input_df = process_data_for_prediction(
            dfs['students'], dfs['attendance'], dfs['assessments'], dfs['activities'], dfs['fees']
        )
        
        predictions = load_model_and_predict_with_shap(features_df, model_input_df)
        
        return JSONResponse(content={"predictions": predictions})

    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# ==============================================================================
#  4. SERVER RUNNER
# ==============================================================================
if __name__ == "__main__":
    print("Starting server... Go to http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)