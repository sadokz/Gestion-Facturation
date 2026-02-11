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
  BarChart3
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({ isOpen, onClose }) => {
  const { preferences, togglePreference } = useDashboard();

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

  const chartSections = [
    { id: "showMonthlyFlux", label: "Flux Mensuel (Graphique)", icon: TrendingUp },
    { id: "showProjectStatus", label: "Statut des Factures (Graphique)", icon: PieChartIcon },
    { id: "showRecentActivity", label: "Activité Récente", icon: Activity },
    { id: "showTopClients", label: "Top Clients", icon: Users },
  ];

  const fluxElements = [
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
        checked={preferences[section.id as keyof typeof preferences]}
        onCheckedChange={() => togglePreference(section.id as keyof typeof preferences)}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Personnaliser le Tableau de Bord
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indicateurs (KPIs)</h4>
              <div className="grid grid-cols-1 gap-2">
                {kpiSections.map((section) => <SectionItem key={section.id} section={section} />)}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Graphiques & Listes</h4>
              <div className="grid grid-cols-1 gap-2">
                {chartSections.map((section) => <SectionItem key={section.id} section={section} />)}
              </div>
            </div>

            {preferences.showMonthlyFlux && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Éléments du Flux Mensuel</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {fluxElements.map((section) => <SectionItem key={section.id} section={section} />)}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};