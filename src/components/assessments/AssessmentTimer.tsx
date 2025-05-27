
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';

interface AssessmentTimerProps {
  timeRemaining: number;
}

const AssessmentTimer = ({ timeRemaining }: AssessmentTimerProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Timer className="w-5 h-5 text-gray-500" />
      <Badge 
        variant={timeRemaining < 300 ? "destructive" : "secondary"}
        className="text-lg px-4 py-2 font-mono"
      >
        {formatTime(timeRemaining)}
      </Badge>
    </div>
  );
};

export default AssessmentTimer;
