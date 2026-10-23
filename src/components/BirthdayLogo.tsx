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
        aria-label="CymbalMart PLANNER – Birthday Logo"
      >
        <img
          src="/brand/cymbalmart-birthday-mark.svg"
          alt="CymbalMart PLANNER – Birthday Icon"
          className="w-10 h-10 object-contain drop-shadow-sm hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
        role="img"
        aria-label="CymbalMart PLANNER – Birthday • Smart Event & Shopping Assistant"
      >
        <img
          src="/brand/cymbalmart-birthday-mark.svg"
          alt=""
          aria-hidden="true"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900">
              Cymbal<span className="text-blue-600">Mart</span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-sm">
              PLANNER – Birthday
            </span>
          </div>
          <span className="text-xs text-slate-500 font-semibold tracking-tight">
            Smart Event &amp; Shopping Assistant
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
      aria-label="CymbalMart PLANNER – Birthday"
    >
      <img
        src="/brand/cymbalmart-birthday-mark.svg"
        alt=""
        aria-hidden="true"
        className="w-10 h-10 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
      />
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
            Cymbal<span className="text-blue-600">Mart</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-xs">
            PLANNER – Birthday
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:block">
          Smart Event &amp; Shopping Assistant
        </span>
      </div>
    </div>
  );
};
