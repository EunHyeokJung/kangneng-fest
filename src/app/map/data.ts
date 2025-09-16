export type MapCategory =
  | "stage"
  | "busStop"
  | "pub"
  | "activity"
  | "photo"
  | "foodTruck"
  | "parking";

export interface MapPoint {
  id: string;
  name: string;
  category: MapCategory;
  coord: {
    x: number; // pixels from left on the source image
    y: number; // pixels from top on the source image
  };
  summary: string;
  details: string;
  hours?: string;
}

export const mapCategoryConfig: Record<
  MapCategory,
  { label: string; color: string }
> = {
  stage: { label: "무대", color: "#ef4444" },
  busStop: { label: "정류장", color: "#3b82f6" },
  pub: { label: "주점", color: "#f97316" },
  activity: { label: "체험부스", color: "#22c55e" },
  photo: { label: "포토부스", color: "#a855f7" },
  foodTruck: { label: "푸드트럭", color: "#f59e0b" },
  parking: { label: "주차장", color: "#0ea5e9" },
};

export const mapPoints: MapPoint[] = [
  {
    id: "stage-main",
    name: "메인 메가 스테이지",
    category: "stage",
    coord: { x: 540, y: 360 },
    summary: "메인 공연과 개막식이 열리는 중심 무대입니다.",
    hours: "17:00 - 22:00",
    details:
      "축제 양일 간 가장 많은 공연이 진행되는 장소입니다. 개막식과 메인 아티스트 공연이 이곳에서 열릴 예정이며, 음향/조명 장비 점검을 위해 공연 시작 30분 전에는 입장이 제한될 수 있습니다.",
  },
  {
    id: "stage-busking",
    name: "잔디광장 버스킹존",
    category: "stage",
    coord: { x: 710, y: 540 },
    summary: "동아리, 버스커 공연이 릴레이로 진행돼요.",
    hours: "16:00 - 20:30",
    details:
      "학생 자치 동아리의 공연이 이어지는 버스킹 공간입니다. 간소한 음향장비만 배치되어 있어 가까이서 관람하면 더욱 생동감 있게 즐길 수 있습니다.",
  },
  {
    id: "busStop-upper",
    name: "상단 셔틀 정류장",
    category: "busStop",
    coord: { x: 290, y: 1180 },
    summary: "캠퍼스 외부로 나가는 셔틀버스 탑승 장소.",
    hours: "첫차 15:40, 막차 22:30",
    details:
      "축제 종료 후 귀가 편의를 위해 운영되는 셔틀버스 승차장입니다. 노선은 강릉시청, 교동주공 방향 두 개입니다. 현장 스태프 안내에 따라 줄을 맞춰주시길 바랍니다.",
  },
  {
    id: "busStop-lake",
    name: "호수공원 셔틀 정류장",
    category: "busStop",
    coord: { x: 870, y: 1230 },
    summary: "호수공원 방면 셔틀 탑승 위치.",
    hours: "첫차 16:00, 막차 22:00",
    details:
      "호수공원과 시내를 순환하는 셔틀입니다. 20분 간격으로 운행되며, 만석 시 다음 차량을 이용해주세요.",
  },
  {
    id: "pub-g1",
    name: "경영대 주점",
    category: "pub",
    coord: { x: 460, y: 840 },
    summary: "수제 안주와 시그니처 칵테일을 판매합니다.",
    hours: "17:00 - 23:00",
    details:
      "경영학과 학생회가 운영하는 주점으로, 과 특색을 살린 시그니처 칵테일과 간단한 안주를 준비했습니다. 신분증 지참 필수!",
  },
  {
    id: "activity-makers",
    name: "메이커 체험존",
    category: "activity",
    coord: { x: 640, y: 720 },
    summary: "레이저 커팅 기념품과 3D 프린팅 체험.",
    hours: "15:00 - 21:00",
    details:
      "공학교육혁신센터가 준비한 메이커 체험 부스입니다. 사전 예약자 우선이며, 현장 대기표도 일정 수량 배포됩니다.",
  },
  {
    id: "photo-spot",
    name: "포토도어 포토존",
    category: "photo",
    coord: { x: 240, y: 540 },
    summary: "LED 문 프레임과 조명 설치된 포토 스폿.",
    details:
      "밤이 되면 다양한 색으로 점등되는 포토존입니다. 대기줄이 길 수 있으니 시간 여유를 갖고 방문해주세요.",
  },
  {
    id: "foodtruck-line",
    name: "푸드트럭 거리",
    category: "foodTruck",
    coord: { x: 860, y: 780 },
    summary: "치킨, 타코, 디저트까지 다 모인 먹거리 라인.",
    hours: "16:00 - 23:30",
    details:
      "10대의 푸드트럭이 연속으로 배치되어 있으며, 간편 결제를 지원합니다. 쓰레기는 분리수거존에 버려주세요.",
  },
  {
    id: "parking-main",
    name: "본관 주차장",
    category: "parking",
    coord: { x: 980, y: 1020 },
    summary: "행사 기간 임시 주차 구역 (사전 예약 차량만 입장).",
    details:
      "사전 등록된 차량 번호만 입장 가능합니다. 택시 승하차 지점은 주차장 입구 외측에서 운영됩니다.",
  },
];

export const mapImage = {
  src: "/images/info/shuttle_bus_route.png",
  width: 1080,
  height: 1350,
};

