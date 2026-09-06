import {
  Building2,
  ClipboardList,
  Gauge,
  Leaf,
  MapPinned,
  ShieldCheck,
  TrainFront,
  Wallet,
  Waypoints,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, typeof Waypoints> = {
  Highways: Waypoints,
  Railways: TrainFront,
  "Smart Cities": Building2,
  "Public Infrastructure": Leaf,
};

export const STEP_ICONS: Record<string, typeof ClipboardList> = {
  "01": ClipboardList,
  "02": MapPinned,
  "03": ShieldCheck,
  "04": Wallet,
  "05": Gauge,
};
