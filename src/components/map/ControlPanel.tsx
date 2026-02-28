import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function ControlPanel({ isRunning, onStart, onStop, onReset }: ControlPanelProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-xl">
      <Button
        onClick={onStart}
        disabled={isRunning}
        className="bg-success hover:bg-success/90 text-success-foreground font-display tracking-wider"
      >
        <Play className="h-4 w-4 mr-2" />
        START
      </Button>
      <Button
        onClick={onStop}
        disabled={!isRunning}
        className="bg-warning hover:bg-warning/90 text-warning-foreground font-display tracking-wider"
      >
        <Pause className="h-4 w-4 mr-2" />
        PAUSE
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        className="font-display tracking-wider border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        RESET
      </Button>
    </div>
  );
}
