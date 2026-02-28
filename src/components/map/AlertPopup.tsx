import { motion } from 'framer-motion';
import { Alert } from '@/types/usv';
import { AlertTriangle, X } from 'lucide-react';

interface AlertPopupProps {
  alert: Alert | null;
  onClose: () => void;
}

export function AlertPopup({ alert, onClose }: AlertPopupProps) {
  if (!alert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[1000] max-w-md w-full mx-4 ${
        alert.severity === 'critical' 
          ? 'bg-destructive/95' 
          : 'bg-warning/95'
      } backdrop-blur-sm rounded-lg border-2 ${
        alert.severity === 'critical' 
          ? 'border-red-400' 
          : 'border-yellow-400'
      } shadow-2xl`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-white text-lg tracking-wider">
            ⚠️ DANGER ZONE ALERT!
          </h4>
          <p className="text-white/90 text-sm mt-1">
            {alert.message}
          </p>
          <p className="text-white/70 text-xs mt-2">
            Zone: {alert.zoneName}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>
    </motion.div>
  );
}
