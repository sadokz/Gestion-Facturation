import React from "react";
import { Briefcase, ExternalLink, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDateFR } from "@/utils/formatters";

interface ClientProjectsListProps {
  projects: any[];
}

export const ClientProjectsList: React.FC<ClientProjectsListProps> = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-indigo-50/30 p-6 rounded-b-2xl border-t border-indigo-100/50 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-400" />
          <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Projets Réalisés</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project, idx) => (
            <div 
              key={project.id || idx} 
              className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm group hover:border-indigo-300 transition-all cursor-pointer"
              onClick={() => navigate(`/projects?search=${encodeURIComponent(project.nom_projet)}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FileText size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{project.nom_projet}</p>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase flex items-center gap-1">
                      {project.reference_projet || "PROJET"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={12} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Calendar size={12} className="text-slate-400" />
                <span>{project.date_contrat ? `Signé le ${formatDateFR(project.date_contrat)}` : "Date non définie"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white/50 rounded-xl border border-dashed border-indigo-200">
            <p className="text-sm text-slate-400">Aucun projet enregistré pour ce client.</p>
          </div>
        )}
      </div>
    </div>
  );
};