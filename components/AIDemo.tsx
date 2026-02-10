"use client"


import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { 
  PieChart as RechartsPieChart, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Pie
} from "recharts"

const mockData = {
  riskDistribution: [
    { name: "Safe", value: 65, color: "#22c55e" },
    { name: "Warning", value: 25, color: "#f59e0b" },
    { name: "At Risk", value: 10, color: "#ef4444" }
  ],
  marksData: [
    { subject: "Math", average: 75 },
    { subject: "Physics", average: 68 },
    { subject: "Chemistry", average: 82 },
    { subject: "English", average: 77 },
    { subject: "CS", average: 85 }
  ]
}

export function AIDemo() {
  const [isUploading, setIsUploading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        setShowResults(true)
      }, 2000)
    }
  }

  const handleSampleData = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setShowResults(true)
    }, 1500)
  }

  return (
    <section id="demo" className="py-20 lg:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Try Our 
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> AI Demo</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Upload student data and see our AI prediction system in action. 
            No signup required - experience the power instantly!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 border-2 border-dashed border-primary/30 hover:border-primary transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Upload Student Data</CardTitle>
                <CardDescription>
                  Upload CSV with student attendance, marks, and fees data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center space-y-4">
                    <FileText className="w-12 h-12 text-primary mx-auto" />
                    <div>
                      <p className="text-sm font-medium">Click to upload CSV file</p>
                      <p className="text-xs text-muted-foreground">CSV, up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>

                <Button 
                  onClick={handleSampleData}
                  variant="outline"
                  className="w-full btn-ghost-glow"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Processing..." : "Try with Sample Data"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {showResults ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-success" />
                      AI Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">65%</div>
                        <div className="text-sm text-muted-foreground">Safe</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">25%</div>
                        <div className="text-sm text-muted-foreground">Warning</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">10%</div>
                        <div className="text-sm text-muted-foreground">At Risk</div>
                      </div>
                    </div>
                    
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={mockData.riskDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {mockData.riskDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                      Subject Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockData.marksData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="average" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-destructive">AI Alert</h4>
                      <p className="text-sm text-muted-foreground">
                        3 students flagged as high-risk: Roll No. 23015, 23028, 23042
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-96 text-center">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <PieChart className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Upload data to see AI analytics
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}