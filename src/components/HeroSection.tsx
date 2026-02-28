import { motion } from "framer-motion";
import { Anchor, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ocean.jpg";
import index from "@/pages/Index";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero-overlay" />

      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-teal/5 to-transparent"
          style={{ animation: "scan-line 6s linear infinite" }}
        />
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Anchor className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
          </div>
          <span className="font-display text-lg font-bold text-primary-foreground tracking-tight">
            USV Swarm
          </span>
        </div>
        
        <Button
          variant="outline"
          className="border-primary/50 text-primary-foreground bg-primary/10 hover:bg-primary/20 backdrop-blur-sm font-display" onClick={() => window.location.href = "/index"}
        >
          Launch Simulation →
        </Button>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium mb-8">
            AI-Powered Maritime Defense System
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Autonomous USV Swarm
          <br />
          for{" "}
          <span className="text-gradient-primary">Coastal Surveillance</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-teal-light/80 max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Real-time simulation of autonomous Unmanned Surface Vehicles patrolling
          India's 7,500+ km coastline, detecting threats, and coordinating
          intelligent swarm responses.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-display px-8 shadow-glow-primary"onClick={() => window.location.href = "/index"}
          >
            <Play className="w-4 h-4 mr-2" />
            Start Simulation
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-white rounded-full font-display px-8" onClick={() => window.location.href = "/learn-more"}
          >
            Learn More
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
