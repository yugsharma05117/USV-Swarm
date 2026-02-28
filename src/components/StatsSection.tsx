import { motion } from "framer-motion";

const stats = [
  { value: "7,500+", label: "km Coastline", suffix: "" },
  { value: "24/7", label: "Autonomous Patrol", suffix: "" },
  { value: "<1s", label: "Threat Response", suffix: "" },
  { value: "0", label: "Personnel at Risk", suffix: "" },
];

const StatsSection = () => {
  return (
    <section className="py-20 px-6 bg-background border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-gradient-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
