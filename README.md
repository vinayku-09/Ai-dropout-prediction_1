Here is a highly professional, comprehensive, and well-structured `README.md` file designed for your **AI Student Dropout Prediction** platform. This layout clearly highlights the sophisticated Next.js + Python tech stack, structural breakdown, and setup process evident in your project data.

---

# AI Student Dropout Prediction Platform

An enterprise-grade, full-stack predictive analytics platform designed for educational institutions. By leveraging advanced machine learning models alongside a robust web framework, this system helps administrators, teachers, and students identify early warning signs of academic disengagement and take proactive measures to improve student retention.

---

## 🚀 Key Features

* **Role-Based Dashboards:** Distinct, secure user experiences built dynamically for **Administrators**, **Teachers**, and **Students**.
* **Predictive AI Core:** An integrated Python intelligence engine that analyzes student activity, attendance trends, assessment scores, and financial records to predict attrition risks.
* **Comprehensive Data Ingestion:** Administrative APIs to securely upload and process institutional data (`students`, `attendance`, `fees`, `assessments`, and `activities`).
* **Systemic Notifications:** An automated alert workflow designed to flag high-risk students and notify relevant academic stakeholders instantly.
* **Modern UI/UX Component Library:** A gorgeous responsive interface tailored using Tailwind CSS, Radix UI primitives, and custom 3D design configurations (Spline).

---

## 🛠️ Technology Stack

### Frontend & Core API (Next.js)

* **Framework:** Next.js (App Router, TypeScript)
* **Authentication:** NextAuth.js
* **Database ORM:** Prisma
* **UI Components:** Shadcn/ui (Tailwind CSS, Radix UI primitives, Lucide icons, Sonner notifications)

### Machine Learning Core (Python)

* **Environment:** Python API wrapper (`app.py`) for predictive analytics processing.

---

## 📂 Project Structure

The repository is modularized cleanly into decoupled layers handling the client views, backend database persistence, data ingestion, and predictive AI algorithms:

```text
├── app/
│   ├── api/                           # Next.js API Routes
│   │   ├── admin/                     # Admin workflows (Ingestion, Configuration, Export)
│   │   │   ├── analytics/
│   │   │   ├── upload/                # CSV Data parsing (activities, assessments, fees, students)
│   │   │   └── setup-institute/
│   │   ├── ai/predict/                # Machine learning orchestration bridge
│   │   └── auth/                      # Authentication pipeline (NextAuth, Registration)
│   ├── auth/                          # Client-side Sign-In / Sign-Up layouts
│   ├── dashboard/                     # Multi-role dashboard views (admin, student, teachers)
│   └── app.py                         # Python ML Engine Core
├── components/                        # High-level feature components (AIDemo, Stats, Navigation)
│   └── ui/                            # Atomic Radix/Shadcn design primitives
├── hooks/                             # Reusable React hooks (use-toast, use-mobile)
├── lib/                               # Core shared utilities (Prisma client, validation, notifications)
└── prisma/                            # Database schema engineering and migration tracking
    ├── migrations/
    └── schema.prisma

```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed locally on your system:

* **Node.js** (v18.x or later recommended)
* **PNPM** or **NPM** package manager
* **Python 3.9+** (with `pip`)
* A relational database engine supported by Prisma (PostgreSQL, MySQL, SQLite, etc.)

---

### Step 1: Environment Initialization

Clone the repository and create an `.env` file in the root directory based on your environment needs:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-super-secure-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
# AI/ML Specific configs
AI_ENGINE_URL="http://localhost:5000"

```

### Step 2: Install Node Dependencies

Using **pnpm** (or your preferred package manager):

```bash
pnpm install

```

### Step 3: Database Synchronization & Seeding

Generate the Prisma Client framework and run migrations to create the required database tables:

```bash
npx prisma migrate dev --name init
npx prisma db seed

```

### Step 4: Python Machine Learning Setup

Navigate to the ML code directory, set up your virtual environment, install dependencies, and spin up the predictive module server:

```bash
# Optional: Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install required analytics packages (pandas, scikit-learn, flask/fastapi, etc.)
pip install -r requirements.txt

# Run the predictive engine backend
python app/app.py

```

### Step 5: Start the Web Application

In a separate terminal window, launch the local Next.js development workflow server:

```bash
pnpm dev

```

Open your browser and navigate to **`http://localhost:3000`** to view the live interface.

---

## 🔒 Security & Data Compliance

* **Middleware Protection:** Client-side paths and administrative API end-points are systematically guarded using Next.js Middleware routines based on JWT session validations.
* **Input Data Validation:** Strict schemas validation layers reside within `lib/utils/validation.ts` preventing invalid or corrupted records from breaching critical database storage.

---

## 📜 License

This project is configured as proprietary software. All internal source material and architectural code-bases are subject to private development licensing.
