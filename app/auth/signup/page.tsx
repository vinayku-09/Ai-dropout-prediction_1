"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import Link from "next/link";
import {
  School,
  Users,
  GraduationCap,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  IdCard,
  BookOpen
} from 'lucide-react'

export default function RegistrationPage() {
  const [activeTab, setActiveTab] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    instituteName: '',
    phone: '',
    address: '',
    website: ''
  })

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    password: '',
    instituteCode: '',
    facultyId: '',
    department: '',
    phone: ''
  })

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    instituteCode: '',
    studentId: '',
    department: '',
    phone: ''
  })

  const handleSubmit = async (role: string) => {
    setLoading(true)

    try {
      const formData = role === 'admin' ? adminForm : role === 'teacher' ? teacherForm : studentForm
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock success response
      const mockSuccess = Math.random() > 0.2 // 80% success rate for demo

      if (mockSuccess) {
        const instituteCode = role === 'admin' ? 'EDU' + Math.random().toString(36).substr(2, 5).toUpperCase() : null
        
        toast({
          title: "Registration Successful! 🎉",
          description: role === 'admin' 
            ? `Welcome! Your institute code is: ${instituteCode}. Share this with your teachers and students.`
            : `Welcome to EduEWS! You can now access your ${role} dashboard.`,
          variant: "default",
          duration: 5000,
        })
        
        // Reset form
        if (role === 'admin') setAdminForm({ name: '', email: '', password: '', instituteName: '', phone: '', address: '', website: '' })
        if (role === 'teacher') setTeacherForm({ name: '', email: '', password: '', instituteCode: '', facultyId: '', department: '', phone: '' })
        if (role === 'student') setStudentForm({ name: '', email: '', password: '', instituteCode: '', studentId: '', department: '', phone: '' })
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/auth/signin'
        }, 2000)
        
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      toast({
        title: "Registration Failed ❌",
        description: "Please check your information and try again. Make sure all required fields are filled.",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <School className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EduEWS
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center space-x-3 mb-6"
            >
              <div className="p-3 rounded-2xl bg-primary/10">
                <School className="h-12 w-12 text-primary" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Join EduEWS
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your account and start using AI-powered early warning system for educational excellence
            </p>
          </div>

          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
                    <TabsTrigger value="admin" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Institute Admin</span>
                    </TabsTrigger>
                    <TabsTrigger value="teacher" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Users className="h-4 w-4" />
                      <span>Teacher</span>
                    </TabsTrigger>
                    <TabsTrigger value="student" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>Student</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Admin Registration */}
                  <TabsContent value="admin">
                    <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                          <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Create Institute Account</h2>
                        <p className="text-muted-foreground">Set up your educational institution on EduEWS platform</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="admin-name" className="text-sm font-medium flex items-center space-x-2">
                              <span>Full Name</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="admin-name"
                                value={adminForm.name}
                                onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your full name"
                                className="pl-4 h-12 border-2 focus:border-primary transition-colors"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="admin-email" className="text-sm font-medium flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>Official Email</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="admin-email"
                              type="email"
                              value={adminForm.email}
                              onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="admin@yourinstitute.edu"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="institute-name" className="text-sm font-medium flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>Institute Name</span>
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="institute-name"
                            value={adminForm.instituteName}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, instituteName: e.target.value }))}
                            placeholder="Your Educational Institution"
                            className="h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin-password" className="text-sm font-medium flex items-center space-x-2">
                            <span>Password</span>
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="admin-password"
                              type={showPassword ? "text" : "password"}
                              value={adminForm.password}
                              onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Minimum 8 characters"
                              className="h-12 border-2 focus:border-primary transition-colors pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="admin-phone" className="text-sm font-medium flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>Phone Number</span>
                            </Label>
                            <Input
                              id="admin-phone"
                              value={adminForm.phone}
                              onChange={(e) => setAdminForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+91 XXXXXXXXXX"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="admin-website" className="text-sm font-medium flex items-center space-x-2">
                              <Globe className="h-4 w-4" />
                              <span>Website</span>
                            </Label>
                            <Input
                              id="admin-website"
                              value={adminForm.website}
                              onChange={(e) => setAdminForm(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://yourinstitute.edu"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin-address" className="text-sm font-medium flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Institute Address</span>
                          </Label>
                          <Input
                            id="admin-address"
                            value={adminForm.address}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Complete address with pincode"
                            className="h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>

                        <Button 
                          onClick={() => handleSubmit('admin')} 
                          disabled={loading || !adminForm.name || !adminForm.email || !adminForm.password || !adminForm.instituteName}
                          className="w-full h-12 text-base font-medium"
                          size="lg"
                        >
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Creating Account...</span>
                            </div>
                          ) : (
                            'Create Institute Account'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* Teacher Registration */}
                  <TabsContent value="teacher">
                    <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                          <Users className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Teacher Registration</h2>
                        <p className="text-muted-foreground">Join your institute's EduEWS system</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="teacher-name" className="text-sm font-medium flex items-center space-x-2">
                              <span>Full Name</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="teacher-name"
                              value={teacherForm.name}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter your full name"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="teacher-email" className="text-sm font-medium flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>Email Address</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="teacher-email"
                              type="email"
                              value={teacherForm.email}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your.email@example.com"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="institute-code" className="text-sm font-medium flex items-center space-x-2">
                              <School className="h-4 w-4" />
                              <span>Institute Code</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="institute-code"
                              value={teacherForm.instituteCode}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, instituteCode: e.target.value.toUpperCase() }))}
                              placeholder="8-character code from admin"
                              maxLength={8}
                              className="h-12 border-2 focus:border-primary transition-colors font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="faculty-id" className="text-sm font-medium flex items-center space-x-2">
                              <IdCard className="h-4 w-4" />
                              <span>Faculty ID</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="faculty-id"
                              value={teacherForm.facultyId}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, facultyId: e.target.value }))}
                              placeholder="Your faculty ID"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="teacher-department" className="text-sm font-medium flex items-center space-x-2">
                              <BookOpen className="h-4 w-4" />
                              <span>Department</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="teacher-department"
                              value={teacherForm.department}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, department: e.target.value }))}
                              placeholder="Computer Science"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="teacher-phone" className="text-sm font-medium flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>Phone Number</span>
                            </Label>
                            <Input
                              id="teacher-phone"
                              value={teacherForm.phone}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+91 XXXXXXXXXX"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="teacher-password" className="text-sm font-medium flex items-center space-x-2">
                            <span>Password</span>
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="teacher-password"
                              type={showPassword ? "text" : "password"}
                              value={teacherForm.password}
                              onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Minimum 8 characters"
                              className="h-12 border-2 focus:border-primary transition-colors pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleSubmit('teacher')} 
                          disabled={loading || !teacherForm.name || !teacherForm.email || !teacherForm.password || !teacherForm.instituteCode || !teacherForm.facultyId}
                          className="w-full h-12 text-base font-medium"
                          size="lg"
                        >
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Creating Account...</span>
                            </div>
                          ) : (
                            'Register as Teacher'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* Student Registration */}
                  <TabsContent value="student">
                    <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                          <GraduationCap className="h-8 w-8 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Student Registration</h2>
                        <p className="text-muted-foreground">Access your academic progress and alerts</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="student-name" className="text-sm font-medium flex items-center space-x-2">
                              <span>Full Name</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="student-name"
                              value={studentForm.name}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter your full name"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-email" className="text-sm font-medium flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>Email Address</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="student-email"
                              type="email"
                              value={studentForm.email}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your.email@example.com"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="student-institute-code" className="text-sm font-medium flex items-center space-x-2">
                              <School className="h-4 w-4" />
                              <span>Institute Code</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="student-institute-code"
                              value={studentForm.instituteCode}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, instituteCode: e.target.value.toUpperCase() }))}
                              placeholder="8-character code from admin"
                              maxLength={8}
                              className="h-12 border-2 focus:border-primary transition-colors font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-id" className="text-sm font-medium flex items-center space-x-2">
                              <IdCard className="h-4 w-4" />
                              <span>Student ID</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="student-id"
                              value={studentForm.studentId}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, studentId: e.target.value }))}
                              placeholder="Your student ID"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="student-department" className="text-sm font-medium flex items-center space-x-2">
                              <BookOpen className="h-4 w-4" />
                              <span>Department/Course</span>
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="student-department"
                              value={studentForm.department}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, department: e.target.value }))}
                              placeholder="B.Tech Computer Science"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-phone" className="text-sm font-medium flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>Phone Number</span>
                            </Label>
                            <Input
                              id="student-phone"
                              value={studentForm.phone}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+91 XXXXXXXXXX"
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="student-password" className="text-sm font-medium flex items-center space-x-2">
                            <span>Password</span>
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="student-password"
                              type={showPassword ? "text" : "password"}
                              value={studentForm.password}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Minimum 8 characters"
                              className="h-12 border-2 focus:border-primary transition-colors pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800 dark:text-amber-200">
                            Your Student ID must match the records uploaded by your institute admin. 
                            Contact your admin if registration fails.
                          </AlertDescription>
                        </Alert>

                        <Button 
                          onClick={() => handleSubmit('student')} 
                          disabled={loading || !studentForm.name || !studentForm.email || !studentForm.password || !studentForm.instituteCode || !studentForm.studentId}
                          className="w-full h-12 text-base font-medium"
                          size="lg"
                        >
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Creating Account...</span>
                            </div>
                          ) : (
                            'Register as Student'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Role Information Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <Card className="bg-card/60 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Institute Admin</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Set up institute account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Get unique institute code</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Upload student master data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Configure AI thresholds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Teacher</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Upload attendance & scores</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>View at-risk students</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Send notifications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Monitor class progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  <span>Student</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Access academic alerts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Track attendance & grades</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Get AI performance insights</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Receive timely notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}