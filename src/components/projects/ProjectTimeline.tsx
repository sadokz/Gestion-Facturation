import React from "react";
import { 
  Receipt, 
  Users, 
  MapPin, 
  ClipboardList, 
  Send, 
  Inbox, 
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { formatDateFR, formatCurrencyDT } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string | number;
  date: string;
  type: string;
  title: string;
  description?: string;
  amount?: number;
  category: 'financial' | 'technical';
  status?: string;
}

interface ProjectTimelineProps {
  invoices: any[];
  technicalEntries: any[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ invoices, technicalEntries }) => {
  // Fusion et tri des événements
  const events: TimelineEvent[] = [
    ...invoices.map(inv => ({
      id: `inv-${inv.id}`,
      date: inv.date_facture || inv.date_emission,
      type: 'Facture',
      title: inv.numero_facture,
      description: inv.note || inv.type_facture,
      amount: inv.montant_ht,
      category: 'financial' as const,
      status: inv.statut
    })),
    ...technicalEntries.map(entry => ({
      id: `tech-${entry.id}`,
      date: entry.date,
      type: entry.type,
      title: entry.libelle,
      description: entry.effectue_par,
      category: 'technical' as const,
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIcon = (event: TimelineEvent) => {
    if (event.category === 'financial') return <Receipt size={16} />;
    switch (event.type) {
      case "Réunion": return <Users size={16} />;
      case "Relevée": return <MapPin size={16} />;
      case "Tache": return <ClipboardList size={16} />;
      case "Envoyé": return <Send size={16} />;
      case "Reçu": return <Inbox size={16} />;
      default: return <CheckCircle2 size={16} />;
    }
  };

  const getColorClass = (event: TimelineEvent) => {
    if (event.category === 'financial') return "bg-emerald-100 text-emerald-600 border-emerald-200";
    switch (event.type) {
      case "Réunion": return "bg-blue-100 text-blue-600 border-blue-200";
      case "Relevée": return "bg-purple-100 text-purple-600 border-purple-200";
      case "Envoyé": return "bg-indigo-100 text-indigo-600 border-indigo-200";
      case "Reçu": return "bg-rose-100 text-rose-600 border-rose-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
      {events.length > 0 ? (
        events.map((event, idx) => (
          <div key={event.id} className="relative flex items-start gap-6 group animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
            {/* Icone de la Timeline */}
            <div className={cn(
              "relative z-10 flex items-center justify-center w-10 h-10 rounded-xl border-2 bg-white transition-transform group-hover:scale-110 shrink-0",
              getColorClass(event)
            )}>
              {getIcon(event)}
            </div>

            {/* Contenu de l'événement */}
            <div className="flex-1 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {event.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                </div>
                <time className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDateFR(event.date)}
                </time>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group-hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-slate-500 italic">{event.description}</p>
                  {event.amount !== undefined && (
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">{formatCurrencyDT(event.amount)}</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{event.status}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Calendar size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-400 font-medium">Aucun événement enregistré pour le moment.</p>
        </div>
      )}
    </div>
  );
};