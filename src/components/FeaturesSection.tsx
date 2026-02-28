import { motion } from "framer-motion";
import { Radar, Cpu, Shield, Zap, Navigation, Radio } from "lucide-react";

const features = [
  {
    icon: Radar,
    title: "Swarm Intelligence",
    description: "Coordinated multi-vehicle formations that adapt patrol patterns in real-time based on threat analysis.",
  },
  {
    icon: Cpu,
    title: "AI Threat Detection",
    description: "Deep learning models classify threats instantly — from smuggling vessels to unauthorized intrusions.",
  },
  {
    icon: Shield,
    title: "Zero Personnel Risk",
    description: "Fully autonomous operations remove human operators from danger zones during high-risk interceptions.",
  },
  {
    icon: Zap,
    title: "Instant Response",
    description: "Sub-second threat-to-action pipeline with autonomous decision-making and swarm redeployment.",
  },
  {
    icon: Navigation,
    title: "Adaptive Patrolling",
    description: "Dynamic route optimization covering maximum coastline with minimum fleet using predictive algorithms.",
  },
  {
    icon: Radio,
    title: "Mesh Communications",
    description: "Decentralized comms network ensures swarm coordination even in contested electromagnetic environments.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-navy relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Redefining Maritime <span className="text-teal-light">Defense</span>
          </h2>
          <p className="text-teal-light/60 max-w-2xl mx-auto text-lg">
            Purpose-built autonomous systems for next-generation coastal surveillance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-7 rounded-2xl bg-navy-light/50 border border-primary/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-5 group-hover:shadow-glow-primary transition-shadow">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-primary-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-teal-light/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
