import React, { useEffect, useState } from "react";
import { 
  HardHat, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Calendar,
  ArrowRight,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { fetcher } from "@/api/config";
import { useYear } from "@/context/YearContext";
import { useMyCompany } from "@/context/CompanyContext";
import { formatDateFR } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const TechnicalDashboard = () => {
  const { selectedYear } = useYear();
  const { selectedCompany } = useMyCompany();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetcher(`/projects?year=${selectedYear}&company_id=${selectedCompany?.id}`);
        setProjects(data);
      } catch (err) {
        // Mock data pour la démo
        setProjects([
          { id: 1, nom_projet: "Eclairage Avenue", client: "Commune de Tunis", responsable_interne: "Ing. Ahmed", etat_global: "Etude en Cours", statut_technique: "En cours", avancement: 65, derniere_maj: "2026-03-10" },
          { id: 2, nom_projet: "Rénovation Pont", client: "Commune de Tunis", responsable_interne: "Ing. Ahmed", etat_global: "Travaux en Cours", statut_technique: "Bloqué", avancement_travaux: 30, derniere_maj: "2026-03-12" },
          { id: 3, nom_projet: "Audit STEG", client: "STEG", responsable_interne: "Ing. Sarra", etat_global: "Etude en Cours", statut_technique: "En cours", avancement: 10, derniere_maj: "2026-03-01" },
          { id: 4, nom_projet: "Extension Usine", client: "Alpha SA", responsable_interne: "Ing. Ali", etat_global: "Travaux Achevés", statut_technique: "En cours", avancement_travaux: 100, derniere_maj: "2026-02-20" },
          { id: 5, nom_projet: "Nouveau Siège", client: "Banque Centrale", responsable_interne: "Ing. Sarra", etat_global: "Etude en Cours", statut_technique: "En cours", avancement: 0, derniere_maj: "2026-03-15" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear, selectedCompany]);

  const stats = {
    etudes: projects.filter(p => p.etat_global === "Etude en Cours").length,
    travaux: projects.filter(p => p.etat_global === "Travaux en Cours").length,
    termines: projects.filter(p => p.etat_global === "Travaux Achevés" || p.etat_global === "Réceptionné Définitivement").length,
    bloques: projects.filter(p => p.statut_technique === "Bloqué").length,
  };

  const filteredProjects = projects.filter(p => 
    p.nom_projet.toLowerCase().includes(search.toLowerCase()) || 
    p.responsable_interne.toLowerCase().includes(search.toLowerCase())
  );

  const ProjectCard = ({ project }: { project: any }) => (
    <Card 
      className="group hover:shadow-lg transition-all border-slate-100 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/project-tracking?search=${encodeURIComponent(project.nom_projet)}`)}
    >
      <div className={cn(
        "h-1.5 w-full",
        project.statut_technique === "Bloqué" ? "bg-rose-500" : 
        project.etat_global.includes("Travaux") ? "bg-amber-500" : "bg-blue-500"
      )} />
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{project.nom_projet}</h4>
            <p className="text-[10px] text-slate-500 uppercase font-bold">{project.client}</p>
          </div>
          <Badge variant="outline" className={cn(
            "text-[10px] font-bold",
            project.statut_technique === "Bloqué" ? "border-rose-200 text-rose-600 bg-rose-50" : "border-emerald-200 text-emerald-600 bg-emerald-50"
          )}>
            {project.statut_technique}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <UserCheck size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Responsable</span>
              <span className="text-xs font-bold text-slate-700">{project.responsable_interne}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Mise à jour</span>
              <span className="text-xs font-bold text-slate-700">{formatDateFR(project.derniere_maj)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {project.etat_global.includes("Travaux") ? "Avancement Travaux" : "Avancement Études"}
            </span>
            <span className="text-xs font-black text-slate-700">
              {project.etat_global.includes("Travaux") ? project.avancement_travaux : project.avancement}%
            </span>
          </div>
          <Progress 
            value={project.etat_global.includes("Travaux") ? project.avancement_travaux : project.avancement} 
            className="h-1.5" 
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Technique</h1>
          <p className="text-slate-500">Vue d'ensemble opérationnelle des projets - {selectedYear}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Rechercher un projet..." 
            className="pl-10 rounded-xl border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-blue-500 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase opacity-80">Études en cours</p>
              <h3 className="text-3xl font-black">{stats.etudes}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-amber-500 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <HardHat size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase opacity-80">Travaux en cours</p>
              <h3 className="text-3xl font-black">{stats.travaux}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-emerald-500 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase opacity-80">Projets Terminés</p>
              <h3 className="text-3xl font-black">{stats.termines}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-rose-500 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase opacity-80">Projets Bloqués</p>
              <h3 className="text-3xl font-black">{stats.bloques}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Sections */}
      <div className="space-y-10">
        {/* Section Bloqués (Priorité) */}
        {stats.bloques > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle size={20} />
              <h2 className="text-lg font-black uppercase tracking-wider">Points de Blocage</h2>
              <Badge className="bg-rose-100 text-rose-600 border-rose-200 ml-2">{stats.bloques}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.filter(p => p.statut_technique === "Bloqué").map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {/* Section Études */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Layers size={20} />
            <h2 className="text-lg font-black uppercase tracking-wider">Études en cours</h2>
            <Badge className="bg-blue-100 text-blue-600 border-blue-200 ml-2">{stats.etudes}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.filter(p => p.etat_global === "Etude en Cours" && p.statut_technique !== "Bloqué").map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        {/* Section Travaux */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600">
            <HardHat size={20} />
            <h2 className="text-lg font-black uppercase tracking-wider">Chantiers en cours</h2>
            <Badge className="bg-amber-100 text-amber-600 border-amber-200 ml-2">{stats.travaux}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.filter(p => p.etat_global === "Travaux en Cours" && p.statut_technique !== "Bloqué").map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDashboard;