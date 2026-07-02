import type { LucideIcon } from "lucide-react";

export interface DashboardButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  colorScheme: "blue" | "indigo" | "violet" | "green" | "slate";
}