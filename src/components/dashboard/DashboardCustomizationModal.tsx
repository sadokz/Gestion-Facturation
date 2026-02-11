import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/context/DashboardContext";
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Activity, 
  Users, 
  ShieldCheck, 
  Banknote, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShoppingBag,
  RotateCcw,
  BarChart3,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({ isOpen, onClose }) => {
  const { preferences, togglePreference, resetPreferences, sectionWidths, setSectionWidth } = useDashboard();

  const kpiSections = [
    { id: "totalContractsHT", label: "KPI : Total Contrats (HT)", icon: FileText },
    { id: "totalInvoicedHT", label: "KPI : Total Facturé (HT)", icon: CheckCircle2 },
    { id: "totalRemainingHT", label: "KPI : Reste à Facturer (HT)", icon: Clock },
    { id: "totalPurchasesHT", label: "KPI : Total Achats (HT)", icon: ShoppingBag },
    { id: "showTotalCnssPaid", label: "KPI : Total Payé CNSS", icon: ShieldCheck },
    { id: "showTotalSalaries", label: "KPI : Total Salaires", icon: Banknote },
    { id: "showTotalRevenue", label: "KPI : Chiffre d'affaires", icon: TrendingUp },
    { id: "showTotalProfit", label: "KPI : Bénéfice Total", icon: Wallet },
  ];

  const mainSections = [
    { id: "monthlyFlux", prefId: "showMonthlyFlux", label: "Flux Mensuel (TTC)", icon: BarChart3 },
    { id: "projectStatus", prefId: "showProjectStatus", label: "Statut des Factures", icon: PieChartIcon },
    { id: "recentActivity", prefId: "showRecentActivity", label: "Activité Récente", icon: Activity },
    { id: "topClients", prefId: "showTopClients", label: "Top Clients", icon: Users },
  ];

  const fluxSubElements = [
    { id: "fluxShowInvoiced", label: "Flux : Facturé TTC", icon: CheckCircle2 },
    { id: "fluxShowPending", label: "Flux : En attente TTC", icon: Clock },
    { id: "fluxShowPurchases", label: "Flux : Achats TTC", icon: ShoppingBag },
    { id: "fluxShowSalaries", label: "Flux : Salaires", icon: Banknote },
  ];

  const SectionItem = ({ section }: { section: any }) => (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <section.icon size={18} />
        </div>
        <Label htmlFor={section.id} className="text-sm font-medium cursor-pointer">
          {section.label}
        </Label>
      </div>
      <Switch
        id={section.id}
        checked={!!preferences[section.id as keyof typeof preferences]}
        onCheckedChange={() => togglePreference(section.id as keyof typeof preferences)}
      />
    </div>
  );

  const MainSectionItem = ({ section }: { section: any }) => (
    <div className="space-y-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <section.icon size={18} />
          </div>
          <Label htmlFor={section.prefId} className="text-sm font-medium cursor-pointer">
            {section.label}
          </Label>
        </div>
        <Switch
          id={section.prefId}
          checked={!!preferences[section.prefId as keyof typeof preferences]}
          onCheckedChange={() => togglePreference(section.prefId as keyof typeof preferences)}
        />
      </div>
      
      {preferences[section.prefId as keyof typeof preferences] && (
        <div className="flex items-center gap-2 pl-11">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Largeur :</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setSectionWidth(section.id, "half")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                sectionWidths[section.id] === "half" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Minimize2 size={12} /> 50%
            </button>
            <button 
              onClick={() => setSectionWidth(section.id, "full")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                sectionWidths[section.id] === "full" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Maximize2 size={12} /> 100%
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl flex flex-col h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Personnaliser le Dashboard
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetPreferences}
            className="text-slate-400 hover:text-primary gap-1 h-8 px-2 mr-6"
          >
            <RotateCcw size={14} /> Réinitialiser
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
          {/* Section KPIs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indicateurs (KPIs)</h4>
            <div className="grid grid-cols-1 gap-2">
              {kpiSections.map((section) => <SectionItem key={section.id} section={section} />)}
            </div>
          </div>

          <Separator />

          {/* Section Graphiques et Listes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Graphiques & Listes</h4>
            <div className="grid grid-cols-1 gap-2">
              {mainSections.map((section) => <MainSectionItem key={section.id} section={section} />)}
            </div>
          </div>

          {/* Sous-options du Flux */}
          {preferences.showMonthlyFlux && (
            <>
              <Separator />
              <div className="space-y-3 pb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Détails du Flux Mensuel</h4>
                <div className="grid grid-cols-1 gap-2">
                  {fluxSubElements.map((section) => <SectionItem key={section.id} section={section} />)}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-slate-50/50">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl w-full sm:w-auto">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};