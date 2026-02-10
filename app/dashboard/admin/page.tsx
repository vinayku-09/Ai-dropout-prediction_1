"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'
import {
  Users, Upload, Settings, FileSpreadsheet, AlertTriangle, CheckCircle, Code, School, UserPlus, 
  TrendingUp, BarChart3, Download, LogOut, Brain, Bell, Send, Eye, RefreshCw, 
  TrendingDown, Activity, GraduationCap, Clock, DollarSign, Mail, MessageSquare, Search,
  Home, Calendar, BookOpen, UserCheck, MapPin, Wifi, Cpu, ShieldCheck, ChevronLeft,
  Menu, X, Phone, MapPinIcon, Building2, Award, Star, BookMarked, UserX, ChevronRight,
  Filter, Plus, Edit3, Trash2, MoreVertical
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import UploadFiles from './UploadFile'

export default function ProfessionalInstituteDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  // Institute Profile
  const [instituteProfile] = useState({
    name: "Government Engineering College",
    code: "GEC-MUM-001",
    logo: "/api/placeholder/80/80",
    address: "Powai, Mumbai, Maharashtra 400076",
    established: "1986",
    accreditation: "NBA Accredited",
    website: "www.gecmumbai.edu.in",
    totalCapacity: 3000,
    currentStrength: 2847
  })

  // Dashboard Statistics
  const [dashboardStats] = useState({
    totalStudents: 2847,
    activeStudents: 2705,
    atRiskStudents: 142,
    totalFaculty: 89,
    departments: 6,
    placementRate: 78.2,
    attendanceRate: 87.5,
    avgCGPA: 7.8,
    campusArea: "120 acres",
    libraryBooks: "45,000+"
  })

  // Student Data with Enhanced Details
  const [studentsData] = useState([
    {
      id: "GEC2023001",
      name: "Amit Kumar Sharma",
      email: "amit.sharma@student.gecmumbai.edu.in",
      phone: "+91 9876543210",
      course: "Computer Science Engineering",
      semester: "6th Semester",
      year: "3rd Year",
      rollNo: "CSE/2021/001",
      admissionYear: "2021",
      dateOfBirth: "15/03/2003",
      address: "Mumbai, Maharashtra",
      fatherName: "Rajesh Kumar Sharma",
      motherName: "Sunita Sharma",
      parentContact: "+91 9876543200",
      guardianEmail: "rajesh.sharma@gmail.com",
      riskScore: 0.85,
      riskCategory: "High Risk",
      attendance: 45.2,
      cgpa: 5.2,
      sgpa: 4.8,
      backlogs: 3,
      totalCredits: 120,
      completedCredits: 88,
      mentor: "Dr. Rajesh Sharma",
      lastLogin: "2024-08-25",
      feeStatus: "Pending",
      hostelResident: true,
      bloodGroup: "B+",
      category: "General",
      nationality: "Indian",
      achievements: ["Programming Contest Winner", "Tech Fest Participant"],
      skills: ["Python", "Java", "React", "Node.js"]
    },
    {
      id: "GEC2023002",
      name: "Priya Sharma Patel",
      email: "priya.patel@student.gecmumbai.edu.in",
      phone: "+91 9876543211",
      course: "Mechanical Engineering",
      semester: "4th Semester",
      year: "2nd Year",
      rollNo: "MECH/2022/015",
      admissionYear: "2022",
      dateOfBirth: "22/07/2004",
      address: "Pune, Maharashtra",
      fatherName: "Suresh Patel",
      motherName: "Kavita Patel",
      parentContact: "+91 9876543201",
      guardianEmail: "suresh.patel@gmail.com",
      riskScore: 0.32,
      riskCategory: "Low Risk",
      attendance: 92.1,
      cgpa: 8.4,
      sgpa: 8.6,
      backlogs: 0,
      totalCredits: 80,
      completedCredits: 76,
      mentor: "Prof. Anita Desai",
      lastLogin: "2024-08-30",
      feeStatus: "Paid",
      hostelResident: false,
      bloodGroup: "A+",
      category: "OBC",
      nationality: "Indian",
      achievements: ["Academic Excellence Award", "Best Project Award"],
      skills: ["AutoCAD", "SolidWorks", "MATLAB", "Thermodynamics"]
    },
    {
      id: "GEC2023003",
      name: "Rahul Patel Singh",
      email: "rahul.singh@student.gecmumbai.edu.in",
      phone: "+91 9876543212",
      course: "Electrical Engineering",
      semester: "8th Semester",
      year: "4th Year",
      rollNo: "EEE/2020/045",
      admissionYear: "2020",
      dateOfBirth: "10/11/2002",
      address: "Nashik, Maharashtra",
      fatherName: "Vijay Singh",
      motherName: "Meera Singh",
      parentContact: "+91 9876543202",
      guardianEmail: "vijay.singh@gmail.com",
      riskScore: 0.15,
      riskCategory: "Low Risk",
      attendance: 89.7,
      cgpa: 9.1,
      sgpa: 9.3,
      backlogs: 0,
      totalCredits: 160,
      completedCredits: 158,
      mentor: "Dr. Suresh Kumar",
      lastLogin: "2024-08-30",
      feeStatus: "Paid",
      hostelResident: true,
      bloodGroup: "O+",
      category: "General",
      nationality: "Indian",
      achievements: ["University Topper", "Research Paper Published", "Scholarship Recipient"],
      skills: ["Circuit Design", "Power Systems", "MATLAB", "PLC Programming"]
    }
  ])

  // Faculty Data with Complete Details
  const [facultyData] = useState([
    {
      id: "FAC001",
      name: "Dr. Rajesh Kumar Sharma",
      designation: "Professor & Head",
      department: "Computer Science Engineering",
      email: "rajesh.sharma@gecmumbai.edu.in",
      phone: "+91 9876543301",
      officeRoom: "CS-101",
      experience: "15 years",
      qualification: "Ph.D. in Computer Science",
      specialization: "Machine Learning, Data Mining",
      dateOfJoining: "15/08/2009",
      dateOfBirth: "25/05/1975",
      address: "Bandra, Mumbai, Maharashtra",
      employeeId: "GEC-CS-001",
      salary: "₹1,25,000",
      bloodGroup: "AB+",
      maritalStatus: "Married",
      emergencyContact: "+91 9876543300",
      subjects: ["Data Structures", "Machine Learning", "Database Systems"],
      mentees: 25,
      researchPapers: 45,
      awards: ["Best Faculty Award 2023", "Research Excellence Award"],
      currentProjects: ["AI in Education", "Smart Campus Initiative"]
    },
    {
      id: "FAC002",
      name: "Prof. Anita Desai Patel",
      designation: "Associate Professor",
      department: "Mechanical Engineering",
      email: "anita.patel@gecmumbai.edu.in",
      phone: "+91 9876543302",
      officeRoom: "MECH-205",
      experience: "12 years",
      qualification: "M.Tech in Thermal Engineering",
      specialization: "Heat Transfer, Thermodynamics",
      dateOfJoining: "10/07/2012",
      dateOfBirth: "15/09/1980",
      address: "Andheri, Mumbai, Maharashtra",
      employeeId: "GEC-MECH-002",
      salary: "₹95,000",
      bloodGroup: "B+",
      maritalStatus: "Married",
      emergencyContact: "+91 9876543305",
      subjects: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics"],
      mentees: 30,
      researchPapers: 28,
      awards: ["Teaching Excellence Award 2022"],
      currentProjects: ["Green Energy Solutions", "Waste Heat Recovery"]
    },
    {
      id: "FAC003",
      name: "Dr. Suresh Kumar Mishra",
      designation: "Professor",
      department: "Electrical Engineering",
      email: "suresh.mishra@gecmumbai.edu.in",
      phone: "+91 9876543303",
      officeRoom: "EEE-301",
      experience: "18 years",
      qualification: "Ph.D. in Electrical Engineering",
      specialization: "Power Systems, Renewable Energy",
      dateOfJoining: "20/06/2006",
      dateOfBirth: "30/12/1972",
      address: "Powai, Mumbai, Maharashtra",
      employeeId: "GEC-EEE-003",
      salary: "₹1,35,000",
      bloodGroup: "O-",
      maritalStatus: "Married",
      emergencyContact: "+91 9876543308",
      subjects: ["Power Systems", "Electrical Machines", "Renewable Energy"],
      mentees: 22,
      researchPapers: 52,
      awards: ["Outstanding Researcher Award 2023", "Best Mentor Award 2022"],
      currentProjects: ["Smart Grid Implementation", "Solar Power Optimization"]
    }
  ])

  // Analytics Data
  const attendanceData = [
    { month: 'Jan', attendance: 89 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 88 },
    { month: 'Apr', attendance: 91 },
    { month: 'May', attendance: 87 },
    { month: 'Jun', attendance: 89 }
  ]

  //DASHBOARD CHART 
  const [dashboardData, setDashboardData] = useState({
      totalStudents: 2847,
      atRiskStudents: 142,
      lowRiskStudents: 2705,
      avgRiskScore: 0.23,
      riskDistribution: [
        { name: 'Low Risk', value: 2705, color: '#10b981' },
        { name: 'Medium Risk', value: 89, color: '#f59e0b' },
        { name: 'High Risk', value: 53, color: '#ef4444' }
      ],
      monthlyTrends: [
        { month: 'Jan', risk: 4.2, attendance: 92 },
        { month: 'Feb', risk: 4.8, attendance: 89 },
        { month: 'Mar', risk: 5.1, attendance: 87 },
        { month: 'Apr', risk: 4.9, attendance: 90 },
        { month: 'May', risk: 5.6, attendance: 85 }
      ],
      topRiskFactors: [
        { factor: 'Low Attendance', count: 89, percentage: 62.7 },
        { factor: 'Poor Assessment Scores', count: 67, percentage: 47.2 },
        { factor: 'Fee Payment Delays', count: 45, percentage: 31.7 },
        { factor: 'Reduced LMS Activity', count: 38, percentage: 26.8 },
        { factor: 'Late Submissions', count: 29, percentage: 20.4 }
      ]
    })

  const departmentData = [
    { name: 'Computer Science', students: 850, color: '#3b82f6' },
    { name: 'Mechanical', students: 720, color: '#10b981' },
    { name: 'Electrical', students: 680, color: '#f59e0b' },
    { name: 'Civil', students: 597, color: '#ef4444' }
  ]

  const riskData = [
    { name: 'Low Risk', value: 2405, color: '#10b981' },
    { name: 'Medium Risk', value: 300, color: '#f59e0b' },
    { name: 'High Risk', value: 142, color: '#ef4444' }
  ]

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'faculty', label: 'Faculty', icon: GraduationCap },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'assessments', label: 'Assessments', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'uploadfile', label: 'Upload File', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFaculty = facultyData.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.designation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskBadgeVariant = (riskCategory) => {
    switch (riskCategory) {
      case 'High Risk': return 'destructive'
      case 'Medium Risk': return 'secondary'
      case 'Low Risk': return 'default'
      default: return 'outline'
    }
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "default" }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <div className="flex items-center space-x-1">
                  {trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(trend)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-3 rounded-full bg-blue-50">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-gray-50 mb-30">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <School className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">GEC Mumbai</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-sm text-gray-500">Manage your institute efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                <Link href='/'>Logout</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto h-full">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Students"
                  value={dashboardStats.totalStudents.toLocaleString()}
                  subtitle={`${dashboardStats.departments} Departments`}
                  icon={Users}
                  trend={5.2}
                />
                <StatCard
                  title="Faculty Members"
                  value={dashboardStats.totalFaculty.toString()}
                  subtitle="Active Faculty"
                  icon={GraduationCap}
                  trend={2.1}
                />
                <StatCard
                  title="At-Risk Students"
                  value={dashboardStats.atRiskStudents.toString()}
                  subtitle={`${(dashboardStats.atRiskStudents / dashboardStats.totalStudents * 100).toFixed(1)}% of total`}
                  icon={AlertTriangle}
                  trend={-3.1}
                />
                <StatCard
                  title="Placement Rate"
                  value={`${dashboardStats.placementRate}%`}
                  subtitle="Current Academic Year"
                  icon={Award}
                  trend={4.7}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Risk Distribution Pie Chart */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    <span>Risk Distribution</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                      <Pie
                                        data={dashboardData.riskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                      >
                                        {dashboardData.riskDistribution.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </Pie>
                                      <Tooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </CardContent>
                              </Card>
                            </motion.div>
              
                            {/* Monthly Trends */}
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    <span>Monthly Trends</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dashboardData.monthlyTrends}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="month" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} name="Risk %" />
                                      <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} name="Attendance %" />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </CardContent>
                              </Card>
                            </motion.div>
              </div>

              {/* Institute Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <span>Institute Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Established</p>
                        <p className="font-semibold">{instituteProfile.established}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Campus Area</p>
                        <p className="font-semibold">{dashboardStats.campusArea}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Capacity</p>
                        <p className="font-semibold">{instituteProfile.totalCapacity.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Library Books</p>
                        <p className="font-semibold">{dashboardStats.libraryBooks}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium">{instituteProfile.address}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>Live Campus Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-700">{dashboardStats.attendanceRate}%</div>
                        <div className="text-sm text-blue-600">Attendance Rate</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50">
                        <div className="text-2xl font-bold text-green-700">{dashboardStats.avgCGPA}</div>
                        <div className="text-sm text-green-600">Average CGPA</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-50">
                        <div className="text-2xl font-bold text-purple-700">1,245</div>
                        <div className="text-sm text-purple-600">Online Students</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-orange-50">
                        <div className="text-2xl font-bold text-orange-700">67</div>
                        <div className="text-sm text-orange-600">Active Faculty</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Student Management</h3>
                  <p className="text-sm text-gray-600">Manage student profiles and academic records</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">{student.rollNo}</p>
                            <p className="text-sm text-gray-600">{student.course}</p>
                            <p className="text-xs text-gray-500">{student.semester} • {student.year}</p>
                          </div>
                        </div>
                        <Badge variant={getRiskBadgeVariant(student.riskCategory)}>
                          {student.riskCategory}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-blue-600">{student.cgpa}</p>
                          <p className="text-xs text-gray-500">CGPA</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-green-600">{student.attendance}%</p>
                          <p className="text-xs text-gray-500">Attendance</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-red-600">{student.backlogs}</p>
                          <p className="text-xs text-gray-500">Backlogs</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mentor:</span>
                          <span className="font-medium">{student.mentor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fee Status:</span>
                          <Badge variant={student.feeStatus === 'Paid' ? 'default' : 'destructive'}>
                            {student.feeStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hostel:</span>
                          <span className="font-medium">{student.hostelResident ? 'Yes' : 'No'}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Tab */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Faculty Management</h3>
                  <p className="text-sm text-gray-600">Manage faculty profiles and academic assignments</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search faculty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Faculty
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFaculty.map((teacher) => (
                  <Card key={teacher.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">{teacher.name}</CardTitle>
                          <p className="text-sm text-gray-600">{teacher.designation}</p>
                          <p className="text-sm text-blue-600 font-medium">{teacher.department}</p>
                          <p className="text-xs text-gray-500">Employee ID: {teacher.employeeId}</p>
                        </div>
                        <Badge variant="outline">{teacher.experience}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-blue-600">{teacher.mentees}</p>
                          <p className="text-xs text-gray-500">Mentees</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-green-600">{teacher.researchPapers}</p>
                          <p className="text-xs text-gray-500">Papers</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Office:</span>
                          <span className="font-medium">{teacher.officeRoom}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Specialization:</span>
                          <span className="font-medium text-right">{teacher.specialization}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'uploadfile' && (
           <div className="space-y-6">
            <UploadFiles/>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-600">Comprehensive insights and data visualization</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                    <CardDescription>Monthly attendance rate over the semester</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Risk Distribution</CardTitle>
                    <CardDescription>Risk category breakdown of all students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department-wise Students</CardTitle>
                    <CardDescription>Student distribution across departments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Performance Indicators</CardTitle>
                    <CardDescription>Important metrics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Average CGPA</span>
                      <span className="text-2xl font-bold text-blue-600">7.8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Pass Rate</span>
                      <span className="text-2xl font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Dropout Rate</span>
                      <span className="text-2xl font-bold text-orange-600">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Faculty-Student Ratio</span>
                      <span className="text-2xl font-bold text-purple-600">1:32</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Management</h3>
                  <p className="text-sm text-gray-600">Monitor and manage student attendance</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Today's Report
                  </Button>
                  <Button>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Today's Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Present</span>
                        <span className="text-lg font-bold text-green-600">2,456</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Absent</span>
                        <span className="text-lg font-bold text-red-600">391</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Late</span>
                        <span className="text-lg font-bold text-orange-600">67</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Attendance Rate</span>
                          <span className="text-xl font-bold text-blue-600">86.3%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Weekly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                        const rates = [89, 87, 85, 88, 84]
                        return (
                          <div key={day} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{day}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: `${rates[index]}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{rates[index]}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Alert Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>67 students</strong> with attendance below 75%
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-orange-200 bg-orange-50">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          <strong>23 students</strong> frequently late this week
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-blue-200 bg-blue-50">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>156 students</strong> with perfect attendance
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Department-wise Attendance</CardTitle>
                  <CardDescription>Current month attendance by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-gray-600">{dept.students} students</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: dept.color }}>
                            {Math.floor(Math.random() * 10) + 85}%
                          </div>
                          <p className="text-xs text-gray-500">This month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Communications Center</h3>
                  <p className="text-sm text-gray-600">Send announcements and manage communications</p>
                </div>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Mid-term Examination Schedule Released",
                          content: "The mid-term examination schedule for all departments has been published...",
                          date: "2024-08-30",
                          type: "Academic",
                          status: "Active"
                        },
                        {
                          title: "New Library Hours Effective September 1st",
                          content: "Starting September 1st, the library will extend its operating hours...",
                          date: "2024-08-29",
                          type: "General",
                          status: "Active"
                        },
                        {
                          title: "Technical Fest Registration Open",
                          content: "Registration for the annual technical festival is now open for all students...",
                          date: "2024-08-28",
                          type: "Event",
                          status: "Active"
                        }
                      ].map((announcement, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">{announcement.title}</h4>
                              <p className="text-sm text-gray-600">{announcement.content}</p>
                            </div>
                            <Badge variant="outline">{announcement.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Published: {announcement.date}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{announcement.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email All Students
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      SMS Broadcast
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Push Notification
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Parent Meeting Notice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Institute Settings</h3>
                <p className="text-sm text-gray-600">Configure system preferences and institute details</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Institute Profile</CardTitle>
                    <CardDescription>Update basic institute information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institute-name">Institute Name</Label>
                      <Input id="institute-name" value={instituteProfile.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institute-code">Institute Code</Label>
                      <Input id="institute-code" value={instituteProfile.code} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={instituteProfile.address} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={instituteProfile.website} readOnly />
                    </div>
                    <Button className="w-full">Update Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Manage system settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Send system notifications via email</p>
                      </div>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">SMS Alerts</h4>
                        <p className="text-sm text-gray-600">Send important alerts via SMS</p>
                      </div>
                      <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto Backup</h4>
                        <p className="text-sm text-gray-600">Automatically backup data daily</p>
                      </div>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">Save Settings</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}