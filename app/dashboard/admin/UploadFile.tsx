"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Upload, FileSpreadsheet, AlertTriangle, CheckCircle, 
  TrendingUp, BarChart3, RefreshCw, Brain, Bell, 
  Activity, Clock, Mail, MessageSquare, Search, Eye,
  ArrowDown, FileCheck, Zap
} from 'lucide-react'

export default function UploadDashboard() {
  const [uploading, setUploading] = useState({
    students: false,
    attendance: false,
    assessments: false,
    activities: false,
    fees: false
  })
  
  const [uploadStatus, setUploadStatus] = useState({
    students: null,
    attendance: null,
    assessments: null,
    activities: null,
    fees: null
  })

  const [predictions, setPredictions] = useState([])
  const [generating, setGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const fileRefs = {
    students: useRef(null),
    attendance: useRef(null),
    assessments: useRef(null),
    activities: useRef(null),
    fees: useRef(null)
  }

  const uploadCards = [
    { 
      key: 'students', 
      title: 'Student Master Data', 
      description: 'Upload students.xlsx with student profiles, IDs, and course information', 
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      key: 'attendance', 
      title: 'Attendance Records', 
      description: 'Upload attendance.xlsx with daily attendance tracking data', 
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    { 
      key: 'assessments', 
      title: 'Assessment Scores', 
      description: 'Upload assessments.xlsx with exam scores and grade records', 
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      key: 'activities', 
      title: 'Student Activities', 
      description: 'Upload activities.xlsx with LMS logins and participation data', 
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      key: 'fees', 
      title: 'Fee Records', 
      description: 'Upload fees.xlsx with payment history and outstanding dues', 
      icon: FileSpreadsheet,
      color: 'from-red-500 to-red-600'
    }
  ]

  const handleFileUpload = async (type, file) => {
    // Validate file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(`.${fileExtension}`)) {
      alert('Please upload only Excel or CSV files');
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB');
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
      return;
    }

    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    setUploadStatus(prev => ({ ...prev, [type]: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/upload/${type}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
      
    } catch (error) {
      console.error(`${type} upload error:`, error);
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  }

  const generatePredictions = async () => {
    setGenerating(true);
    setShowResults(false);

    const hasUploads = Object.values(uploadStatus).some(status => status === 'success');
    
    if (!hasUploads) {
      alert('Please upload at least one file before generating predictions.');
      setGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/predict', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
        setShowResults(true);
        
        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Prediction generation failed:', errorData);
        alert('Failed to generate predictions: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to generate predictions:', error);
      alert('Network error when generating predictions');
    } finally {
      setGenerating(false);
    }
  }

  const sendNotification = async (studentId, type) => {
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, type })
      })
      alert(`${type} notification sent successfully!`)
    } catch (error) {
      alert(`Failed to send ${type} notification`)
    }
  }

  const filteredPredictions = predictions.filter(p => 
    p && ((p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.student_id && p.student_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.course && p.course.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const highRiskStudents = filteredPredictions.filter(p => p && p.risk_score > 0.5);
  const uploadedFiles = Object.values(uploadStatus).filter(status => status === 'success').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
    

        {/* Upload Files Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                <Upload className="h-6 w-6 mr-3 text-blue-600" />
                Upload Required Files
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Upload Excel/CSV files to train the AI model for accurate predictions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {uploadedFiles}/5 Files Uploaded
              </Badge>
              <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(uploadedFiles / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadCards.map((card, index) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border-none shadow-lg bg-white dark:bg-slate-800 group hover:scale-105 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <card.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                        </div>
                      </div>
                      {uploadStatus[card.key] === 'success' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-green-100 dark:bg-green-900 rounded-full p-1"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </motion.div>
                      )}
                    </div>
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 relative">
                    <input
                      type="file"
                      ref={fileRefs[card.key]}
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(card.key, e.target.files?.[0])}
                      className="hidden"
                    />
                    
                    <Button
                      variant="outline"
                      disabled={uploading[card.key]}
                      onClick={() => fileRefs[card.key].current?.click()}
                      className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 h-12"
                    >
                      {uploading[card.key] ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : uploadStatus[card.key] === 'success' ? (
                        <>
                          <FileCheck className="h-4 w-4 mr-2 text-green-600" />
                          File Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>

                    <AnimatePresence>
                      {uploadStatus[card.key] === "success" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
                              Successfully uploaded and processed!
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                      
                      {uploadStatus[card.key] === "error" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
                              Upload failed. Please try again with a valid file.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Generate Predictions Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Generate AI Predictions
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Process uploaded data through our advanced AI model to identify at-risk students
              </p>
            </div>
            
            <Button 
              onClick={generatePredictions}
              disabled={generating || uploadedFiles === 0}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8 py-4 text-lg font-semibold disabled:from-slate-400 disabled:to-slate-500"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                  Generating Predictions...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-3" />
                  Generate AI Predictions
                </>
              )}
            </Button>
            
            {uploadedFiles === 0 && (
              <p className="text-sm text-slate-500 mt-4">
                Please upload at least one file to generate predictions
              </p>
            )}
          </div>
          
          {uploadedFiles > 0 && !showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <ArrowDown className="h-6 w-6 text-blue-600 mx-auto animate-bounce" />
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              id="results-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                    <Users className="h-6 w-6 mr-3 text-blue-600" />
                    Student Risk Analysis Results
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    AI-powered insights and actionable recommendations for student success
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <Badge variant="destructive" className="px-4 py-2 text-sm font-semibold">
                    {highRiskStudents.length} High Risk Students
                  </Badge>
                </div>
              </div>

              {/* Student Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPredictions.map((student, index) => (
                  <motion.div
                    key={student.student_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`shadow-lg border-none transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      student.risk_score > 0.5 
                        ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-l-4 border-l-red-500' 
                        : 'bg-white dark:bg-slate-800 border-l-4 border-l-green-500'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {student.student_id} • {student.course}
                            </CardDescription>
                          </div>
                          <Badge 
                            variant={student.risk_score > 0.5 ? "destructive" : "default"}
                            className="font-semibold px-3 py-1"
                          >
                            {(student.risk_score * 100).toFixed(1)}% Risk
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Attendance: {student.attendance}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4 text-green-600" />
                            <span>Avg Score: {student.avgScore}%</span>
                          </div>
                          <div className="flex items-center space-x-2 col-span-2">
                            <Activity className="h-4 w-4 text-purple-600" />
                            <span>Last Login: {student.lastLogin}</span>
                          </div>
                        </div>

                        {student.explanation && (
                          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                            <Brain className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700 dark:text-red-400 text-xs">
                              <strong>AI Analysis:</strong> {student.explanation}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendNotification(student.student_id, 'email')}
                            className="flex-1 text-xs"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendNotification(student.student_id, 'whatsapp')}
                            className="flex-1 text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            WhatsApp
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedStudent(student)}
                            className="px-3"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredPredictions.length === 0 && predictions.length > 0 && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">No students found</h3>
                  <p className="text-slate-500 dark:text-slate-500">Try adjusting your search terms</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Student Detail Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedStudent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{selectedStudent.student_id} • {selectedStudent.course}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="rounded-full w-10 h-10 p-0">
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Risk Score</p>
                        <p className="text-3xl font-bold text-red-600">{(selectedStudent.risk_score * 100).toFixed(1)}%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Attendance</p>
                        <p className="text-3xl font-bold text-blue-600">{selectedStudent.attendance}%</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
                        <p className="text-3xl font-bold text-green-600">{selectedStudent.avgScore}%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Activity</p>
                        <p className="text-lg font-semibold text-purple-600">{selectedStudent.lastLogin}</p>
                      </div>
                    </div>
                  </div>

                  {selectedStudent.explanation && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 mb-6">
                      <Brain className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700 dark:text-red-400">
                        <strong>AI Analysis:</strong> {selectedStudent.explanation}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => sendNotification(selectedStudent.student_id, 'email')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email Alert
                    </Button>
                    <Button 
                      onClick={() => sendNotification(selectedStudent.student_id, 'whatsapp')}
                      className="flex-1 bg-green-600 hover:green-blue-700 shadow-lg"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send WhatsApp
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}