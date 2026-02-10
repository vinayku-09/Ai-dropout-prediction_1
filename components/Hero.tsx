"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, Play, Brain, Users, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import heroImage from "@/public/hero-bg1.jpg"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Network Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
       
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-4 h-4 bg-primary/30 rounded-full network-animation"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-32 w-6 h-6 bg-accent/40 rounded-full network-animation"
        />
        <motion.div
          animate={{ 
            x: [0, 60, 0], 
            y: [0, -80, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-40 w-3 h-3 bg-ai-cyan/50 rounded-full network-animation"
        />
        
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Brain className="w-4 h-4 mr-2" />
            Built for SIH 2025 Hackathon
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">AI-Powered</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-ai-cyan bg-clip-text text-transparent">
                Student Success
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 text-muted-foreground">
                & Dropout Prediction
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            Helping institutes identify at-risk students early and provide 
            <span className="text-primary font-semibold"> personalized counseling</span> through 
            advanced AI analytics and predictive modeling.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">85% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Multi-Stakeholder</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Real-time AI</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="btn-hero text-lg px-8 py-4">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-ghost-glow text-lg px-8 py-4"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Demo
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-primary rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  )
}