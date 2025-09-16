"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerticalTimeline } from "@/components/vertical-timeline";

function getDefaultDay(): "d23" | "d24" {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-based
  const d = now.getDate();
  if (y === 2025 && m === 8 && d === 24) return "d24"; // 2025-09-24
  return "d23"; // default to first day
}

export function ScheduleTabs() {
  const initial = useMemo(getDefaultDay, []);
  const [value, setValue] = useState<"d23" | "d24">(initial);

  // If you want live auto-switch at midnight, uncomment:
  // useEffect(() => {
  //   const id = setInterval(() => setValue(getDefaultDay()), 60_000);
  //   return () => clearInterval(id);
  // }, []);

  const handleChange = (v: string) => setValue(v === "d24" ? "d24" : "d23");
  return (
    <Tabs value={value} onValueChange={handleChange} className="w-full h-full">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="d23">9/23(화)</TabsTrigger>
          <TabsTrigger value="d24">9/24(수)</TabsTrigger>
        </TabsList>
      </div>
      <div className="relative min-h-[500px] h-[65dvh]">
        <TabsContent
          value="d23"
          forceMount
          className="absolute inset-0 overflow-hidden data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none transition-opacity"
        >
          <VerticalTimeline
            fitToParent
            date="2025-09-23"
            startHour={16}
            endHour={22}
            events={[
              { title: "동아리 공연", start: "17:30", end: "19:30" },
              { title: "아티스트 공연 1", start: "19:40", end: "20:10" },
              { title: "아티스트 공연 2", start: "20:20", end: "21:00" },
            ]}
          />
        </TabsContent>

        <TabsContent
          value="d24"
          forceMount
          className="absolute inset-0 overflow-hidden data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none transition-opacity"
        >
          <VerticalTimeline
            fitToParent
            date="2025-09-24"
            startHour={16}
            endHour={22}
            events={[
              { title: "동아리 공연", start: "17:00", end: "17:50" },
              { title: "학생증 공모전", start: "18:00", end: "18:50" },
              { title: "아티스트 공연1", start: "19:00", end: "19:30" },
              { title: "아티스트 공연2", start: "19:30", end: "20:00" },
              { title: "아티스트 공연3", start: "20:00", end: "20:50" },
              { title: "불꽃놀이", start: "20:50", end: "21:00" },
            ]}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
