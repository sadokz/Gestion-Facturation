import React from "react";
import { Receipt, Plus, Edit, CalendarCheck } from "lucide-react";
import { formatCurrencyDT, formatDateFR } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectInvoicesListProps {
  invoices: any[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: any) => void;
}

export const ProjectInvoicesList: React.FC<ProjectInvoicesListProps> = ({ 
  invoices, 
  onAddInvoice,
  onEditInvoice 
}) => {
  const getStatusStyles = (statut: string) => {
    switch (statut) {
      case "Payé":
        return "border-emerald-200 text-emerald-600 bg-emerald-50";
      case "Payement En Attente":
        return "border-amber-200 text-amber-600 bg-amber-50";
      case "Non facturé":
        return "border-slate-200 text-slate-500 bg-slate-50";
      default:
        return "border-slate-200 text-slate-500";
    }
  };

  return (
    <div className="bg-slate-50/50 p-6 rounded-b-2xl border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-slate-400" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Détail des facturations</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 rounded-lg border-primary/20 text-primary hover:bg-primary/5"
          onClick={onAddInvoice}
        >
          <Plus size={14} /> Ajouter une facture
        </Button>
      </div>

      <div className="space-y-2">
        {invoices.length > 0 ? (
          invoices.map((inv, idx) => (
            <div 
              key={inv.id || idx} 
              className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  #{idx + 1}
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-primary">{inv.numero_facture}</p>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-slate-500">Émise le : {formatDateFR(inv.date_emission || inv.date_facture)}</p>
                    {inv.date_payement && (
                      <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <CalendarCheck size={10} /> Payée le : {formatDateFR(inv.date_payement)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{formatCurrencyDT(inv.montant_ht)}</p>
                  <p className="text-[10px] text-slate-400">{inv.type_facture || 'Situation'}</p>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-bold px-2 py-0 whitespace-nowrap",
                  getStatusStyles(inv.statut)
                )}>
                  {inv.statut}
                </Badge>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => onEditInvoice(inv)}>
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">Aucune facture enregistrée pour ce projet.</p>
            <Button variant="link" className="text-primary text-xs" onClick={onAddInvoice}>Créer la première facture</Button>
          </div>
        )}
      </div>
    </div>
  );
};