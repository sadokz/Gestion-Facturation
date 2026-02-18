import React from "react";
import { Users, Plus, Edit, Phone, Mail, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientResponsiblesListProps {
  responsibles: any[];
  onAdd: () => void;
  onEdit: (responsible: any) => void;
}

export const ClientResponsiblesList: React.FC<ClientResponsiblesListProps> = ({ 
  responsibles, 
  onAdd,
  onEdit 
}) => {
  return (
    <div className="bg-slate-50/50 p-6 rounded-b-2xl border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-slate-400" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Responsables & Contacts</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          onClick={onAdd}
        >
          <Plus size={14} /> Ajouter un responsable
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {responsibles.length > 0 ? (
          responsibles.map((resp, idx) => (
            <div 
              key={resp.id || idx} 
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group hover:border-indigo-300 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{resp.nom}</p>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase flex items-center gap-1">
                      <Briefcase size={10} /> {resp.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onEdit(resp)}>
                  <Edit size={12} />
                </Button>
              </div>
              
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={12} className="text-slate-400" />
                  <span>{resp.tel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} className="text-slate-400" />
                  <span className="truncate">{resp.email}</span>
                </div>
              </div>

              {resp.projets_suivis && (
                <div className="mt-auto pt-3 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <FileText size={10} /> Projets suivis
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    {resp.projets_suivis}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">Aucun responsable enregistré.</p>
          </div>
        )}
      </div>
    </div>
  );
};