"use client";

import React from "react";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  // Minimal layout for embedded Sanity Studio without global header/footer/WhatsApp
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {children}
    </div>
  );
}
