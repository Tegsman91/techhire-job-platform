// category-config.ts
import {
  Code2,
  Server,
  Layers,
  Cloud,
  Database,
  Smartphone,
  Shield,
  Briefcase,
  Palette,
} from "lucide-react";

export const categoryConfig = [
  {
    label: "Frontend Development",
    value: "Frontend",
    icon: Code2,
  },
  {
    label: "Backend Development",
    value: "Backend",
    icon: Server,
  },
  {
    label: "Full-Stack",
    value: "Full-Stack",
    icon: Layers,
  },
  {
    label: "DevOps/SRE",
    value: "DevOps",
    icon: Cloud,
  },
  {
    label: "Data Science",
    value: "Data Science",
    icon: Database,
  },
  {
    label: "Mobile Development",
    value: "Mobile",
    icon: Smartphone,
  },
  {
    label: "Security",
    value: "Security",
    icon: Shield,
  },
  {
    label: "Product Management",
    value: "Product",
    icon: Briefcase,
  },
  {
    label: "Design (UI/UX)",
    value: "Design",
    icon: Palette,
  },
];