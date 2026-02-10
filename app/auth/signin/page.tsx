"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import Link from "next/link";
import {
  School,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  Users,
  GraduationCap,
  Home,
  Mail,
  Lock,
  KeyRound
} from 'lucide-react'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    instituteCode: ''
  })

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock authentication logic
      const { email, password, instituteCode } = formData
      
      // Demo credentials check
      const isValidDemo = (
        (email === 'admin@demo.edu' && password === 'demo123') ||
        (email === 'teacher@demo.edu' && password === 'demo123' && instituteCode === 'DEMO1234') ||
        (email === 'student@demo.edu' && password === 'demo123' && instituteCode === 'DEMO1234')
      )

      if (isValidDemo || Math.random() > 0.3) { // 70% success rate for demo
        const userType = email.includes('admin') ? 'admin' : email.includes('teacher') ? 'teacher' : 'student'
        
        toast({
          title: "Welcome to EduEWS! 🎉",
          description: `Successfully signed in as ${userType}. Redirecting to your dashboard...`,
          variant: "default",
          duration: 3000,
        })

        // Redirect based on user type
        setTimeout(() => {
          if (userType === 'admin') {
            window.location.href = '/dashboard/admin'
          } else if (userType === 'teacher') {
            window.location.href = '/dashboard/teachers'
          } else {
            window.location.href = '/dashboard/student'
          }
        }, 1500)
        
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast({
        title: "Sign In Failed ❌",
        description: "Invalid credentials or institute code. Please check your information and try again.",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (role: string) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@demo.edu',
        password: 'demo123',
        instituteCode: ''
      })
    } else if (role === 'teacher') {
      setFormData({
        email: 'teacher@demo.edu',
        password: 'demo123',
        instituteCode: 'DEMO1234'
      })
    } else {
      setFormData({
        email: 'student@demo.edu',
        password: 'demo123',
        instituteCode: 'DEMO1234'
      })
    }
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
              <Link href="/auth/signup">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your EduEWS dashboard
            </p>
          </div>

          {/* Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="h-12 border-2 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Password</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
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

                  <div className="space-y-2">
                    <Label htmlFor="instituteCode" className="text-sm font-medium flex items-center space-x-2">
                      <KeyRound className="h-4 w-4" />
                      <span>Institute Code</span>
                    </Label>
                    <Input
                      id="instituteCode"
                      value={formData.instituteCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, instituteCode: e.target.value.toUpperCase() }))}
                      placeholder="8-character code (optional for admin)"
                      maxLength={8}
                      className="h-12 border-2 focus:border-primary transition-colors font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for teachers and students only. Leave empty if you're an admin.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    className="w-full h-12 text-base font-medium" 
                    disabled={loading || !formData.email || !formData.password}
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Don't have an account?</p>
                  <Link href="/auth/signup" className="w-full">
                    <Button variant="outline" className="w-full h-11">
                      Create New Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Credentials Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="mt-6 bg-muted/50 backdrop-blur-sm border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Demo Credentials</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Click any role below to auto-fill demo credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fillDemoCredentials('admin')}
                    className="flex items-center justify-between p-3 h-auto hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Admin Demo</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      admin@demo.edu
                    </Badge>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fillDemoCredentials('teacher')}
                    className="flex items-center justify-between p-3 h-auto hover:bg-green-50 dark:hover:bg-green-950/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Teacher Demo</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      teacher@demo.edu
                    </Badge>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fillDemoCredentials('student')}
                    className="flex items-center justify-between p-3 h-auto hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Student Demo</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      student@demo.edu
                    </Badge>
                  </Button>
                </div>
                
                <div className="text-center pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Password: <code className="bg-muted px-1 rounded">demo123</code> | 
                    Code: <code className="bg-muted px-1 rounded">DEMO1234</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}