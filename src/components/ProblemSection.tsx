import { motion } from "framer-motion";
import { AlertTriangle, Eye, ShieldAlert, Users } from "lucide-react";

const problems = [
  {
    icon: Eye,
    title: "Surveillance Gaps",
    description:
      "Overreliance on conventional crewed patrol vessels leaves vast stretches of coastline unmonitored at any given time.",
  },
  {
    icon: AlertTriangle,
    title: "Reactive Threat Detection",
    description:
      "Current systems respond after threats materialize, constraining real-time coverage and allowing hostile actors critical time advantages.",
  },
  {
    icon: Users,
    title: "Personnel at Risk",
    description:
      "Frontline personnel face significant danger during elevated-risk operations such as smuggling interception and terrorism response.",
  },
  {
    icon: ShieldAlert,
    title: "Coastline Intrusions",
    description:
      "7,500+ km of Indian coastline remains vulnerable to unauthorized access, smuggling networks, and cross-border terrorism.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Why Current Systems <span className="text-gradient-primary">Fall Short</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            India's maritime border security faces critical vulnerabilities that
            put national safety and personnel lives at stake.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-glow-primary/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <problem.icon className="w-6 h-6 text-destructive group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
