"use client";

import React from "react";
import { BookingEvent } from "@/types";
import { CalendarTimeline } from "./CalendarTimeline";

interface WeekViewProps {
  selectedDate: Date;
  today: Date;
  events: BookingEvent[];
  visibleOrganizationIds: string[];
  onEventClick: (event: BookingEvent) => void;
}

function getMonday(date: Date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  return monday;
}

export function WeekView({
  selectedDate,
  today,
  events,
  visibleOrganizationIds,
  onEventClick,
}: WeekViewProps) {
  const weekStart = getMonday(selectedDate);
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const visibleEvents = events.filter((event) =>
    event.status !== "dibatalkan" && visibleOrganizationIds.includes(event.organizationId)
  );

  return (
    <CalendarTimeline
      dates={dates}
      events={visibleEvents}
      selectedDate={selectedDate}
      today={today}
      onEventClick={onEventClick}
      mode="week"
    />
  );
}
