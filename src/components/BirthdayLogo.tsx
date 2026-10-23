import React from 'react';

interface BirthdayLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  className?: string;
  onClick?: () => void;
}

export const BirthdayLogo: React.FC<BirthdayLogoProps> = ({
  variant = 'compact',
  className = '',
  onClick,
}) => {
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
        role="img"
        aria-label="CymbalMart AI Party Planner Logo"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm text-white font-extrabold text-lg">
          CM
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
        role="img"
        aria-label="CymbalMart AI Party Planner • Plan smarter. Shop with purpose. Celebrate more."
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-black text-xl group-hover:scale-105 transition-transform">
          CM
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900">
              Cymbal<span className="text-emerald-600">Mart</span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
              AI Party Planner
            </span>
          </div>
          <span className="text-xs text-slate-500 font-semibold tracking-tight">
            Plan smarter. Shop with purpose. Celebrate more.
          </span>
        </div>
      </div>
    );
  }

  // Default: 'compact'
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      role="img"
      aria-label="CymbalMart AI Party Planner"
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm text-white font-black text-base group-hover:scale-105 transition-transform">
        CM
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
            Cymbal<span className="text-emerald-600">Mart</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
            AI Planner
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:block">
          Plan smarter. Shop with purpose. Celebrate more.
        </span>
      </div>
    </div>
  );
};
