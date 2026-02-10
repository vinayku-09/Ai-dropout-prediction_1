"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { 
  Upload, 
  Brain, 
  AlertTriangle, 
  Users,
  FileText,
  TrendingUp,
  Bell,
  Target
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    icon: Upload,
    title: "Data Integration",
    description: "Upload student data including attendance, marks, fee payments, and activities from existing spreadsheets.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    step: "01"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our machine learning algorithms analyze patterns and identify risk indicators across multiple data points.",
    color: "text-ai-purple",
    bgColor: "bg-ai-purple/10",
    step: "02"
  },
  {
    icon: AlertTriangle,
    title: "Risk Assessment",
    description: "Students are categorized as Safe, Warning, or At-Risk based on transparent, rule-based thresholds.",
    color: "text-warning",
    bgColor: "bg-warning/10",
    step: "03"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Automated notifications sent to mentors, teachers, and guardians when intervention is needed.",
    color: "text-ai-cyan",
    bgColor: "bg-ai-cyan/10",
    step: "04"
  }
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="how-it-works" className="section-padding bg-muted/30" ref={ref}>
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How Our 
            <span className="text-gradient-ai"> AI System</span> Works
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            A simple, transparent approach that merges existing data, applies clear logic, 
            and empowers educators with actionable insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <Card className="h-full card-3d hover-lift border-border/50 hover:border-primary/20 group">
                <CardHeader className="text-center">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed text-center">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent opacity-50 transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-gradient-primary">
            Built with Modern Technology
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Machine Learning", "Predictive Analytics", "Real-time Processing", "Data Fusion", "Transparent AI"].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover-glow cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}