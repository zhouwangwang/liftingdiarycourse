"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";


interface CalendarPickerProps {
  selected: Date;
}

export function CalendarPicker({ selected }: CalendarPickerProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    const params = new URLSearchParams();
    params.set("date", format(date, "yyyy-MM-dd"));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      className="[--cell-size:--spacing(10)]"
    />
  );
}
