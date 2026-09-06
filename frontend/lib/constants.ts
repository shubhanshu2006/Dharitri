export const SITE_NAME = "DHARITRI";

export const GITHUB_URL = "https://github.com/dharitri-platform";
export const TWITTER_URL = "https://x.com/dharitri";

export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Impact", href: "#impact" },
  { label: "Explore", href: "#footer" },
] as const;

export const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Impact", href: "#impact" },
] as const;

export const HERO_CATEGORIES = [
  { label: "Highways", sub: "Connecting People" },
  { label: "Railways", sub: "Stronger Regions" },
  { label: "Smart Cities", sub: "Better Living" },
  { label: "Public Infrastructure", sub: "Sustainable Growth" },
] as const;

export const HERO_MARKERS = [
  { label: "Industrial Corridors", top: "27%", left: "45%" },
  { label: "Rail Connectivity", top: "31%", left: "58%" },
  { label: "Energy Infrastructure", top: "48%", left: "86%" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    id: "01",
    title: "Register the project",
    description:
      "Define scope, corridor and land requirement for a highway, rail, industrial or urban project.",
  },
  {
    id: "02",
    title: "Map the land parcels",
    description:
      "Overlay the project boundary on cadastral GIS data to identify every affected parcel.",
  },
  {
    id: "03",
    title: "Verify & process",
    description:
      "Run digital scrutiny, approvals and workflow with a complete, tamper-evident audit trail.",
  },
  {
    id: "04",
    title: "Track compensation",
    description:
      "Follow assessment, award, payment initiation and verified beneficiary credit — never conflated.",
  },
  {
    id: "05",
    title: "Monitor to possession",
    description:
      "Dashboards, alerts and risk scoring guide every case from notification to final handover.",
  },
] as const;

export const TECH_STACK = [
  {
    title: "Frontend & UI",
    tag: "Experience Layer",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Spatial Engine",
    tag: "GIS Core",
    items: ["PostGIS", "MapLibre", "GDAL", "GeoPandas"],
  },
  {
    title: "Backend & API",
    tag: "Service Layer",
    items: ["Node.js", "NestJS", "REST", "OpenAPI"],
  },
  {
    title: "Security & Access",
    tag: "Governance",
    items: ["OAuth2 / OIDC", "MFA", "RBAC", "Audit Log"],
  },
  {
    title: "Analytics & ML",
    tag: "Decision Support",
    items: ["Python", "Pandas", "Scikit-learn", "XGBoost"],
  },
] as const;

export const IMPACT_STATS = [
  { value: 100000, suffix: "+", label: "Hectares trackable at parcel level" },
  { value: 5, suffix: "x", label: "Faster status reporting across agencies" },
  { value: 100, suffix: "%", label: "Traceable compensation lifecycle" },
  { value: 8, suffix: "+", label: "Government systems designed to integrate" },
] as const;
