"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Brain, Loader2 } from "lucide-react"

// Fallback 3D-style component since Spline might not load
function AI3DFallback() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-ai-purple/10 rounded-2xl"></div>
      
      {/* Animated Brain Network */}
      <div className="relative z-10">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative w-32 h-32"
        >
          <Brain className="w-32 h-32 text-primary opacity-80" />
          
          {/* Floating Nodes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-accent rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0'
              }}
              animate={{
                rotate: [0, 360],
                x: [0, 60 * Math.cos(i * Math.PI / 4)],
                y: [0, 60 * Math.sin(i * Math.PI / 4)],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-ai-cyan rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D Experience...</p>
      </div>
    </div>
  )
}

// Dynamic Spline component with fallback
export function Spline3D() {
  // For now, we'll use the fallback since Spline integration requires specific setup
  // In a real implementation, you would:
  // 1. Create a Spline scene at https://spline.design/
  // 2. Export and import using @splinetool/react-spline
  
  return (
    <div className="relative">
      <Suspense fallback={<LoadingSpinner />}>
        <AI3DFallback />
      </Suspense>
      
      {/* Instructions for Spline Integration */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>🎨 <strong>3D Enhancement Ready:</strong> Replace with your custom Spline scene</p>
        <p className="text-xs mt-1">Visit <span className="text-primary">spline.design</span> to create stunning 3D scenes</p>
      </div>
    </div>
  )
}