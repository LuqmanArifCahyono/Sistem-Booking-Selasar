"use client";

import React from "react";
import { BookingEvent } from "@/types";
import { CalendarTimeline } from "./CalendarTimeline";

interface DayViewProps {
  selectedDate: Date;
  today: Date;
  events: BookingEvent[];
  visibleOrganizationIds: string[];
  onEventClick: (event: BookingEvent) => void;
}

export function DayView({
  selectedDate,
  today,
  events,
  visibleOrganizationIds,
  onEventClick,
}: DayViewProps) {
  const date = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const visibleEvents = events.filter((event) =>
    event.status !== "dibatalkan" && visibleOrganizationIds.includes(event.organizationId)
  );

  return (
    <CalendarTimeline
      dates={[date]}
      events={visibleEvents}
      selectedDate={selectedDate}
      today={today}
      onEventClick={onEventClick}
      mode="day"
    />
  );
}
