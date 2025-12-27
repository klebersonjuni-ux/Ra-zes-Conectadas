import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utilitário para combinar classes CSS (usado pelos componentes UI)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Utilitário de navegação usado no Layout
export function createPageUrl(pageName) {
  // Converte "Dashboard" para "/dashboard", "CartasAbertas" para "/cartas", etc.
  const routes = {
    "Dashboard": "/dashboard",
    "Territorios": "/territorios",
    "Comunidades": "/comunidades",
    "CartasAbertas": "/cartas",
    "Biblioteca": "/biblioteca",
    "Narrativas": "/narrativas",
    "Integracao": "/integracao",
    "Onboarding": "/onboarding"
  };
  return routes[pageName] || "/dashboard";
}