import React from 'react';

/**
 * Organic pastel backdrop: layered wavy header + soft drifting blobs.
 * Purely decorative — hidden from assistive tech.
 */
export function WavyBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Warm cream base */}
      <div className="absolute inset-0 bg-cream-50" />

      {/* Wavy organic top header */}
      <svg
        className="absolute inset-x-0 top-0 h-[52vh] min-h-[360px] w-full"
        viewBox="0 0 1440 620"
        preserveAspectRatio="none"
        role="presentation">
        
        <path
          d="M0 0H1440V368C1276 456 1128 380 962 404C782 430 690 522 520 512C360 503 214 428 96 452C56 460 26 470 0 482V0Z"
          fill="#FFE6D6" />
        
        <path
          d="M0 0H1440V300C1300 366 1188 292 1030 320C852 352 742 438 566 428C404 419 250 350 128 372C80 381 34 396 0 412V0Z"
          fill="#FFD2B8" />
        
        <path
          d="M0 0H1440V196C1318 258 1156 190 996 222C820 257 700 330 528 320C372 311 236 250 116 270C70 278 32 290 0 304V0Z"
          fill="#FFC0A0" />
        
      </svg>

      {/* Soft mesh blobs */}
      <div className="absolute -left-24 top-24 h-72 w-72 animate-drift rounded-full bg-mint-200/60 blur-3xl" />
      <div className="absolute -right-16 top-8 h-80 w-80 animate-drift-alt rounded-full bg-sky-200/60 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/4 h-80 w-80 animate-drift rounded-full bg-peach-100/80 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 h-56 w-56 animate-drift-alt rounded-full bg-mint-100/80 blur-3xl" />

      {/* Tiny confetti dots for hand-crafted texture */}
      <div className="absolute left-[12%] top-[46%] h-3 w-3 rounded-full bg-white/80" />
      <div className="absolute left-[78%] top-[36%] h-2 w-2 rounded-full bg-white/80" />
      <div className="absolute left-[64%] top-[62%] h-2.5 w-2.5 rounded-full bg-peach-300/70" />
      <div className="absolute left-[26%] top-[74%] h-2 w-2 rounded-full bg-mint-300/70" />
    </div>);

}