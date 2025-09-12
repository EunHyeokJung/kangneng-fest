import { AppShell } from "@/components/app-shell";
import { ScheduleTabs } from "@/components/schedule-tabs";

export default function SchedulePage() {
  return (
    <AppShell title="일정">
      <ScheduleTabs />
    </AppShell>
  );
}
