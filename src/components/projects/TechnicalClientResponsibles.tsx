import React from "react";
import { Users, Phone, Mail, Briefcase, Plus, Edit, Trash2, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TechnicalClientResponsiblesProps {
  clientName: string;
  responsibles: any[];
  onManage: () => void;
  onEdit: (resp: any) => void;
  onDelete: (resp: any) => void;
  onHide: (resp: any) => void;
}

export const TechnicalClientResponsibles: React.FC<TechnicalClientResponsiblesProps> = ({ 
  clientName, 
  responsibles,
  onManage,
  onEdit,
  onDelete,
  onHide
}) => {
  return (
    <div className="bg-indigo-50/30 p-6 border-t border-indigo-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Responsables Maître d'Ouvrage ({clientName})
          </h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          onClick={onManage}
        >
          <Plus size={14} /> Gérer les contacts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {responsibles && responsibles.length > 0 ? (
          responsibles.map((resp, idx) => (
            <div 
              key={resp.id || idx} 
              className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm group hover:border-indigo-300 transition-all flex flex-col relative"
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
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600" onClick={() => onHide(resp)}>
                        <EyeOff size={12} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-xs">Masquer pour ce projet</p></TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => onEdit(resp)}>
                    <Edit size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => onDelete(resp)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={12} className="text-slate-400" />
                  <span>{resp.tel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} className="text-slate-400" />
                  <span className="truncate">{resp.email}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-6 bg-white/50 rounded-xl border border-dashed border-indigo-200">
            <p className="text-xs text-slate-400 italic">Aucun responsable client répertorié pour ce projet.</p>
          </div>
        )}
      </div>
    </div>
  );
};