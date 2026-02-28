import { motion } from 'framer-motion';
import { Ship, Navigation, Anchor } from 'lucide-react';

export function MapLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute bottom-20 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3 shadow-xl"
    >
      <h4 className="font-display font-bold text-xs text-foreground mb-2 flex items-center gap-1.5">
        📌 LEGEND
      </h4>
      
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#3b82f6] rounded" />
          <span className="text-muted-foreground">Sea Routes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/40 border border-destructive" />
          <span className="text-muted-foreground">Danger Zones</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🚢</span>
          <span className="text-muted-foreground">Active USVs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🎖️</span>
          <span className="text-muted-foreground">Command Ship</span>
        </div>
      </div>
    </motion.div>
  );
}
