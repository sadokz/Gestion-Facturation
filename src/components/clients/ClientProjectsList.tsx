import React from "react";
import { Briefcase, ExternalLink, FileText, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDateFR } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface ClientProjectsListProps {
  projects: any[];
}

export const ClientProjectsList: React.FC<ClientProjectsListProps> = ({ projects }) => {
  const navigate = useNavigate();

  const activeProjects = projects?.filter(p => (p.avancement || 0) < 100) || [];
  const completedProjects = projects?.filter(p => (p.avancement || 0) === 100) || [];

  const ProjectCard = ({ project }: { project: any }) => (
    <div 
      className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm group hover:border-indigo-300 transition-all cursor-pointer"
      onClick={() => navigate(`/projects?search=${encodeURIComponent(project.nom_projet)}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            (project.avancement || 0) === 100 ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
          )}>
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
      
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-slate-400" />
          <span>{project.date_contrat ? formatDateFR(project.date_contrat) : "Date non définie"}</span>
        </div>
        <span className={cn(
          "font-bold px-2 py-0.5 rounded-full",
          (project.avancement || 0) === 100 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
        )}>
          {project.avancement || 0}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-indigo-50/30 p-6 rounded-b-2xl border-t border-indigo-100/50 animate-in slide-in-from-top-2 duration-300 space-y-8">
      {/* Section En cours */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-indigo-400" />
          <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Projets En cours</h4>
          <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full">
            {activeProjects.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.length > 0 ? (
            activeProjects.map((p, idx) => <ProjectCard key={p.id || idx} project={p} />)
          ) : (
            <div className="col-span-full text-center py-6 bg-white/50 rounded-xl border border-dashed border-indigo-200">
              <p className="text-xs text-slate-400 italic">Aucun projet en cours.</p>
            </div>
          )}
        </div>
      </div>

      {/* Section Terminés */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">Projets Terminés</h4>
          <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full">
            {completedProjects.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedProjects.length > 0 ? (
            completedProjects.map((p, idx) => <ProjectCard key={p.id || idx} project={p} />)
          ) : (
            <div className="col-span-full text-center py-6 bg-white/50 rounded-xl border border-dashed border-emerald-200">
              <p className="text-xs text-slate-400 italic">Aucun projet terminé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};