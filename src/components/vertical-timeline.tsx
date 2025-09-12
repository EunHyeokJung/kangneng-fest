"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

export type TimelineEvent = {
  title: string;
  start: string; // HH:MM (24h)
  end: string; // HH:MM (24h)
  location?: string;
};

export type VerticalTimelineProps = {
  date: string; // YYYY-MM-DD
  events: TimelineEvent[];
  startHour?: number; // inclusive, default 10
  endHour?: number; // exclusive, default 24
  hourHeight?: number; // pixels per hour, default 56
  className?: string;
  fitToParent?: boolean; // if true, stretches 16~24h to fill parent height
};

function parseHM(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + (m || 0);
}


function isSameDateStr(now: Date, dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  return (
    now.getFullYear() === y &&
    now.getMonth() + 1 === m &&
    now.getDate() === d
  );
}

export function VerticalTimeline({
  date,
  events,
  startHour = 10,
  endHour = 24,
  hourHeight = 56,
  className,
  fitToParent = false,
}: VerticalTimelineProps) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const hours = useMemo(() => {
    return Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  }, [startHour, endHour]);

  const totalMinutes = (endHour - startHour) * 60;
  // Observe parent size to compute dynamic hour height
  useEffect(() => {
    if (!fitToParent || !rootEl) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.floor(entry.contentRect.height);
        setMeasuredHeight(h);
      }
    });
    ro.observe(rootEl);
    return () => ro.disconnect();
  }, [fitToParent, rootEl]);

  const hoursSpan = endHour - startHour;
  const finalHourHeight = useMemo(() => {
    if (fitToParent && measuredHeight && hoursSpan > 0) {
      return measuredHeight / hoursSpan;
    }
    return hourHeight;
  }, [fitToParent, measuredHeight, hoursSpan, hourHeight]);

  const containerHeight = hoursSpan * finalHourHeight;

  const nowTop = useMemo(() => {
    if (!isSameDateStr(now, date)) return null;
    const minutes = now.getHours() * 60 + now.getMinutes();
    const offset = minutes - startHour * 60;
    if (offset < 0 || offset > totalMinutes) return null;
    return (offset / 60) * finalHourHeight;
  }, [now, date, startHour, totalMinutes, finalHourHeight]);

  return (
    <div ref={setRootEl} className={clsx("h-full rounded-md border bg-card", className)}>
      <div className="relative flex w-full">
        {/* Left hours column */}
        <div
          className="relative shrink-0 select-none text-xs text-muted-foreground"
          style={{ width: 44, height: containerHeight }}
        >
          {hours.map((h, idx) => (
            <div
              key={h}
              className="absolute right-1 -translate-y-1/2"
              style={{ top: idx * finalHourHeight }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Right grid and events */}
        <div className="relative grow" style={{ height: containerHeight }}>
          {/* Hour grid lines */}
          {hours.map((h, idx) => (
            <div
              key={h}
              className={clsx(
                "absolute left-0 right-0 border-t",
                idx === 0 ? "border-border" : "border-border/60"
              )}
              style={{ top: idx * finalHourHeight }}
            />
          ))}

          {/* Current time red line */}
          {nowTop !== null && (
            <div
              className="absolute left-0 right-0 z-10"
              style={{ top: nowTop }}
            >
              <div className="flex items-center gap-1">
                <div className="h-px w-full bg-red-500" />
                <div className="h-2 w-2 -translate-y-1/2 rounded-full border border-white bg-red-500 shadow" />
              </div>
            </div>
          )}

          {/* Events */}
          {events.map((ev) => {
            const startM = parseHM(ev.start);
            const endM = parseHM(ev.end);
            const fromStart = Math.max(0, startM - startHour * 60);
            const toEnd = Math.min(endHour * 60, endM) - startHour * 60;
            const height = Math.max(16, ((toEnd - fromStart) / 60) * finalHourHeight - 4);
            const top = (fromStart / 60) * finalHourHeight + 2;
            return (
              <div
                key={`${ev.title}-${ev.start}`}
                className="absolute left-2 right-2 overflow-hidden rounded-md border bg-primary/10"
                style={{ top, height }}
              >
                <div className="flex h-full flex-col justify-center gap-0.5 px-3 py-1.5">
                  <div className="text-sm font-medium text-primary-foreground/90">
                    <span className="text-foreground/90">{ev.title}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {ev.start} ~ {ev.end}
                    {ev.location ? ` · ${ev.location}` : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
