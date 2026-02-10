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
import { Card, TrendingUp, PieChart as PieChartIcon, Activity, Users, LayoutDashboard } from "lucide-react";

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({ isOpen, onClose }) => {
  const { preferences, togglePreference } = useDashboard();

  const sections = [
    { id: "showKpiCards", label: "Cartes KPIs", icon: LayoutDashboard },
    { id: "showMonthlyFlux", label: "Flux Mensuel (Graphique)", icon: TrendingUp },
    { id: "showProjectStatus", label: "Statut des Projets (Graphique)", icon: PieChartIcon },
    { id: "showRecentActivity", label: "Activité Récente", icon: Activity },
    { id: "showTopClients", label: "Top Clients", icon: Users },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Personnaliser le Tableau de Bord
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-slate-500">Choisissez les sections à afficher sur votre tableau de bord.</p>
          <div className="grid grid-cols-1 gap-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
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
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};