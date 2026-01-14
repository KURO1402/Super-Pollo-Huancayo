
import { useTheme } from "../context/ThemeContext"; 

export const useTemaParaGraficos = () => {
  const { theme } = useTheme();

  const elegantColors = {
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8', 
    
    dark: {
      background: '#111827',  
      card: '#1f2937', 
      text: '#f9fafb',   
      textSecondary: '#d1d5db',
      grid: '#374151',   
      border: '#4b5563'   
    },
    light: {
      background: '#f8fafc',   
      card: '#ffffff',
      text: '#1e293b',        
      textSecondary: '#64748b', 
      grid: '#e2e8f0',         
      border: '#cbd5e1'  
    },
    
    success: '#059669',   
    warning: '#d97706', 
    danger: '#dc2626',
    info: '#0369a1' 
  };

  const themeColors = theme === 'dark' ? {
    background: elegantColors.dark.card,
    text: elegantColors.dark.text,
    textSecondary: elegantColors.dark.textSecondary,
    grid: elegantColors.dark.grid,
    border: elegantColors.dark.border,
    primary: elegantColors.primary,
    primaryLight: elegantColors.primaryLight,
    primaryDark: elegantColors.primaryDark,
    success: elegantColors.success,
    warning: elegantColors.warning,
    danger: elegantColors.danger,
    info: elegantColors.info
  } : {
    background: elegantColors.light.card,
    text: elegantColors.light.text,
    textSecondary: elegantColors.light.textSecondary,
    grid: elegantColors.light.grid,
    border: elegantColors.light.border,
    primary: elegantColors.primary,
    primaryLight: elegantColors.primaryLight,
    primaryDark: elegantColors.primaryDark,
    success: elegantColors.success,
    warning: elegantColors.warning,
    danger: elegantColors.danger,
    info: elegantColors.info
  };

  return { themeColors };
};