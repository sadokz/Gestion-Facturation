import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingCart, 
  ChevronRight,
  Calendar,
  Users,
  Building2,
  Settings as SettingsIcon,
  Banknote,
  UserCheck,
  ShieldCheck,
  Calculator,
  Settings2,
  Plus,
  ClipboardCheck,
  Building,
  LogOut,
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useYear } from "@/context/YearContext";
import { useNavigation } from "@/context/NavigationContext";
import { useMyCompany } from "@/context/CompanyContext";
import { useUser } from "@/context/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "./GlobalSearch";
import { Button } from "@/components/ui/button";
import { DashboardCustomizationModal } from "../dashboard/DashboardCustomizationModal";
import { YearManagementModal } from "./YearManagementModal";
import { CompanyManagementModal } from "./CompanyManagementModal";
import { ThemeToggle } from "../theme-toggle";
import { PrivacyToggle } from "./PrivacyToggle";
import { Badge } from "@/components/ui/badge";

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group whitespace-nowrap",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110 shrink-0", active ? "text-white" : "")} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto shrink-0" />}
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { selectedYear, setSelectedYear, availableYears } = useYear();
  const { selectedCompany, setSelectedCompany, myCompanies } = useMyCompany();
  const { tabs } = useNavigation();
  const { currentUser, setCurrentUser, allUsers } = useUser();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const companyInitial = selectedCompany?.nom?.charAt(0) || "B";

  // Filtrer les entités accessibles par l'utilisateur
  const accessibleCompanies = currentUser.isSuperAdmin 
    ? myCompanies 
    : myCompanies.filter(c => currentUser.allowedCompanies?.includes(c.id));

  // Filtrer les onglets en fonction des permissions de l'utilisateur actuel
  const isVisible = (tabId: string) => {
    return tabs[tabId as keyof typeof tabs] && currentUser.permissions[tabId];
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 sticky top-0 h-screen transition-all duration-300 ease-in-out z-30 shrink-0",
          isSidebarOpen ? "w-64 translate-x-0" : "w-0 p-0 -translate-x-full border-none"
        )}
      >
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className={cn(
            "flex items-center gap-3 px-2 hover:opacity-80 transition-all text-left outline-none",
            !isSidebarOpen && "opacity-0 pointer-events-none"
          )}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 shrink-0 overflow-hidden">
            {selectedCompany?.logo ? (
              <img src={selectedCompany.logo} alt="Logo" className="w-full h-full object-contain bg-white" />
            ) : (
              companyInitial
            )}
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 truncate">
            {selectedCompany?.nom || "Bureau d'Étude"}
          </span>
        </button>

        <nav className={cn("flex flex-col gap-2 transition-opacity duration-200 overflow-y-auto pr-2", !isSidebarOpen && "opacity-0")}>
          {isVisible("dashboard") && (
            <SidebarItem to="/" icon={LayoutDashboard} label="Tableau de bord" active={location.pathname === "/"} />
          )}
          {isVisible("projects") && (
            <SidebarItem to="/projects" icon={Briefcase} label="Projets & Ventes" active={location.pathname.startsWith("/projects")} />
          )}
          {isVisible("projectTracking") && (
            <SidebarItem to="/project-tracking" icon={ClipboardCheck} label="Suivi Technique" active={location.pathname === "/project-tracking"} />
          )}
          {isVisible("clients") && (
            <SidebarItem to="/clients" icon={Users} label="Clients" active={location.pathname === "/clients"} />
          )}
          {isVisible("companies") && (
            <SidebarItem to="/companies" icon={Building2} label="Entreprises" active={location.pathname === "/companies"} />
          )}
          {isVisible("purchases") && (
            <SidebarItem to="/purchases" icon={ShoppingCart} label="Achats" active={location.pathname === "/purchases"} />
          )}
          {isVisible("salaries") && (
            <SidebarItem to="/salaries" icon={Banknote} label="Salaires" active={location.pathname === "/salaries"} />
          )}
          {isVisible("hr") && (
            <SidebarItem to="/hr" icon={UserCheck} label="RH (Congés)" active={location.pathname === "/hr"} />
          )}
          {isVisible("cnss") && (
            <SidebarItem to="/cnss" icon={ShieldCheck} label="Déclaration CNSS" active={location.pathname === "/cnss"} />
          )}
          {isVisible("accounting") && (
            <SidebarItem to="/accounting" icon={Calculator} label="Bilan Comptable" active={location.pathname === "/accounting"} />
          )}
          {isVisible("settings") && (
            <SidebarItem to="/settings" icon={SettingsIcon} label="Paramètres" active={location.pathname === "/settings"} />
          )}
        </nav>

        <div className={cn("mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-opacity duration-200", !isSidebarOpen && "opacity-0")}>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2 whitespace-nowrap">Support</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">Besoin d'aide ?</p>
          <button className="text-xs text-primary font-semibold mt-1 hover:underline whitespace-nowrap">Consulter la doc</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-3 hover:opacity-80 transition-all outline-none shrink-0 mr-4"
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 shrink-0 overflow-hidden">
                  {selectedCompany?.logo ? (
                    <img src={selectedCompany.logo} alt="Logo" className="w-full h-full object-contain bg-white" />
                  ) : (
                    companyInitial
                  )}
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap hidden sm:block">
                  {selectedCompany?.nom || "Bureau d'Étude"}
                </span>
              </button>
            )}
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-3">
            <PrivacyToggle />
            <ThemeToggle />
            
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Sélecteur d'Entreprise - Visible seulement si plusieurs entités accessibles */}
            {accessibleCompanies.length > 1 && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
                <Building size={16} className="text-primary" />
                <div className="flex items-center gap-1">
                  <Select 
                    value={selectedCompany?.id} 
                    onValueChange={(id) => {
                      const found = accessibleCompanies.find(c => c.id === id);
                      if (found) setSelectedCompany(found);
                    }}
                  >
                    <SelectTrigger className="w-[160px] border-none shadow-none h-8 focus:ring-0 font-bold text-slate-700 dark:text-slate-200 bg-transparent truncate">
                      <SelectValue placeholder="Entreprise" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessibleCompanies.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {currentUser.isSuperAdmin && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                      onClick={() => setIsCompanyModalOpen(true)}
                    >
                      <Plus size={14} />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Sélecteur d'Exercice */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
              <Calendar size={16} className="text-slate-500" />
              <div className="flex items-center gap-1">
                <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                  <SelectTrigger className="w-[90px] border-none shadow-none h-8 focus:ring-0 font-bold text-primary bg-transparent">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentUser.isSuperAdmin && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    onClick={() => setIsYearModalOpen(true)}
                  >
                    <Plus size={14} />
                  </Button>
                )}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl h-9 w-9 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setIsCustomizationModalOpen(true)}
            >
              <Settings2 size={18} />
            </Button>

            {/* Avatar Dropdown pour changer d'utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all outline-none group">
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.avatar}`} alt={currentUser.nom} />
                  </div>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{currentUser.nom}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{currentUser.poste}</span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-slate-200 dark:border-slate-800">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Changer d'utilisateur</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2" />
                <div className="max-h-[300px] overflow-y-auto py-1">
                  {allUsers.map((user) => (
                    <DropdownMenuItem 
                      key={user.id} 
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors mb-1",
                        currentUser.id === user.id ? "bg-primary/5 border border-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                      onClick={() => setCurrentUser(user)}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} alt={user.nom} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.nom}</p>
                          {user.isSuperAdmin && <ShieldCheck size={12} className="text-primary shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.poste}</p>
                      </div>
                      {currentUser.id === user.id && (
                        <Badge className="h-4 px-1.5 text-[8px] bg-primary text-white">Actif</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="mx-2" />
                <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-xl cursor-pointer text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                  <LogOut size={16} />
                  <span className="text-sm font-bold">Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 overflow-auto flex-1">
          {children}
        </div>
      </main>
      <DashboardCustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setIsCustomizationModalOpen(false)} />
      <YearManagementModal isOpen={isYearModalOpen} onClose={() => setIsYearModalOpen(false)} />
      <CompanyManagementModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} />
    </div>
  );
};