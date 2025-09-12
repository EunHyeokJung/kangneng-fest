import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export default function Home() {
  return (
    <AppShell title="ALL STAR">
      <section className="space-y-4">
        <h1 className="text-xl font-bold">어서오세요! ALL STAR</h1>
        <div>
          <Badge variant="outline" className="gap-1 px-2 py-1 text-[12px]">
            <CalendarDays className="size-3" /> 2025.09.23 ~ 09.24
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">일정, 지도, 주점, 공지까지 한 곳에서.</p>
        <div className="grid grid-cols-2 gap-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>오늘의 주요 일정</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              메인 무대 공연 18:00 / 불꽃놀이 21:00
            </CardContent>
          </Card>
          <Button asChild variant="secondary">
            <a href="/schedule">전체 일정</a>
          </Button>
          <Button asChild>
            <a href="/map">축제 지도</a>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
