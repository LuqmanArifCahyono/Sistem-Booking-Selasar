"use client";

import React from "react";
import { Organization } from "@/types";

interface OrganizationFilterProps {
  organizations: Organization[];
  onToggleOrg: (id: string) => void;
}

export function OrganizationFilter({
  organizations,
  onToggleOrg,
}: OrganizationFilterProps) {
  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-[11px] font-semibold text-gray-700 dark:text-[#CBD5E1] tracking-wider uppercase">
          Penyelenggara Event
        </h3>
        <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">
          Pilih yang tampil di kalender
        </p>
      </div>

      <div className="space-y-2 mt-3">
        {organizations.map((org) => (
          <label
            key={org.id}
            className="flex items-center gap-2.5 text-xs text-gray-800 dark:text-[#CBD5E1] cursor-pointer select-none group"
          >
            <input
              type="checkbox"
              checked={org.checked}
              onChange={() => onToggleOrg(org.id)}
              className="sr-only peer"
            />
            <span
              className={`w-4 h-4 rounded flex items-center justify-center transition-all border ${
                org.checked
                  ? "border-transparent"
                  : "border-gray-300 dark:border-slate-600 bg-white dark:bg-[#1E293B] group-hover:border-gray-400 dark:group-hover:border-slate-400"
              }`}
              style={{
                backgroundColor: org.checked ? org.colorHex : "transparent",
              }}
            >
              {org.checked && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-[#F8FAFC] transition-colors">
              {org.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
