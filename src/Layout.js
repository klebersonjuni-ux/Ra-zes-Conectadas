import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, Map, Users, BookOpen, Mic, Leaf, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Círculo de Saberes",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Territórios",
    url: createPageUrl("Territorios"),
    icon: Map,
  },
  {
    title: "Comunidades",
    url: createPageUrl("Comunidades"),
    icon: Users,
  },
  {
    title: "Cartas Abertas",
    url: createPageUrl("CartasAbertas"),
    icon: FileText,
  },
  {
    title: "Biblioteca Viva",
    url: createPageUrl("Biblioteca"),
    icon: BookOpen,
  },
  {
    title: "Narrativas Orais",
    url: createPageUrl("Narrativas"),
    icon: Mic,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkOnboarding = async () => {
      try {
        const currentUser = await base44.auth.me();
        
        if (!isMounted) return;
        
        setUser(currentUser);
        
        // Só redireciona para onboarding se não estiver já nessa página
        if (!currentUser.onboarding_completo && !location.pathname.includes('Onboarding')) {
          navigate(createPageUrl("Onboarding"), { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-amber-800 font-medium">Carregando Raízes...</p>
        </div>
      </div>
    );
  }

  if (location.pathname.includes('Onboarding')) {
    return children;
  }

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --color-terra: #8B4513;
            --color-folha: #228B22;
            --color-ceu: #87CEEB;
            --color-raiz: #D2691E;
            --color-pedra: #696969;
            --background-organico: #FAF7F0;
          }
          
          body {
            background: var(--background-organico);
            font-family: 'Inter', system-ui, sans-serif;
          }
          
          .circular-flow {
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          
          .organic-border {
            border-radius: 25px 5px 25px 5px;
          }
          
          .terra-gradient {
            background: linear-gradient(135deg, var(--color-terra) 0%, var(--color-raiz) 100%);
          }
          
          .folha-gradient {
            background: linear-gradient(135deg, var(--color-folha) 0%, #32CD32 100%);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-[var(--background-organico)]">
        <Sidebar className="border-r border-orange-200 bg-gradient-to-b from-orange-50 to-amber-50">
          <SidebarHeader className="border-b border-orange-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 terra-gradient rounded-full flex items-center justify-center transform rotate-12">
                <Leaf className="w-6 h-6 text-amber-50 transform -rotate-12" />
              </div>
              <div>
                <h2 className="font-bold text-amber-900 text-lg">Raízes</h2>
                <p className="text-sm text-amber-700">Saberes do território</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sm font-semibold text-amber-800 px-3 py-3">
                Navegação Circular
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`organic-border hover:bg-orange-100 hover:text-amber-800 transition-all duration-300 mb-2 ${
                          location.pathname === item.url ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-amber-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-sm font-semibold text-amber-800 px-3 py-3">
                Bem Viver Coletivo
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 folha-gradient circular-flow flex items-center justify-center">
                      <span className="text-white font-bold text-xs">42</span>
                    </div>
                    <div>
                      <span className="text-amber-800 font-medium">Comunidades</span>
                      <p className="text-amber-600 text-xs">Conectadas na rede</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 circular-flow flex items-center justify-center">
                      <span className="text-white font-bold text-xs">156</span>
                    </div>
                    <div>
                      <span className="text-amber-800 font-medium">Saberes</span>
                      <p className="text-amber-600 text-xs">Compartilhados hoje</p>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200 p-4 bg-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 circular-flow flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "🌱"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-900 text-sm truncate">
                  {user?.full_name || "Guardião(ã)"}
                </p>
                <p className="text-xs text-amber-700 truncate">
                  {user?.tipo_participante?.replace("_", " ") || "Participante"}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur border-b border-orange-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-full transition-colors duration-200" />
              <h1 className="text-xl font-bold text-amber-900">Raízes</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}