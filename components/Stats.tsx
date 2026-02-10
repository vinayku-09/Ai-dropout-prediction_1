"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, Users, Brain, Shield, Clock, Target } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "85%",
    label: "Prediction Accuracy",
    description: "AI accuracy in identifying at-risk students",
    color: "text-success"
  },
  {
    icon: Users,
    value: "10K+",
    label: "Students Helped",
    description: "Across institutes using our platform",
    color: "text-primary"
  },
  {
    icon: Clock,
    value: "3x",
    label: "Faster Detection",
    description: "Earlier identification vs traditional methods",
    color: "text-ai-cyan"
  },
  {
    icon: Shield,
    value: "60%",
    label: "Dropout Reduction",
    description: "Average improvement in retention rates",
    color: "text-accent"
  },
  {
    icon: Brain,
    value: "24/7",
    label: "Real-time Monitoring",
    description: "Continuous AI analysis and alerts",
    color: "text-ai-purple"
  },
  {
    icon: Target,
    value: "92%",
    label: "Counselor Satisfaction",
    description: "Teachers find our insights actionable",
    color: "text-warning"
  }
]

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5" ref={ref}>
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Proven Impact &
            <span className="text-gradient-ai"> Real Results</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Our AI-powered platform has transformed educational outcomes across institutions,
            helping thousands of students succeed through early intervention.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover-lift hover:border-primary/20 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-${stat.color.replace('text-', '')}/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <motion.div
                  initial={{ scale: 1 }}
                  animate={isInView ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className="mb-4"
                >
                  <div className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {stat.label}
                  </h3>
                </motion.div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary mr-3" />
            <span className="text-sm font-medium">
              Join the AI revolution in education - 
              <span className="text-primary font-bold ml-1">Start your free trial today</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}