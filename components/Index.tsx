"use client"

import { AIDemo } from "./AIDemo";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Navigation } from "./Navigation";
import { Spline3D } from "./Spline3D";
import { Stats } from "./Stats";
import { motion } from "framer-motion"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="overflow-hidden">
        <Hero />
        <Features />
        <HowItWorks />
        
        {/* 3D Section */}
        <section className="section-padding">
          <div className="container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Experience AI in
                <span className="text-gradient-ai"> 3D Interactive</span> Mode
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                Visualize neural networks and data patterns with our interactive 3D experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Spline3D />
            </motion.div>
          </div>
        </section>

        <Stats />
        <AIDemo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
