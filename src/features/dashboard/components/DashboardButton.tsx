import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { colorSchemes } from "../config/ColorSchemes";
import type {DashboardButtonProps} from "../types/dashboard";

const buttonVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98
  }
};

export default function DashboardButton({
  onClick,
  icon: Icon,
  title,
  description,
  colorScheme,
}: DashboardButtonProps) {

  const colors = colorSchemes[colorScheme];

  return (
    <motion.button
      onClick={onClick}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className={`w-full group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${colors.bgGradient} border ${colors.border} rounded-2xl p-5 md:p-6 hover:shadow-2xl ${colors.shadow} transform`}
    >
      {/* Efecto de brillo mejorado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Efecto de resplandor interno */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icono con gradiente y efecto 3D animado */}
          <motion.div 
            whileHover={{ 
              scale: 1.1, 
              rotate: 3,
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            className={`p-3.5 md:p-4 rounded-xl ${colors.iconBg} shadow-lg`}
          >
            <Icon className={`w-6 h-6 md:w-7 md:h-7 ${colors.iconColor}`} />
          </motion.div>
          
          <div className="text-left">
            <h3 className={`text-base md:text-lg font-bold ${colors.title} transition-colors mb-1`}>
              {title}
            </h3>
            <p className={`text-xs md:text-sm ${colors.description} transition-colors font-medium`}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Chevron con animación */}
        <motion.div
          animate={{ x: 0 }}
          whileHover={{ x: 8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronRight 
            className={`w-6 h-6 md:w-7 md:h-7 ${colors.chevron}`} 
          />
        </motion.div>
      </div>
    </motion.button>
  );
}