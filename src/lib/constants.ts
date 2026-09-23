export const APP_CONFIG = {
  name: "RAILBLOCK",
  fullName: "Integrated Railway Maintenance Planning",
  organization: "South Central Railway (SCR)",
  division: "Secunderabad (SC)",
  sectionName: "SEC – NDL",
  corridorLengthKm: 80,
  lineType: "Double Line (KM 40–120)",
  problemStatementId: "26027",
  hackathon: "Smart India Hackathon 2026",
  environmentTag: "Prototype Scenario · Synthetic CAG-calibrated Data",
  syntheticDateTime: "21 Sep 2026 · 02:14:00 IST",
};

export interface SubNavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface PrimaryNavItem {
  key: string;
  label: string;
  href: string;
  icon: string;
  description: string;
  matchingRoutes: string[];
  subItems: SubNavItem[];
}

export const PRIMARY_NAVIGATION: PrimaryNavItem[] = [
  {
    key: "plan",
    label: "PLAN",
    href: "/plan",
    icon: "CalendarRange",
    description: "Build today's integrated maintenance plan",
    matchingRoutes: ["/plan", "/control", "/block-planner", "/decision"],
    subItems: [
      { label: "Integrated Workspace", href: "/plan" },
      { label: "Control Room", href: "/control" },
      { label: "Block Composer", href: "/block-planner" },
      { label: "Decision & Approval", href: "/decision" },
    ],
  },
  {
    key: "work-orders",
    label: "WORK ORDERS",
    href: "/work-register",
    icon: "ClipboardList",
    description: "Maintenance demand register and task prioritization",
    matchingRoutes: ["/work-register", "/tasks"],
    subItems: [
      { label: "All Work Orders", href: "/work-register" },
      { label: "Ingest New Task", href: "/tasks/new" },
    ],
  },
  {
    key: "corridor",
    label: "CORRIDOR",
    href: "/live-corridor",
    icon: "TrainTrack",
    description: "Operational railway simulation and physical block protection",
    matchingRoutes: ["/live-corridor", "/time-distance"],
    subItems: [
      { label: "Live Simulation", href: "/live-corridor" },
      { label: "Marey Diagram", href: "/time-distance" },
    ],
  },
  {
    key: "what-if",
    label: "WHAT-IF",
    href: "/scenarios",
    icon: "Sliders",
    description: "Test operational disruptions and alternative slot replanning",
    matchingRoutes: ["/scenarios"],
    subItems: [
      { label: "Disruption Scenarios", href: "/scenarios" },
    ],
  },
  {
    key: "rolling",
    label: "ROLLING",
    href: "/rolling",
    icon: "Calendar",
    description: "26-week rolling maintenance horizon reservation matrix",
    matchingRoutes: ["/rolling"],
    subItems: [
      { label: "Rolling Plan Matrix", href: "/rolling" },
    ],
  },
  {
    key: "reports",
    label: "REPORTS",
    href: "/reports",
    icon: "BarChart3",
    description: "Planning evidence, constraint outcomes, and benchmarking analysis",
    matchingRoutes: ["/reports", "/analysis", "/siloed-vs-integrated"],
    subItems: [
      { label: "Planning Evidence", href: "/reports" },
      { label: "Quantitative Backtest", href: "/analysis" },
      { label: "Siloed vs Integrated", href: "/siloed-vs-integrated" },
    ],
  },
];

export const SYSTEM_NAV_ITEM: PrimaryNavItem = {
  key: "system",
  label: "SYSTEM",
  href: "/system",
  icon: "Settings",
  description: "Input feeds and configuration status",
  matchingRoutes: ["/system"],
  subItems: [
    { label: "Feeds & Solvers", href: "/system" },
  ],
};

// Backward-compatible alias for existing components
export const NAVIGATION_ITEMS = PRIMARY_NAVIGATION;
