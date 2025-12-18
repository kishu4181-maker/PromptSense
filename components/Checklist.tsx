
import React from 'react';
import { ChecklistItem, GroupedChecklist } from '../types';

interface ChecklistProps {
  checklist: GroupedChecklist;
}

const ChecklistSection: React.FC<{ title: string; items: ChecklistItem[] }> = ({ title, items }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{title}</h4>
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="group flex items-start gap-3 p-2.5 bg-white border border-slate-100 rounded-xl transition-all hover:border-slate-200 hover:shadow-sm">
            <div className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center ${item.status ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {item.status ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h5 className={`text-xs font-bold truncate ${item.status ? 'text-slate-700' : 'text-slate-900'}`}>{item.label}</h5>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-500 mt-0.5 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                {item.feedback}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Checklist: React.FC<ChecklistProps> = ({ checklist }) => {
  return (
    <div className="space-y-6">
      <ChecklistSection title="Context & Goals" items={checklist.context} />
      <ChecklistSection title="Structure & Flow" items={checklist.structure} />
      <ChecklistSection title="UX & Interaction" items={checklist.uxDetails} />
    </div>
  );
};
