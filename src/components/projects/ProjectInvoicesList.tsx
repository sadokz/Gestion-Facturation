import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  Plus, 
  Edit, 
  CalendarCheck, 
  CalendarDays, 
  UploadCloud, 
  CheckCircle2, 
  GripVertical,
  CreditCard
} from "lucide-react";
import { formatCurrencyDT, formatDateFR, computeTTC } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectInvoicesListProps {
  invoices: any[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: any) => void;
}

const SortableInvoiceItem = ({ 
  inv, 
  idx, 
  onEditInvoice, 
  getStatusStyles, 
  FileStatus 
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: inv.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const tvaPct = inv.tva_pct || 19;
  const montantFactureTTC = computeTTC(inv.montant_ht, tvaPct);
  const montantRetenue = inv.montant_retenue || 0;
  const montantRecuTTC = montantFactureTTC - montantRetenue;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid grid-cols-[30px_120px_160px_110px_1fr_60px_1fr_1fr_100px_1fr_100px_40px] items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm group hover:border-primary/30 transition-colors gap-3",
        isDragging && "shadow-xl border-primary/50"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
        <GripVertical size={18} />
      </div>

      <div className="flex items-center gap-2 overflow-hidden">
        <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-400 shrink-0">
          #{idx + 1}
        </div>
        <div className="truncate">
          <p className="text-[11px] font-mono font-bold text-primary truncate">{inv.numero_facture}</p>
          <p className="text-[9px] text-slate-400 truncate">{inv.type_facture || 'Situation'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Émission</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
            <CalendarDays size={10} className="text-slate-400" />
            {formatDateFR(inv.date_emission || inv.date_facture)}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Paiement</span>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-medium",
            inv.date_payement ? "text-emerald-600" : "text-slate-300 italic"
          )}>
            <CalendarCheck size={10} className={inv.date_payement ? "text-emerald-500" : "text-slate-200"} />
            {inv.date_payement ? formatDateFR(inv.date_payement) : "Attente"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 justify-center border-x border-slate-100 px-1">
        <FileStatus label="Fact" hasFile={!!inv.file_facture} onUpload={() => onEditInvoice(inv)} />
        <FileStatus label="Dépôt" hasFile={!!inv.file_decharge} onUpload={() => onEditInvoice(inv)} />
        <FileStatus label="Ret" hasFile={!!inv.file_retenue} onUpload={() => onEditInvoice(inv)} />
      </div>
      
      <div className="text-right flex flex-col items-end">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Montant Facture HT</span>
        <p className="text-[11px] font-bold text-slate-600">{formatCurrencyDT(inv.montant_ht)}</p>
      </div>

      <div className="text-center flex flex-col items-center">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">TVA%</span>
        <p className="text-[11px] font-bold text-slate-500">{tvaPct}%</p>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">Montant Facture TTC</span>
        <p className="text-[11px] font-bold text-indigo-600">{formatCurrencyDT(montantFactureTTC)}</p>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className="text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Montant Retenue</span>
        <p className="text-[11px] font-bold text-rose-600">
          {montantRetenue > 0 ? formatCurrencyDT(montantRetenue) : "-"}
        </p>
      </div>

      <div className="text-center flex flex-col items-center border-x border-slate-50 px-1">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Mode</span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700">
          <CreditCard size={10} className="text-slate-400" />
          {inv.mode_paiement || "Virement"}
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className="text-[8px] font-bold text-primary uppercase tracking-tighter">Montant Reçu TTC</span>
        <p className="text-[12px] font-black text-slate-900">{formatCurrencyDT(montantRecuTTC)}</p>
      </div>

      <div className="flex justify-center">
        <Badge variant="outline" className={cn(
          "text-[8px] font-bold px-1.5 py-0 whitespace-nowrap w-full justify-center h-4",
          getStatusStyles(inv.statut)
        )}>
          {inv.statut}
        </Badge>
      </div>

      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => onEditInvoice(inv)}>
          <Edit size={14} />
        </Button>
      </div>
    </div>
  );
};

export const ProjectInvoicesList: React.FC<ProjectInvoicesListProps> = ({ 
  invoices: initialInvoices, 
  onAddInvoice,
  onEditInvoice 
}) => {
  const [invoices, setInvoices] = useState(initialInvoices);

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setInvoices((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getStatusStyles = (statut: string) => {
    switch (statut) {
      case "Payé": return "border-emerald-200 text-emerald-600 bg-emerald-50";
      case "Payement En Attente": return "border-amber-200 text-amber-600 bg-amber-50";
      case "Non facturé": return "border-slate-200 text-slate-500 bg-slate-50";
      default: return "border-slate-200 text-slate-500";
    }
  };

  const FileStatus = ({ label, hasFile, onUpload }: { label: string, hasFile: boolean, onUpload: () => void }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={(e) => { e.stopPropagation(); onUpload(); }}
          className={cn(
            "flex flex-col items-center justify-center w-8 h-8 rounded-lg border transition-all",
            hasFile 
              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
              : "bg-slate-50 border-slate-200 text-slate-400 hover:border-primary/30 hover:text-primary"
          )}
        >
          {hasFile ? <CheckCircle2 size={14} /> : <UploadCloud size={14} />}
          <span className="text-[6px] font-bold uppercase mt-0.5">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{hasFile ? `Voir ${label}` : `Téléverser ${label}`}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="bg-slate-50/50 p-6 rounded-b-2xl border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-4 mb-4">
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

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={invoices.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {invoices.length > 0 ? (
              invoices.map((inv, idx) => (
                <SortableInvoiceItem 
                  key={inv.id} 
                  inv={inv} 
                  idx={idx} 
                  onEditInvoice={onEditInvoice}
                  getStatusStyles={getStatusStyles}
                  FileStatus={FileStatus}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400">Aucune facture enregistrée pour ce projet.</p>
                <Button variant="link" className="text-primary text-xs" onClick={onAddInvoice}>Créer la première facture</Button>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};