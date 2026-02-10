"use client"


import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import {
  Users,
  Upload,
  GraduationCap,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  School,
  TrendingUp,
  BarChart3,
  LogOut,
  Home,
  BookOpen,
  Calendar,
  UserX,
  Target
} from 'lucide-react'

export default function TeacherDashboard() {
  const [uploading, setUploading] = useState({
    attendance: false,
    assessments: false
  })
  
  const [uploadStatus, setUploadStatus] = useState({
    attendance: null,
    assessments: null
  })

  // File upload refs
  const fileRefs = {
    attendance: useRef(null),
    assessments: useRef(null)
  }

  const mockStats = {
    totalStudents: 156,
    totalClasses: 8,
    atRiskStudents: 23,
    teacherName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    instituteCode: 'DEMO1234',
    recentUploads: [
      { file: 'attendance_week1.xlsx', date: '2024-01-15', records: 156, status: 'success' },
      { file: 'mid_term_scores.xlsx', date: '2024-01-14', records: 156, status: 'success' }
    ]
  }

  const handleFileUpload = async (type: string, file: File | null) => {
    if (!file) return

    setUploading(prev => ({ ...prev, [type]: true }))
    setUploadStatus(prev => ({ ...prev, [type]: null }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      if (Math.random() > 0.2) {
        setUploadStatus(prev => ({ ...prev, [type]: 'success' }))
        toast({
          title: "Upload Successful! 🎉",
          description: `${type} data has been uploaded and processed successfully.`,
          variant: "default",
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }))
      toast({
        title: "Upload Failed ❌",
        description: "Please check your file format and try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
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

  const uploadCards = [
    {
      key: 'attendance',
      title: 'Student Attendance',
      description: 'Upload daily attendance records',
      icon: Calendar,
      requiredColumns: ['student_id', 'date', 'is_present', 'subject_code']
    },
    {
      key: 'assessments',
      title: 'Assessment Scores',
      description: 'Upload exam and assignment scores',
      icon: BarChart3,
      requiredColumns: ['student_id', 'assessment_name', 'max_score', 'score_obtained']
    }
  ]

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
              <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/20">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">{mockStats.teacherName} • {mockStats.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-2">
                <School className="h-3 w-3" />
                <span>Code: {mockStats.instituteCode}</span>
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
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{mockStats.totalStudents}</span>
              </div>
              <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Total Students</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{mockStats.totalClasses}</span>
              </div>
              <CardTitle className="text-sm text-green-800 dark:text-green-200">Active Classes</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">{mockStats.atRiskStudents}</span>
              </div>
              <CardTitle className="text-sm text-orange-800 dark:text-orange-200">At-Risk Students</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="h-6 w-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">85%</span>
              </div>
              <CardTitle className="text-sm text-purple-800 dark:text-purple-200">Class Average</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        <Tabs defaultValue="uploads" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="uploads">Data Upload</TabsTrigger>
            <TabsTrigger value="students">At-Risk Students</TabsTrigger>
            <TabsTrigger value="analytics">Class Analytics</TabsTrigger>
          </TabsList>

          {/* Uploads Section */}
          <TabsContent value="uploads">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {uploadCards.map((card) => (
                <Card key={card.key} className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <card.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="file"
                      ref={fileRefs[card.key as keyof typeof fileRefs]}
                      accept=".xlsx,.csv"
                      onChange={(e) => handleFileUpload(card.key, e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      disabled={uploading[card.key as keyof typeof uploading]}
                      onClick={() => fileRefs[card.key as keyof typeof fileRefs].current?.click()}
                      className="w-full h-12 border-2 hover:border-primary"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading[card.key as keyof typeof uploading] ? "Uploading..." : "Choose File"}
                    </Button>

                    {uploadStatus[card.key as keyof typeof uploadStatus] === "success" && (
                      <Alert className="mt-3 border-green-500 bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Upload successful! Data has been processed.
                        </AlertDescription>
                      </Alert>
                    )}
                    {uploadStatus[card.key as keyof typeof uploadStatus] === "error" && (
                      <Alert className="mt-3 border-red-500 bg-red-50 dark:bg-red-900/20">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          Upload failed. Please check file format and try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium mb-2">Required Columns:</p>
                      <div className="flex flex-wrap gap-1">
                        {card.requiredColumns.map((col) => (
                          <Badge key={col} variant="secondary" className="text-xs">
                            {col}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* At-Risk Students Section */}
          <TabsContent value="students">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <UserX className="h-6 w-6 text-red-500" />
                    <div>
                      <CardTitle>At-Risk Students</CardTitle>
                      <CardDescription>Students requiring immediate attention</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: '2023001', name: 'Aditya Nishad', risk: 'High', reason: 'Low attendance (45%)' },
                      { id: '2023045', name: 'Sanjay Ravnit', risk: 'Medium', reason: 'Declining grades' },
                      { id: '2023089', name: 'Nares Choudhary', risk: 'High', reason: 'Multiple missed exams' },
                      { id: '2023123', name: 'VinayKumar Singh f3', risk: 'Medium', reason: 'Irregular attendance' }
                    ].map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                          <p className="text-sm text-muted-foreground">{student.reason}</p>
                        </div>
                        <Badge 
                          variant={student.risk === 'High' ? 'destructive' : 'secondary'}
                          className={student.risk === 'High' ? '' : 'bg-orange-100 text-orange-800'}
                        >
                          {student.risk} Risk
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Analytics Section */}
          <TabsContent value="analytics">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Recent Uploads</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockStats.recentUploads.map((upload, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm">{upload.file}</p>
                          <p className="text-xs text-muted-foreground">{upload.records} records</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{upload.date}</p>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Success
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Class Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Excellent (90-100%)</span>
                        <span className="text-sm font-medium">32 students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[20%]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Good (80-89%)</span>
                        <span className="text-sm font-medium">45 students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-[29%]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Average (70-79%)</span>
                        <span className="text-sm font-medium">56 students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-[36%]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Below Average (&lt;70%)</span>
                        <span className="text-sm font-medium">23 students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full w-[15%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}