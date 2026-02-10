import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { AIDemo } from "@/components/AIDemo"
import { Footer } from "@/components/Footer"
import Index from "@/components/Index"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Navigation />
      <main>
        <Hero />
        <Features />
        <AIDemo />
      </main>
      <Footer /> */}
      <Index/>
    </div>
  );
};


