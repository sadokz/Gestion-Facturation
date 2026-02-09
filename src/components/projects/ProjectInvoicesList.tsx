import React from "react";
import { Receipt, Plus, Edit, CalendarCheck, CalendarDays, FileText, UploadCloud, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatCurrencyDT, formatDateFR } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

  const FileStatus = ({ label, hasFile, onUpload }: { label: string, hasFile: boolean, onUpload: () => void }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={(e) => { e.stopPropagation(); onUpload(); }}
          className={cn(
            "flex flex-col items-center justify-center w-10 h-10 rounded-xl border transition-all",
            hasFile 
              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
              : "bg-slate-50 border-slate-200 text-slate-400 hover:border-primary/30 hover:text-primary"
          )}
        >
          {hasFile ? <CheckCircle2 size={16} /> : <UploadCloud size={16} />}
          <span className="text-[7px] font-bold uppercase mt-0.5">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{hasFile ? `Voir ${label}` : `Téléverser ${label}`}</p>
      </TooltipContent>
    </Tooltip>
  );

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
              {/* Info Facture */}
              <div className="flex items-center gap-4 w-[18%]">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                  #{idx + 1}
                </div>
                <div className="truncate">
                  <p className="text-xs font-mono font-bold text-primary truncate">{inv.numero_facture}</p>
                  <p className="text-[10px] text-slate-400 truncate">{inv.type_facture || 'Situation'}</p>
                </div>
              </div>
              
              {/* Dates */}
              <div className="flex-1 grid grid-cols-2 gap-4 px-4 max-w-[25%]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Émission</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <CalendarDays size={12} className="text-slate-400" />
                    {formatDateFR(inv.date_emission || inv.date_facture)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Paiement</span>
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs font-medium",
                    inv.date_payement ? "text-emerald-600" : "text-slate-300 italic"
                  )}>
                    <CalendarCheck size={12} className={inv.date_payement ? "text-emerald-500" : "text-slate-200"} />
                    {inv.date_payement ? formatDateFR(inv.date_payement) : "En attente"}
                  </div>
                </div>
              </div>

              {/* Fichiers Téléversables */}
              <div className="flex items-center gap-3 px-4 border-x border-slate-100">
                <FileStatus label="Facture" hasFile={!!inv.file_facture} onUpload={() => onEditInvoice(inv)} />
                <FileStatus label="Décharge" hasFile={!!inv.file_decharge} onUpload={() => onEditInvoice(inv)} />
                <FileStatus label="Retenue" hasFile={!!inv.file_retenue} onUpload={() => onEditInvoice(inv)} />
              </div>
              
              {/* Montant & Statut */}
              <div className="flex items-center gap-6 w-[30%] justify-end">
                <div className="text-right flex flex-col items-end">
                  <p className="text-sm font-black text-slate-900">{formatCurrencyDT(inv.montant_ht)}</p>
                  {inv.montant_retenue > 0 && (
                    <p className="text-[9px] text-rose-500 font-bold flex items-center gap-1">
                      <ShieldAlert size={10} /> Retenue: {formatCurrencyDT(inv.montant_retenue)}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-bold px-2 py-0 whitespace-nowrap min-w-[80px] justify-center",
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