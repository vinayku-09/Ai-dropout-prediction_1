"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import {
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  School,
  TrendingUp,
  Calendar,
  LogOut,
  Home,
  BookOpen,
  Target,
  Clock,
  DollarSign,
  User,
  Award,
  AlertCircle
} from 'lucide-react'

export default function StudentDashboard() {
  const mockData = {
    student: {
      name: 'Aditya Nishad',
      id: 'IOT250600284',
      department: 'Computer Science Engineering',
      semester: '5th Semester',
      instituteCode: 'DEMO1234'
    },
    riskScore: 35, // Out of 100 (lower is better)
    riskLevel: 'Medium',
    attendance: {
      overall: 78,
      subjects: [
        { name: 'Data Structures', attendance: 85, classes: 20 },
        { name: 'Database Systems', attendance: 72, classes: 18 },
        { name: 'Computer Networks', attendance: 80, classes: 16 },
        { name: 'Software Engineering', attendance: 75, classes: 22 }
      ]
    },
    grades: {
      cgpa: 7.8,
      sgpa: 7.5,
      subjects: [
        { name: 'Data Structures', ia1: 18, ia2: 16, midSem: 35, expected: 'B+' },
        { name: 'Database Systems', ia1: 15, ia2: 19, midSem: 40, expected: 'A-' },
        { name: 'Computer Networks', ia1: 17, ia2: 14, midSem: 32, expected: 'B' },
        { name: 'Software Engineering', ia1: 19, ia2: 18, midSem: 38, expected: 'A-' }
      ]
    },
    fees: {
      total: 85000,
      paid: 60000,
      pending: 25000,
      dueDate: '2024-02-15'
    },
    alerts: [
      { type: 'warning', message: 'Attendance below 75% in Database Systems', date: '2 days ago' },
      { type: 'info', message: 'Fee payment due in 15 days', date: '1 week ago' },
      { type: 'success', message: 'Excellent performance in Software Engineering IA2', date: '2 weeks ago' }
    ]
  }

  const handleSignOut = () => {
    toast({
      title: "Signed Out Successfully",
      description: "You have been logged out of your account.",
      variant: "default",
    })
    setTimeout(() => {
      window.location.href = '/'
    }, 1000)
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {mockData.student.name} • {mockData.student.id} • {mockData.student.semester}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-2">
                <School className="h-3 w-3" />
                <span>Code: {mockData.student.instituteCode}</span>
              </Badge>
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Risk Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className={`shadow-lg border-2 ${getRiskColor(mockData.riskLevel).includes('red') ? 'border-red-200' : mockData.riskLevel === 'Medium' ? 'border-orange-200' : 'border-green-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${getRiskColor(mockData.riskLevel)}`}>
                    <Target className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle>AI Risk Assessment</CardTitle>
                    <CardDescription>Your current dropout risk analysis</CardDescription>
                  </div>
                </div>
                <Badge className={getRiskColor(mockData.riskLevel)}>
                  {mockData.riskLevel} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className="text-sm font-bold">{mockData.riskScore}/100</span>
                  </div>
                  <Progress 
                    value={100 - mockData.riskScore} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower scores indicate higher risk. Work on attendance and grades to improve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{mockData.attendance.overall}%</span>
              </div>
              <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Overall Attendance</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Award className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{mockData.grades.cgpa}</span>
              </div>
              <CardTitle className="text-sm text-green-800 dark:text-green-200">Current CGPA</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-6 w-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{mockData.grades.sgpa}</span>
              </div>
              <CardTitle className="text-sm text-purple-800 dark:text-purple-200">Semester GPA</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="h-6 w-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">₹{mockData.fees.pending.toLocaleString()}</span>
              </div>
              <CardTitle className="text-sm text-orange-800 dark:text-orange-200">Pending Fees</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Attendance Details</span>
                </CardTitle>
                <CardDescription>Subject-wise attendance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.attendance.subjects.map((subject, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-sm font-bold">{subject.attendance}%</span>
                      </div>
                      <Progress 
                        value={subject.attendance} 
                        className={`h-2 ${subject.attendance < 75 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(subject.classes * subject.attendance / 100)} out of {subject.classes} classes attended
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grades Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Academic Performance</span>
                </CardTitle>
                <CardDescription>Current semester grades and projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.grades.subjects.map((subject, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{subject.name}</h4>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Expected: {subject.expected}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-muted-foreground">IA1</p>
                          <p className="font-bold">{subject.ia1}/20</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">IA2</p>
                          <p className="font-bold">{subject.ia2}/20</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Mid-Sem</p>
                          <p className="font-bold">{subject.midSem}/50</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Alerts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span>Recent Alerts & Updates</span>
              </CardTitle>
              <CardDescription>Important notifications and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.alerts.map((alert, idx) => (
                  <Alert 
                    key={idx}
                    className={`${
                      alert.type === 'warning' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20' :
                      alert.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-900/20' :
                      'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {alert.type === 'info' && <Clock className="h-4 w-4 text-blue-600" />}
                    <div className="flex justify-between items-start">
                      <AlertDescription className={`${
                        alert.type === 'warning' ? 'text-orange-800 dark:text-orange-200' :
                        alert.type === 'success' ? 'text-green-800 dark:text-green-200' :
                        'text-blue-800 dark:text-blue-200'
                      }`}>
                        {alert.message}
                      </AlertDescription>
                      <span className="text-xs text-muted-foreground ml-4">
                        {alert.date}
                      </span>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fee Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Fee Details</span>
              </CardTitle>
              <CardDescription>Payment status and due dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{mockData.fees.paid.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">₹{mockData.fees.pending.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-lg font-bold text-blue-600">{mockData.fees.dueDate}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Payment Progress</span>
                  <span className="text-sm font-medium">
                    {Math.round((mockData.fees.paid / mockData.fees.total) * 100)}% Complete
                  </span>
                </div>
                <Progress value={(mockData.fees.paid / mockData.fees.total) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}