"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import {
  Brain, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, 
  BarChart3, Users, GraduationCap, DollarSign, Calendar, Activity,
  Mail, MessageSquare, Bell, BookOpen, Target
} from 'lucide-react'

interface StudentData {
  student_id: string
  name: string
  course: string
  risk_score: number
  risk_category: string
  explanation?: string
  attendance: number
  avgScore: number
  monthlyAttendance: Array<{month: string, attendance: number, target: number}>
  assessmentTrends: Array<{assessment: string, score: number, maxScore: number}>
  upcomingDues: Array<{type: string, amount: number, dueDate: string}>
  recentActivities: Array<{type: string, date: string, points?: number}>
}

export default function StudentDashboardWithAI({ studentId }: { studentId: string }) {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  // Mock data for demonstration
  const mockData: StudentData = {
    student_id: "STU001",
    name: "Amit Kumar",
    course: "Computer Science Engineering",
    risk_score: 0.75,
    risk_category: "High Risk",
    explanation: "Risk increased by: overall_attendance_pct of 65.2%, avg_score_pct of 45.1%, payment_delay of 15 days.",
    attendance: 65.2,
    avgScore: 45.1,
    monthlyAttendance: [
      { month: 'Jan', attendance: 85, target: 75 },
      { month: 'Feb', attendance: 78, target: 75 },
      { month: 'Mar', attendance: 72, target: 75 },
      { month: 'Apr', attendance: 68, target: 75 },
      { month: 'May', attendance: 65, target: 75 }
    ],
    assessmentTrends: [
      { assessment: 'IA1', score: 18, maxScore: 30 },
      { assessment: 'IA2', score: 22, maxScore: 30 },
      { assessment: 'Mid-Sem', score: 35, maxScore: 70 },
      { assessment: 'Assignment 1', score: 8, maxScore: 10 },
      { assessment: 'Assignment 2', score: 9, maxScore: 10 }
    ],
    upcomingDues: [
      { type: 'Fee Payment', amount: 25000, dueDate: '2024-09-15' },
      { type: 'Assignment 3', amount: 0, dueDate: '2024-09-10' },
      { type: 'Project Submission', amount: 0, dueDate: '2024-09-20' }
    ],
    recentActivities: [
      { type: 'LMS Login', date: '2024-08-29', points: 5 },
      { type: 'Video Watched', date: '2024-08-28', points: 3 },
      { type: 'Quiz Attempted', date: '2024-08-26', points: 10 },
      { type: 'Forum Post', date: '2024-08-25', points: 2 }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudentData(mockData)
      setLoading(false)
    }, 1000)
  }, [studentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">Loading AI Analysis...</p>
        </div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-slate-600 dark:text-slate-400">Student data not found or predictions haven't been generated yet.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const riskColor = studentData.risk_score > 0.5 ? 'red' : studentData.risk_score > 0.3 ? 'yellow' : 'green'
  const riskBgClass = riskColor === 'red' ? 'from-red-500 to-red-600' : 
                      riskColor === 'yellow' ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${riskBgClass} text-white`}>
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{studentData.name}</h1>
                <p className="text-slate-600 dark:text-slate-400">{studentData.student_id} • {studentData.course}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={riskColor === 'red' ? 'destructive' : riskColor === 'yellow' ? 'default' : 'secondary'}
                className="text-lg px-4 py-2 font-semibold"
              >
                {studentData.risk_category}
              </Badge>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Risk Score</p>
                <p className={`text-2xl font-bold ${riskColor === 'red' ? 'text-red-600' : riskColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {(studentData.risk_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* AI Alert Section */}
        {studentData.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className={`border-${riskColor}-200 bg-${riskColor}-50 dark:bg-${riskColor}-900/20 shadow-lg`}>
              <Brain className={`h-5 w-5 text-${riskColor}-600`} />
              <AlertDescription className={`text-${riskColor}-700 dark:text-${riskColor}-400`}>
                <strong>AI Analysis:</strong> {studentData.explanation}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Current Attendance</p>
                  <p className="text-3xl font-bold">{studentData.attendance}%</p>
                  <p className="text-blue-200 text-xs">Target: 75%</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Average Score</p>
                  <p className="text-3xl font-bold">{studentData.avgScore}%</p>
                  <p className="text-green-200 text-xs">Target: 60%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${riskBgClass} text-white border-none shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-${riskColor}-100 text-sm font-medium`}>Dropout Risk</p>
                  <p className="text-3xl font-bold">{(studentData.risk_score * 100).toFixed(1)}%</p>
                  <p className={`text-${riskColor}-200 text-xs`}>AI Prediction</p>
                </div>
                <Brain className={`h-8 w-8 text-${riskColor}-200`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Activities This Month</p>
                  <p className="text-3xl font-bold">{studentData.recentActivities.length}</p>
                  <p className="text-purple-200 text-xs">Keep it up!</p>
                </div>
                <Activity className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Attendance Trend</span>
                </CardTitle>
                <CardDescription>Monthly attendance vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={studentData.monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Your Attendance"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Required (75%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Assessment Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Assessment Performance</span>
                </CardTitle>
                <CardDescription>Your scores across different assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentData.assessmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assessment" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}`, name]} />
                    <Bar dataKey="score" fill="#10b981" name="Your Score" />
                    <Bar dataKey="maxScore" fill="#e5e7eb" name="Max Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Analysis & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>AI-Powered Recommendations</span>
                </CardTitle>
                <CardDescription>Personalized action items to improve your academic performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData.attendance < 75 && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">Critical: Improve Attendance</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          Your attendance is {studentData.attendance}%. You need to maintain 75% to avoid academic penalties.
                        </p>
                        <div className="mt-2">
                          <Progress value={studentData.attendance} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {studentData.avgScore < 50 && (
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Focus on Academics</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Your average score is {studentData.avgScore}%. Consider additional study sessions or tutoring.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                          Schedule Tutoring
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">Stay Engaged</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Regular LMS activity and participation in forums helps improve your learning outcomes.
                      </p>
                    </div>
                  </div>
                </div>

                {studentData.upcomingDues.some(due => due.type.includes('Fee')) && (
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">Fee Payment Due</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                          Complete your fee payment to avoid academic holds.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Due Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Upcoming Deadlines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentData.upcomingDues.map((due, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{due.type}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{due.dueDate}</p>
                    </div>
                    {due.amount > 0 && (
                      <Badge variant="outline" className="font-mono">
                        ₹{due.amount.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Recent Learning Activities</span>
              </CardTitle>
              <CardDescription>Your engagement with the learning platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studentData.recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {activity.type === 'LMS Login' && <Users className="h-6 w-6 text-blue-600" />}
                      {activity.type === 'Video Watched' && <BookOpen className="h-6 w-6 text-green-600" />}
                      {activity.type === 'Quiz Attempted' && <BarChart3 className="h-6 w-6 text-purple-600" />}
                      {activity.type === 'Forum Post' && <MessageSquare className="h-6 w-6 text-orange-600" />}
                    </div>
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{activity.type}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{activity.date}</p>
                    {activity.points && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        +{activity.points} pts
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Tools to help improve your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="p-6 h-auto flex-col space-y-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <BookOpen className="h-8 w-8" />
                  <span>Study Materials</span>
                  <span className="text-xs opacity-80">Access course content</span>
                </Button>
                
                <Button className="p-6 h-auto flex-col space-y-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Users className="h-8 w-8" />
                  <span>Join Study Group</span>
                  <span className="text-xs opacity-80">Connect with peers</span>
                </Button>
                
                <Button className="p-6 h-auto flex-col space-y-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  <MessageSquare className="h-8 w-8" />
                  <span>Request Help</span>
                  <span className="text-xs opacity-80">Talk to counselor</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}