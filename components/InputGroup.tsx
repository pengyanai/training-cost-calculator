import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  step?: number;
  min?: number;
  description?: string;
  children?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  unit, 
  step = 1, 
  min = 0,
  description,
  children 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {description && <span className="text-xs text-slate-400">{description}</span>}
      </div>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        {unit && (
          <div className="absolute right-3 pointer-events-none">
            <span className="text-sm font-medium text-slate-500">{unit}</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};