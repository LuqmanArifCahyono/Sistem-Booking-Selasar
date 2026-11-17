"use client";

import React, { useState } from "react";
import { GUIDANCE_ITEMS } from "@/constants";

export function GuidancePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
      >
        <span className="text-[11px] font-semibold text-gray-700 tracking-wider uppercase">
          Panduan Peminjaman
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 text-xs text-gray-600 space-y-3 animate-fadeIn">
          <p className="font-semibold text-gray-900 text-xs">
            Informasi Ketentuan Peminjaman
          </p>

          <div className="space-y-2.5">
            {GUIDANCE_ITEMS.map((item) => (
              <div key={item.number} className="flex items-start gap-2.5">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {item.number}
                </span>
                <div className="leading-tight">
                  <div className="font-medium text-gray-900 text-xs">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
