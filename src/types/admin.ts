// [FRONTEND CHANGE START: Definisi Tipe Data Panel Sub-Admin - Milestone 1]
export type SlotStatus = "dipesan" | "bentrok" | "tersedia" | "dikunci";

export interface AdminTimelineSlot {
  id: string;
  timeSlot: string; // "08.00 - 10.00 WIB"
  rawTime: string; // "08:00 - 10:00"
  status: SlotStatus;
  eventName: string;
  organizationId: string;
  organizationName: string;
  personInCharge: string;
  contactPJ: string;
  purpose: string;
  date: string; // "12/11/2026"
  isManual?: boolean;
}

export type ActivityFilterType = "semua" | "booking" | "batal";

export interface AdminActivityLogItem {
  id: string;
  type: "booking" | "batal";
  organizationId: string;
  organizationName: string;
  personInCharge: string;
  eventName: string;
  date: string; // "12/11/2026"
  timeRange: string; // "12.00 - 14.00 WIB"
  timestamp: string; // "12/11/2026 • 11:20 WIB"
  slotTag: string; // "Slot Otomatis Dibuka" atau "Booking Baru"
  reason?: string; // Khusus pembatalan
  cancellationStatus?: string; // "Pembatalan Mandiri User"
}

export interface AdminStats {
  slotKosong: number;
  slotKosongSub: string;
  jadwalTerisi: number;
  jadwalTerisiSub: string;
  pembatalanPeriode: number;
  pembatalanSub: string;
  totalPemakaian: number;
  totalPemakaianUnit: string;
  totalPemakaianSub: string;
}

export interface AdminOrganizationFilter {
  id: string;
  name: string;
  colorHex: string;
  dotClass: string;
  checked: boolean;
}
// [FRONTEND CHANGE END: Definisi Tipe Data Panel Sub-Admin - Milestone 1]
