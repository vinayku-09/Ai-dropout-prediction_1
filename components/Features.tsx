"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  Brain, 
  TrendingUp, 
  Shield,
  Bell,
  MessageSquare
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: GraduationCap,
    title: "For Institutes",
    description: "Create institute profiles, set dropout criteria, generate access codes, and monitor overall performance.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "For Teachers",
    description: "Upload attendance & marks, track student performance, receive AI alerts, and provide counseling notes.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: UserCheck,
    title: "For Students",
    description: "View personal risk scores, get attendance/marks updates, receive counseling recommendations.",
    color: "text-ai-cyan",
    bgColor: "bg-ai-cyan/10",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Advanced machine learning combines attendance, marks, fees, and activities to predict dropout risk.",
    color: "text-ai-purple",
    bgColor: "bg-ai-purple/10",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Real-time risk assessment with explainable AI showing why students are flagged as at-risk.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Automated email & WhatsApp notifications for attendance shortages, low marks, and fee reminders.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Shield,
    title: "Early Intervention",
    description: "Identify at-risk students before it's too late and provide timely support and counseling.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: MessageSquare,
    title: "Counseling Hub",
    description: "Integrated counseling system with appointment scheduling and progress tracking.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Powerful Features for
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Every Stakeholder
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Our comprehensive AI platform serves institutes, teachers, and students with 
            specialized tools for dropout prediction and student success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border group cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Confidence Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary mr-3" />
            <span className="text-sm font-medium">
              AI Confidence: 
              <span className="text-primary font-bold ml-1">92%</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}