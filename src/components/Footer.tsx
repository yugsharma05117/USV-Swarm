import { Anchor } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 px-6 bg-gradient-navy border-t border-primary/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Anchor className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold  text-sm">
            USV Swarm
          </span>
        </div>
        <p className="text-teal-light/40 text-sm">
          © 2026 USV Swarm — AI-Powered Maritime Defense System
        </p>
      </div>
    </footer>
  );
};

export default Footer;
