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
    <Tabs value={value} onValueChange={handleChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="d23">9/23(화)</TabsTrigger>
        <TabsTrigger value="d24">9/24(수)</TabsTrigger>
      </TabsList>
      <TabsContent value="d23" className="space-y-3">
        <div className="h-[calc(100dvh-56px-64px-24px-env(safe-area-inset-bottom))]">
          <VerticalTimeline
            fitToParent
            date="2025-09-23"
            startHour={16}
            endHour={24}
            events={[
              { title: "메인 무대 공연", start: "18:00", end: "19:30" },
              { title: "동아리 공연", start: "20:00", end: "21:00" },
            ]}
          />
        </div>
      </TabsContent>
      <TabsContent value="d24" className="space-y-3">
        <div className="h-[calc(100dvh-56px-64px-24px-env(safe-area-inset-bottom))]">
          <VerticalTimeline
            fitToParent
            date="2025-09-24"
            startHour={16}
            endHour={24}
            events={[
              { title: "초대가수 축하공연", start: "19:00", end: "20:30" },
              { title: "불꽃놀이", start: "21:00", end: "21:10" },
            ]}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
