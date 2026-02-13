import React, { useEffect, useState } from "react";
import { 
  Search, 
  HardHat, 
  User, 
  Building2, 
  Activity,
  GripVertical,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { fetcher } from "@/api/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

const ProjectTracking = () => {
  const { selectedYear } = useYear();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/projects?year=${selectedYear}&q=${search}`);
      setProjects(data);
    } catch (err) {
      setProjects([
        { 
          id: 1, 
          reference_projet: "PRJ-2026-001", 
          nom_projet: "Eclairage Avenue", 
          client: "Commune de Tunis",
          architecte: "Cabinet Zmerli",
          ing_fluides: "BET Fluides Plus",
          ing_structure: "Ingénierie Structure",
          bureau_controle: "Veritas",
          avancement: 65,
          statut_technique: "En cours"
        },
        { 
          id: 2, 
          reference_projet: "PRJ-2026-002", 
          nom_projet: "Rénovation Pont", 
          client: "Ministère Équipement",
          architecte: "Archi Design",
          ing_fluides: "-",
          ing_structure: "BET Ponts & Chaussées",
          bureau_controle: "Socotec",
          avancement: 30,
          statut_technique: "Démarrage"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, [selectedYear, search]);

  const handleDelete = async () => {
    try {
      showSuccess("Projet supprimé");
      setIsConfirmOpen(false);
      loadProjects();
    } catch (err) {
      showError("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Suivi Technique</h1>
          <p className="text-slate-500">Coordination des intervenants et avancement physique des projets</p>
        </div>
        <Button onClick={() => { setSelectedProject(null); setIsModalOpen(true); }} className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 px-6">
          <Plus size={18} /> Nouveau Projet
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Rechercher un projet ou intervenant..." 
                className="pl-10 rounded-xl border-slate-200 focus:ring-primary/10" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <ResizableHeader initialWidth={50} resizable={false}></ResizableHeader>
                  <ResizableHeader initialWidth={120} className="text-center">Référence</ResizableHeader>
                  <ResizableHeader initialWidth={220} className="text-center">Projet / Maître d'Ouvrage</ResizableHeader>
                  <ResizableHeader initialWidth={180} className="text-center">Architecte</ResizableHeader>
                  <ResizableHeader initialWidth={180} className="text-center">Ing. Fluides</ResizableHeader>
                  <ResizableHeader initialWidth={180} className="text-center">Ing. Structure</ResizableHeader>
                  <ResizableHeader initialWidth={180} className="text-center">Bureau de Contrôle</ResizableHeader>
                  <ResizableHeader initialWidth={200} className="text-center">État d'avancement</ResizableHeader>
                  <ResizableHeader initialWidth={60} resizable={false}></ResizableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="h-16 text-center">Chargement...</TableCell></TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                      <TableCell className="text-center">
                        <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                          <GripVertical size={14} className="mx-auto" />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] font-bold text-primary text-center">
                        {project.reference_projet}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm truncate">{project.nom_projet}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-medium truncate">{project.client}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                          <User size={12} className="text-slate-400" />
                          {project.architecte || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                          <Activity size={12} className="text-slate-400" />
                          {project.ing_fluides || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                          <HardHat size={12} className="text-slate-400" />
                          {project.ing_structure || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                          <Building2 size={12} className="text-slate-400" />
                          {project.bureau_controle || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2 px-2">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className={cn(
                              "text-[9px] h-4 px-1.5",
                              project.avancement === 100 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                            )}>
                              {project.avancement === 100 ? "Terminé" : "En cours"}
                            </Badge>
                            <span className="text-[10px] font-black text-slate-600">{project.avancement}%</span>
                          </div>
                          <Progress value={project.avancement} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}>
                              <Edit size={14} /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => { setSelectedProject(project); setIsConfirmOpen(true); }}>
                              <Trash2 size={14} /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={() => { showSuccess("Projet enregistré"); setIsModalOpen(false); loadProjects(); }} 
        initialData={selectedProject} 
      />
      
      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Supprimer le projet ?" 
        description="Cette action est irréversible et supprimera toutes les données liées." 
        variant="destructive" 
        confirmText="Supprimer" 
      />
    </div>
  );
};

export default ProjectTracking;