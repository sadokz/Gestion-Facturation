import React from "react";
import { 
  Users, 
  Plus, 
  Edit, 
  Calendar, 
  ClipboardList, 
  MapPin, 
  CheckCircle2,
  MessageSquare,
  Send,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateFR } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TechnicalSubEntriesListProps {
  entries: any[];
  onAdd: () => void;
  onEdit: (entry: any) => void;
}

export const TechnicalSubEntriesList: React.FC<TechnicalSubEntriesListProps> = ({ 
  entries, 
  onAdd,
  onEdit 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Réunion": return <Users size={14} className="text-blue-500" />;
      case "Relevée": return <MapPin size={14} className="text-emerald-500" />;
      case "Tache": return <ClipboardList size={14} className="text-amber-500" />;
      case "Envoyé": return <Send size={14} className="text-indigo-500" />;
      case "Reçu": return <Inbox size={14} className="text-rose-500" />;
      default: return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className="bg-slate-50/50 p-6 rounded-b-2xl border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-slate-400" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Interventions & Suivi de Chantier</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 rounded-lg border-primary/20 text-primary hover:bg-primary/5"
          onClick={onAdd}
        >
          <Plus size={14} /> Nouvelle intervention
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.length > 0 ? (
          entries.map((entry, idx) => (
            <div 
              key={entry.id || idx} 
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group hover:border-primary/30 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    entry.type === "Réunion" ? "bg-blue-50 text-blue-600" : 
                    entry.type === "Relevée" ? "bg-emerald-50 text-emerald-600" : 
                    entry.type === "Tache" ? "bg-amber-50 text-amber-600" :
                    entry.type === "Envoyé" ? "bg-indigo-50 text-indigo-600" :
                    "bg-rose-50 text-rose-600"
                  )}>
                    {getTypeIcon(entry.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{entry.libelle}</p>
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold uppercase">
                      {entry.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onEdit(entry)}>
                  <Edit size={12} />
                </Button>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Calendar size={12} className="text-slate-400" />
                  <span>{formatDateFR(entry.date)}</span>
                </div>
                {entry.intervenants && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Users size={12} className="text-slate-400" />
                    <span className="truncate">{entry.intervenants}</span>
                  </div>
                )}
              </div>

              {entry.compte_rendu && (
                <div className="mt-auto pt-3 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <MessageSquare size={10} /> Notes
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    {entry.compte_rendu}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">Aucune intervention enregistrée pour ce projet.</p>
          </div>
        )}
      </div>
    </div>
  );
};