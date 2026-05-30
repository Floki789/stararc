import React from 'react';

export default function ArchimedesLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="52" height="52" viewBox="0 0 100 100" fill="none" className="shrink-0 mt-1">
        <path d="M50 10 L20 80 L50 65 L80 80 Z" fill="#F7931A" />
        <path d="M50 10 L35 55 L50 65 Z" fill="#c97510" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-widest text-gray-900 uppercase">Archimedes</span>
        <span className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">Freedom Ahead</span>
      </div>
    </div>
  );
}
