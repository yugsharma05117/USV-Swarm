import { motion } from 'framer-motion';
import { Ship, AlertTriangle, Target, Activity } from 'lucide-react';

interface StatsData {
  activeUSVs: number;
  dangerZones: number;
  totalAlerts: number;
  systemStatus: 'READY' | 'RUNNING' | 'ALERT';
}

interface LiveStatsPanelProps {
  stats: StatsData;
}

export function LiveStatsPanel({ stats }: LiveStatsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg border border-border p-4 shadow-xl min-w-[200px]"
    >
      <h3 className="font-display font-bold text-sm text-primary mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4" />
        LIVE STATS
      </h3>
      
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Ship className="h-3 w-3" />
            Active USVs:
          </span>
          <span className="font-display font-bold text-foreground">{stats.activeUSVs}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3 w-3" />
            Danger Zones:
          </span>
          <span className="font-display font-bold text-foreground">{stats.dangerZones}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            Total Alerts:
          </span>
          <span className="font-display font-bold text-warning">{stats.totalAlerts}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Status:</span>
          <span className={`font-display font-bold text-xs ${
            stats.systemStatus === 'ALERT' ? 'text-warning' : 'text-success'
          }`}>
            {stats.systemStatus}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
