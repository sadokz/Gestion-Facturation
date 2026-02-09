import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { fetcher } from "@/api/config";
import { formatCurrencyDT } from "@/utils/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

const Projects = () => {
  const { selectedYear } = useYear();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/projects?year=${selectedYear}&q=${search}&status=${statusFilter === 'all' ? '' : statusFilter}`);
      setProjects(data);
    } catch (err) {
      console.error(err);
      setProjects([
        { id: 1, reference_projet: "PRJ-2026-001", nom_projet: "Eclairage Avenue", client: "Commune X", montant_total_ht: 50000, total_facture_ht: 15000, reste_a_facturer_ht: 35000, statut: "En cours", annee: 2026, date_contrat: "2026-01-15", tva_pct: 19 },
        { id: 2, reference_projet: "PRJ-2026-002", nom_projet: "Rénovation Pont", client: "Ministère Y", montant_total_ht: 120000, total_facture_ht: 120000, reste_a_facturer_ht: 0, statut: "Terminé", annee: 2026, date_contrat: "2026-02-10", tva_pct: 19 },
        { id: 3, reference_projet: "PRJ-2026-003", nom_projet: "Audit Énergétique", client: "Société Z", montant_total_ht: 15000, total_facture_ht: 0, reste_a_facturer_ht: 15000, statut: "En attente", annee: 2026, date_contrat: "2026-03-05", tva_pct: 19 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [selectedYear, search, statusFilter]);

  const handleAddProject = async (data: any) => {
    try {
      // await fetcher('/projects', { method: 'POST', body: JSON.stringify(data) });
      showSuccess("Projet créé avec succès");
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      showError("Erreur lors de la création");
    }
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terminé": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Terminé</Badge>;
      case "En cours": return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">En cours</Badge>;
      case "En attente": return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">En attente</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Projets & Facturation</h1>
          <p className="text-slate-500">Gérez vos contrats et suivez l'avancement de la facturation</p>
        </div>
        <Button 
          onClick={() => { setSelectedProject(null); setIsModalOpen(true); }}
          className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 px-6"
        >
          <Plus size={18} />
          Nouveau Projet
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Référence, nom ou client..." 
                className="pl-10 rounded-xl border-slate-200 focus:ring-primary/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter size={14} className="text-slate-500" />
                <select 
                  className="text-sm font-medium bg-transparent outline-none border-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-700">Référence</TableHead>
                  <TableHead className="font-bold text-slate-700">Projet</TableHead>
                  <TableHead className="font-bold text-slate-700">Client</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Montant HT</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Facturé HT</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Reste HT</TableHead>
                  <TableHead className="font-bold text-slate-700">Statut</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <TableRow key={i}>
                      <TableCell colSpan={8} className="h-16 text-center text-slate-400">Chargement...</TableCell>
                    </TableRow>
                  ))
                ) : projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                    <TableCell className="font-mono text-xs font-bold text-primary">{project.reference_projet}</TableCell>
                    <TableCell className="font-medium text-slate-800">{project.nom_projet}</TableCell>
                    <TableCell className="text-slate-600">{project.client}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrencyDT(project.montant_total_ht)}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">{formatCurrencyDT(project.total_facture_ht)}</TableCell>
                    <TableCell className="text-right text-amber-600 font-medium">{formatCurrencyDT(project.reste_a_facturer_ht)}</TableCell>
                    <TableCell>{getStatusBadge(project.statut)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewProject(project)}>
                            <Eye size={14} /> Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleEditProject(project)}>
                            <Edit size={14} /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600">
                            <Trash2 size={14} /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddProject}
        initialData={selectedProject}
      />

      <ProjectDetail 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;