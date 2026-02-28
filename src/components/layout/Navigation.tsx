import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, LayoutDashboard, BarChart3, Shield, Radio } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Ocean Map', icon: Map },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary" />
              <Radio className="h-3 w-3 text-primary absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wider text-foreground">
                COASTAL GUARDIAN
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                USV Swarm Surveillance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link key={path} to={path}>
                  <motion.div
                    className={`relative px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-md"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-xs text-muted-foreground font-medium">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
