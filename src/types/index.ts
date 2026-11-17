export type CalendarView = "mingguan" | "harian" | "bulan" | "histori";

export interface Organization {
  id: string;
  name: string;
  colorHex: string;
  badgeClass: string;
  textClass: string;
  borderClass: string;
  checked: boolean;
}

export interface BookingEvent {
  id: string;
  title: string;
  organizationId: string;
  organizationName: string;
  date: string; // ISO format "YYYY-MM-DD", e.g. "2026-11-09"
  startTime: string; // "09.00"
  endTime: string; // "11.00"
  bgClass: string;
  textClass: string;
  subtextClass: string;
  borderClass: string;
}

export interface GuidanceItem {
  number: string;
  title: string;
  description: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
}
