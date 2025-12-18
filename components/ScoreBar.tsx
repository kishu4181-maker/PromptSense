
import React from 'react';

interface ScoreBarProps {
  score: number;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 80) return 'stroke-emerald-500';
    if (val >= 50) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const getTextColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600';
    if (val >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBgColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-50';
    if (val >= 50) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6 w-full overflow-visible">
      {/* Circular Progress Indicator - Wrapped with padding to prevent clipping */}
      <div className="relative flex items-center justify-center p-2 overflow-visible">
        <svg className="w-24 h-24 transform -rotate-90 overflow-visible">
          {/* Track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1s ease-out'
            }}
            strokeLinecap="round"
            className={`${getColor(score)} transition-colors duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-xl font-bold font-mono tracking-tight ${getTextColor(score)}`}>
            {score}%
          </span>
        </div>
      </div>

      {/* Label and Status */}
      <div className="mt-4 sm:mt-0 text-center sm:text-left">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
          Prompt clarity level
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBgColor(score)} ${getTextColor(score)} border border-current opacity-80`}>
            {score >= 80 ? 'Excellent' : score >= 50 ? 'Average' : 'Poor'}
          </span>
          <span className="text-sm text-slate-500 font-medium">Vibe Strength</span>
        </div>
      </div>
    </div>
  );
};
