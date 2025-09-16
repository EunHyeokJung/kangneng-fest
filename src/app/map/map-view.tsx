"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  mapCategoryConfig,
  mapImage,
  mapPoints,
  type MapCategory,
  type MapPoint,
} from "./data";

const categoryOrder = Object.keys(mapCategoryConfig) as MapCategory[];
const focusZoomLevel = 0.25;

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const activePointRef = useRef<string | null>(null);

  const [activeCategories, setActiveCategories] = useState<MapCategory[]>(
    categoryOrder,
  );
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [modalPointId, setModalPointId] = useState<string | null>(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<
    | {
        x: number;
        y: number;
      }
    | null
  >(null);

  const pointLookup = useMemo(() => {
    const lookup = new Map<string, MapPoint>();
    for (const point of mapPoints) {
      lookup.set(point.id, point);
    }
    return lookup;
  }, []);

  const filteredPoints = useMemo(
    () => mapPoints.filter((point) => activeCategories.includes(point.category)),
    [activeCategories],
  );

  const activePoint = activePointId ? pointLookup.get(activePointId) ?? null : null;
  const modalPoint = modalPointId ? pointLookup.get(modalPointId) ?? null : null;

  const recalcTooltipPosition = useCallback(() => {
    const map = mapRef.current;
    const currentId = activePointRef.current;
    if (!map || !currentId) {
      setTooltipPosition(null);
      return;
    }
    const point = pointLookup.get(currentId);
    if (!point) {
      setTooltipPosition(null);
      return;
    }
    const containerPoint = map.latLngToContainerPoint([
      point.coord.y,
      point.coord.x,
    ]);
    setTooltipPosition({ x: containerPoint.x, y: containerPoint.y });
  }, [pointLookup]);

  const focusPoint = useCallback(
    (pointId: string, options?: { openTooltip?: boolean }) => {
      const map = mapRef.current;
      const point = pointLookup.get(pointId);
      if (!map || !point) return;

      const latLng = L.latLng(point.coord.y, point.coord.x);
      const currentZoom = map.getZoom();
      const desiredZoom = currentZoom < focusZoomLevel ? focusZoomLevel : currentZoom;
      map.flyTo(latLng, desiredZoom, {
        duration: 0.6,
        easeLinearity: 0.3,
      });

      if (options?.openTooltip !== false) {
        setActivePointId(pointId);
      }
    },
    [pointLookup],
  );

  const createMarkerIcon = useCallback((category: MapCategory, isActive: boolean) => {
    const { color } = mapCategoryConfig[category];
    const ringColor = isActive ? "#ffffff" : "#f9fafb";
    const shadowOpacity = isActive ? 0.45 : 0.3;
    const scale = isActive ? 1.2 : 1;
    const html = `
      <span
        style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: ${color};
          border: 2px solid ${ringColor};
          box-shadow: 0 10px 18px rgba(15, 23, 42, ${shadowOpacity});
          transform: scale(${scale});
        "
      ></span>
    `;

    return L.divIcon({
      html,
      className: "", // remove default leaflet styles
      iconAnchor: [11, 11],
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const bounds = L.latLngBounds([
      [0, 0],
      [mapImage.height, mapImage.width],
    ]);

    const map = L.map(container, {
      crs: L.CRS.Simple,
      maxZoom: 2,
      minZoom: -2,
      zoomSnap: 0,
      zoomDelta: 0.25,
      attributionControl: false,
    });

    mapRef.current = map;
    const overlay = L.imageOverlay(mapImage.src, bounds, { interactive: false });
    overlay.addTo(map);
    map.fitBounds(bounds);
    map.setMaxBounds(bounds.pad(0.1));

    const handleClear = () => setActivePointId(null);
    map.on("click", handleClear);
    map.on("move zoom resize", recalcTooltipPosition);

    // Leaflet needs a tick to compute size when mounted inside flex containers
    setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => {
      map.off("click", handleClear);
      map.off("move zoom resize", recalcTooltipPosition);
      const markers = markersRef.current;
      markers.forEach((marker) => marker.remove());
      markers.clear();
      markersRef.current = new Map();
      map.remove();
      mapRef.current = null;
    };
  }, [recalcTooltipPosition]);

  useEffect(() => {
    activePointRef.current = activePointId;
    recalcTooltipPosition();
  }, [activePointId, recalcTooltipPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = markersRef.current;
    const allowedIds = new Set(filteredPoints.map((point) => point.id));

    markers.forEach((marker, id) => {
      if (!allowedIds.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    });

    for (const point of filteredPoints) {
      const markerLatLng: L.LatLngExpression = [point.coord.y, point.coord.x];
      const existing = markers.get(point.id);
      const icon = createMarkerIcon(point.category, point.id === activePointId);

      if (existing) {
        existing.setLatLng(markerLatLng);
        existing.setIcon(icon);
        existing.setZIndexOffset(point.id === activePointId ? 1_000 : 0);
        if (!map.hasLayer(existing)) existing.addTo(map);
        continue;
      }

      const marker = L.marker(markerLatLng, {
        icon,
        keyboard: true,
        riseOnHover: true,
        riseOffset: 500,
        title: point.name,
      });

      marker.on("click", () => {
        focusPoint(point.id, { openTooltip: true });
      });

      marker.addTo(map);
      markers.set(point.id, marker);
    }

    if (activePointId && !allowedIds.has(activePointId)) {
      setActivePointId(null);
    }
  }, [
    activePointId,
    createMarkerIcon,
    filteredPoints,
    focusPoint,
  ]);

  useEffect(() => {
    if (!modalPointId) return;
    if (!pointLookup.has(modalPointId)) {
      setModalPointId(null);
    }
  }, [modalPointId, pointLookup]);

  const handleToggleCategory = (category: MapCategory) => {
    setActiveCategories((prev) => {
      if (prev.includes(category)) {
        const next = prev.filter((item) => item !== category);
        return next;
      }
      return [...prev, category];
    });
  };

  const handleSelectPoint = (pointId: string) => {
    focusPoint(pointId, { openTooltip: true });
  };

  const sheetMaxHeight = isSheetExpanded ? "360px" : "220px";

  return (
    <div
      className="relative w-full"
      style={{
        height:
          "calc(100dvh - var(--header-height) - var(--bottom-nav-height) - env(safe-area-inset-bottom) - (var(--section-block-padding) * 2))",
      }}
    >
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute right-4 top-4 z-[500] flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="shadow-sm">
              필터
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-[140px]">
            {categoryOrder.map((category) => {
              const config = mapCategoryConfig[category];
              const checked = activeCategories.includes(category);
              return (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={checked}
                  onCheckedChange={() => handleToggleCategory(category)}
                >
                  <span
                    className="mr-2 inline-flex size-2.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {activePoint && tooltipPosition ? (
        <div
          className="pointer-events-none absolute z-[450]"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-full pb-4">
            <div className="pointer-events-auto w-60 max-w-[70vw] rounded-2xl border bg-background/95 p-4 text-xs shadow-xl backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground">
                    {mapCategoryConfig[activePoint.category].label}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">
                    {activePoint.name}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-2 text-xs"
                  onClick={() => setModalPointId(activePoint.id)}
                >
                  자세히
                </Button>
              </div>
              {activePoint.summary ? (
                <p className="mt-2 text-muted-foreground">
                  {activePoint.summary}
                </p>
              ) : null}
              {activePoint.hours ? (
                <p className="mt-1 text-[11px] text-muted-foreground/80">
                  운영시간 {activePoint.hours}
                </p>
              ) : null}
            </div>
            <div className="mx-auto -mt-[6px] h-3 w-3 rotate-45 rounded-sm border border-border bg-background/95" />
          </div>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 flex justify-center px-4"
        style={{
          bottom:
            "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 12px)",
        }}
      >
        <div className="pointer-events-auto w-full max-w-xl rounded-3xl border bg-background/95 shadow-2xl backdrop-blur">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-t-3xl border-b px-4 py-2 text-xs font-medium text-muted-foreground"
            onClick={() => setIsSheetExpanded((prev) => !prev)}
          >
            {isSheetExpanded ? "목록 접기" : "목록 펼치기"}
          </button>
          <div
            className="divide-y overflow-y-auto px-4"
            style={{ maxHeight: sheetMaxHeight }}
          >
            {filteredPoints.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                선택한 카테고리에 해당하는 포인트가 없습니다.
              </div>
            ) : (
              filteredPoints.map((point) => {
                const config = mapCategoryConfig[point.category];
                const isActive = point.id === activePointId;
                return (
                  <button
                    key={point.id}
                    type="button"
                    className={clsx(
                      "flex w-full items-start gap-3 py-3 text-left text-sm transition-colors",
                      isActive ? "text-foreground" : "text-foreground/90",
                    )}
                    onClick={() => handleSelectPoint(point.id)}
                  >
                    <span
                      className="mt-1 size-2.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="flex-1">
                      <span className="font-semibold">{point.name}</span>
                      {point.summary ? (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {point.summary}
                        </span>
                      ) : null}
                      {point.hours ? (
                        <span className="mt-1 block text-[11px] text-muted-foreground/80">
                          운영시간 {point.hours}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Dialog.Root
        open={Boolean(modalPoint)}
        onOpenChange={(open) => {
          if (!open) setModalPointId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[700] bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="safe-pl safe-pr safe-pt fixed inset-x-4 top-1/2 z-[750] mx-auto max-w-xl -translate-y-1/2 rounded-2xl border bg-background/98 p-6 shadow-2xl focus:outline-hidden">
            {modalPoint ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-lg font-semibold">
                      {modalPoint.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                      {mapCategoryConfig[modalPoint.category].label}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" aria-label="닫기">
                      <X className="size-4" />
                    </Button>
                  </Dialog.Close>
                </div>
                {modalPoint.hours ? (
                  <div className="rounded-lg border bg-muted/70 px-3 py-2 text-sm">
                    운영시간 {modalPoint.hours}
                  </div>
                ) : null}
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {modalPoint.details}
                </p>
                <div className="flex justify-end">
                  <Dialog.Close asChild>
                    <Button variant="secondary">닫기</Button>
                  </Dialog.Close>
                </div>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
