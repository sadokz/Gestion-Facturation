import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingCart, 
  ChevronRight,
  Calendar,
  Users,
  Building2,
  Settings as SettingsIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useYear } from "@/context/YearContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobalSearch } from "./GlobalSearch";

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "")} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { selectedYear, setSelectedYear } = useYear();
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i + 1);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            B
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Bureau d'Étude</span>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Tableau de bord" 
            active={location.pathname === "/"} 
          />
          <SidebarItem 
            to="/projects" 
            icon={Briefcase} 
            label="Projets & Ventes" 
            active={location.pathname.startsWith("/projects")} 
          />
          <SidebarItem 
            to="/clients" 
            icon={Users} 
            label="Clients" 
            active={location.pathname === "/clients"} 
          />
          <SidebarItem 
            to="/companies" 
            icon={Building2} 
            label="Entreprises" 
            active={location.pathname === "/companies"} 
          />
          <SidebarItem 
            to="/purchases" 
            icon={ShoppingCart} 
            label="Achats" 
            active={location.pathname === "/purchases"} 
          />
          <SidebarItem 
            to="/settings" 
            icon={SettingsIcon} 
            label="Paramètres" 
            active={location.pathname === "/settings"} 
          />
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Support</p>
          <p className="text-sm text-slate-700">Besoin d'aide ?</p>
          <button className="text-xs text-primary font-semibold mt-1 hover:underline">Consulter la doc</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <GlobalSearch />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
              <Calendar size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Exercice :</span>
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger className="w-[100px] border-none shadow-none h-8 focus:ring-0 font-bold text-primary">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};