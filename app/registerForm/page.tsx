"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  School,
  Users,
  GraduationCap,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'


export default function RegistrationPage() {
  const [activeTab, setActiveTab] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

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

  const handleSubmit = async (role : string) => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = role === 'admin' ? adminForm : role === 'teacher' ? teacherForm : studentForm
      
      const response = await fetch(`/api/auth/register/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: role === 'admin' 
            ? `Registration successful! Your institute code is: ${result.instituteCode}` 
            : 'Registration successful! You can now sign in.'
        })
        
        // Reset form
        if (role === 'admin') setAdminForm({ name: '', email: '', password: '', instituteName: '', phone: '', address: '', website: '' })
        if (role === 'teacher') setTeacherForm({ name: '', email: '', password: '', instituteCode: '', facultyId: '', department: '', phone: '' })
        if (role === 'student') setStudentForm({ name: '', email: '', password: '', instituteCode: '', studentId: '', department: '', phone: '' })
        
      } else {
        setMessage({ type: 'error', text: result.error || 'Registration failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
   
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <School className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduEWS Registration
            </h1>
          </div>
          <p className="text-muted-foreground">Join the AI-powered early warning system for educational institutions</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Teacher</span>
                </TabsTrigger>
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Student</span>
                </TabsTrigger>
              </TabsList>

              {/* Admin Registration */}
              <TabsContent value="admin" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Create Institute Account</h2>
                  <p className="text-muted-foreground">Set up your educational institution on EduEWS</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admin-name">Full Name *</Label>
                      <Input
                        id="admin-name"
                        value={adminForm.name}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-email">Official Email *</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@yourinstitute.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="institute-name">Institute Name *</Label>
                    <Input
                      id="institute-name"
                      value={adminForm.instituteName}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, instituteName: e.target.value }))}
                      placeholder="Your Educational Institution"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="admin-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={adminForm.password}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 8 characters"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admin-phone">Phone Number</Label>
                      <Input
                        id="admin-phone"
                        value={adminForm.phone}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-website">Website</Label>
                      <Input
                        id="admin-website"
                        value={adminForm.website}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourinstitute.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admin-address">Institute Address</Label>
                    <Input
                      id="admin-address"
                      value={adminForm.address}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Complete address with pincode"
                    />
                  </div>

                  <Button 
                    onClick={() => handleSubmit('admin')} 
                    disabled={loading || !adminForm.name || !adminForm.email || !adminForm.password || !adminForm.instituteName}
                    className="w-full"
                  >
                    {loading ? 'Creating Account...' : 'Create Institute Account'}
                  </Button>
                </div>
              </TabsContent>

              {/* Teacher Registration */}
              <TabsContent value="teacher" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Teacher Registration</h2>
                  <p className="text-muted-foreground">Join your institute's EduEWS system</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher-name">Full Name *</Label>
                      <Input
                        id="teacher-name"
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teacher-email">Email Address *</Label>
                      <Input
                        id="teacher-email"
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="institute-code">Institute Code *</Label>
                      <Input
                        id="institute-code"
                        value={teacherForm.instituteCode}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, instituteCode: e.target.value }))}
                        placeholder="8-character code from admin"
                        maxLength={8}
                      />
                    </div>
                    <div>
                      <Label htmlFor="faculty-id">Faculty ID *</Label>
                      <Input
                        id="faculty-id"
                        value={teacherForm.facultyId}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, facultyId: e.target.value }))}
                        placeholder="Your faculty ID"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher-department">Department *</Label>
                      <Input
                        id="teacher-department"
                        value={teacherForm.department}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teacher-phone">Phone Number</Label>
                      <Input
                        id="teacher-phone"
                        value={teacherForm.phone}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Label htmlFor="teacher-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="teacher-password"
                        type={showPassword ? "text" : "password"}
                        value={teacherForm.password}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 8 characters"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSubmit('teacher')} 
                    disabled={loading || !teacherForm.name || !teacherForm.email || !teacherForm.password || !teacherForm.instituteCode || !teacherForm.facultyId}
                    className="w-full"
                  >
                    {loading ? 'Creating Account...' : 'Register as Teacher'}
                  </Button>
                </div>
              </TabsContent>

              {/* Student Registration */}
              <TabsContent value="student" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Student Registration</h2>
                  <p className="text-muted-foreground">Access your academic progress and alerts</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-name">Full Name *</Label>
                      <Input
                        id="student-name"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student-email">Email Address *</Label>
                      <Input
                        id="student-email"
                        type="email"
                        value={studentForm.email}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-institute-code">Institute Code *</Label>
                      <Input
                        id="student-institute-code"
                        value={studentForm.instituteCode}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, instituteCode: e.target.value }))}
                        placeholder="8-character code from admin"
                        maxLength={8}
                      />
                    </div>
                    <div>
                      <Label htmlFor="student-id">Student ID *</Label>
                      <Input
                        id="student-id"
                        value={studentForm.studentId}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, studentId: e.target.value }))}
                        placeholder="Your student ID"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-department">Department/Course *</Label>
                      <Input
                        id="student-department"
                        value={studentForm.department}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="B.Tech Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student-phone">Phone Number</Label>
                      <Input
                        id="student-phone"
                        value={studentForm.phone}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Label htmlFor="student-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        value={studentForm.password}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 8 characters"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your Student ID must match the records uploaded by your institute admin. 
                      Contact your admin if registration fails.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={() => handleSubmit('student')} 
                    disabled={loading || !studentForm.name || !studentForm.email || !studentForm.password || !studentForm.instituteCode || !studentForm.studentId}
                    className="w-full"
                  >
                    {loading ? 'Creating Account...' : 'Register as Student'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Success/Error Message */}
            {message.text && (
              <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center space-x-2">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {message.text}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardHeader>
        </Card>

        {/* Role Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Institute Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Set up institute account</li>
                <li>• Get unique institute code</li>
                <li>• Upload student master data</li>
                <li>• Configure AI thresholds</li>
                <li>• Manage all users</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Teacher</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Upload attendance & scores</li>
                <li>• View at-risk students</li>
                <li>• Send notifications</li>
                <li>• Monitor class progress</li>
                <li>• Generate reports</li>
              </ul>
            </CardContent>
          </Card>

                    <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                <span>Student</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Access academic alerts</li>
                <li>• Track attendance & grades</li>
                <li>• Get AI-driven performance insights</li>
                <li>• Receive timely notifications</li>
                <li>• Connect with teachers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
    
    
  )
}
