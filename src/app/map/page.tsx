import { AppShell } from "@/components/app-shell";
import { MapView } from "./map-view";

export default function MapPage() {
  return (
    <AppShell title="지도">
      <MapView />
    </AppShell>
  );
}

