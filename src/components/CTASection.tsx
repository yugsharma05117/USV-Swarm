import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Ready to Secure the{" "}
            <span className="text-gradient-primary">Coastline</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Experience the future of maritime defense with our autonomous USV
            swarm simulation platform.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-display px-8 shadow-glow-primary" onClick={()=>window.location.href="/index"}
            >
              <Play className="w-4 h-4 mr-2" />
              Launch Simulation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-display px-8" onClick={()=>window.location.href="/learn-more"}
            >
              Contact Team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
