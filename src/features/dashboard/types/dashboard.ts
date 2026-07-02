import type { LucideIcon } from "lucide-react";
import type { ColorSchemeKey } from "../config/ColorSchemes";

export interface DashboardButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  colorScheme: ColorSchemeKey;
}