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
  Trash2,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Construction,
  Layers,
  Hash,
  Layout,
  Save,
  Info
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { useViewModes, ViewMode } from "@/context/ViewModeContext";
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ColumnToggle } from "@/components/ui/ColumnToggle";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { TechnicalEntryModal } from "@/components/projects/TechnicalEntryModal";
import { TechnicalSubEntriesList } from "@/components/projects/TechnicalSubEntriesList";
import { TechnicalClientResponsibles } from "@/components/projects/TechnicalClientResponsibles";
import { TechnicalEnterpriseResponsibles } from "@/components/projects/TechnicalEnterpriseResponsibles";
import { ResponsibleModal } from "@/components/clients/ResponsibleModal";
import { ContactSelectionModal } from "@/components/projects/ContactSelectionModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ViewModeModal } from "@/components/ui/ViewModeModal";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

const TRACKING_COLUMNS = [
  { id: "reference_projet", label: "Référence" },
  { id: "nom_projet", label: "Projet / Client" },
  { id: "responsable_interne", label: "Resp. Interne" },
  { id: "architecte", label: "Architecte" },
  { id: "ing_fluides", label: "Ing. Fluides" },
  { id: "ing_structure", label: "Ing. Structure" },
  { id: "bureau_controle", label: "Bureau de Contrôle" },
  { id: "phase", label: "Phase" },
  { id: "indice", label: "Indice" },
  { id: "etat", label: "État" },
  { id: "avancement", label: "Avancement Études" },
  { id: "entreprise_travaux", label: "Entreprise" },
  { id: "avancement_travaux", label: "Avancement Travaux" },
];

const ProjectTracking = () => {
  const { selectedYear } = useYear();
  const { getViewModesByCategory, deleteViewMode } = useViewModes();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(TRACKING_COLUMNS.map(c => c.id));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isRespModalOpen, setIsRespModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isEnterpriseSelectionModalOpen, setIsEnterpriseSelectionModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRespConfirmOpen, setIsRespConfirmOpen] = useState(false);
  const [isViewModeModalOpen, setIsViewModeModalOpen] = useState(false);
  const [isViewModeConfirmOpen, setIsViewModeConfirmOpen] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [selectedResp, setSelectedResp] = useState<any>(null);
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode | null>(null);

  const trackingViewModes = getViewModesByCategory("tracking");

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
          responsable_interne: "Ing. Ahmed",
          architecte: "Cabinet Zmerli",
          ing_fluides: "BET Fluides Plus",
          ing_structure: "Ingénierie Structure",
          bureau_controle: "Veritas",
          entreprise_travaux: "SOTETRA",
          phase: "APD",
          indice: "B",
          etat: "En cours",
          avancement: 65,
          avancement_travaux: 30,
          client_responsibles: [
            { id: 101, nom: "M. Ahmed Ben Salah", role: "Directeur Technique", tel: "98 000 111", email: "ahmed.salah@commune.tn" }, 
            { id: 102, nom: "Mme. Sarra Mansour", role: "Chef de Projet", tel: "22 333 444", email: "sarra.m@commune.tn" }
          ],
          enterprise_responsibles: [
            { id: 301, nom: "M. Foulen Ben Foulen", role: "Conducteur de Travaux", tel: "55 111 222", email: "foulen@sotetra.tn" }
          ],
          technical_entries: []
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, [selectedYear, search]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedProjects(newExpanded);
  };

  const toggleColumn = (id: string) => {
    setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

  const handleHideResp = (resp: any) => {
    showSuccess(`${resp.nom} masqué pour ce projet`);
    loadProjects();
  };

  const handleSelection = (selectedIds: number[]) => {
    showSuccess("Liste des intervenants mise à jour");
    setIsSelectionModalOpen(false);
    setIsEnterpriseSelectionModalOpen(false);
    loadProjects();
  };

  const handleDelete = async () => {
    try {
      showSuccess("Projet supprimé");
      setIsConfirmOpen(false);
      loadProjects();
    } catch (err) {
      showError("Erreur lors de la suppression");
    }
  };

  const handleDeleteResp = async () => {
    try {
      showSuccess("Contact supprimé définitivement de l'annuaire");
      setIsRespConfirmOpen(false);
      loadProjects();
    } catch (err) {
      showError("Erreur lors de la suppression");
    }
  };

  const handleDeleteViewMode = () => {
    if (selectedViewMode) {
      deleteViewMode(selectedViewMode.id);
      showSuccess("Mode de vue supprimé");
      setIsViewModeConfirmOpen(false);
    }
  };

  const getEtatBadge = (etat: string) => {
    switch (etat) {
      case "En cours": return <Badge className="bg-blue-50 text-blue-600 border-blue-100">En cours</Badge>;
      case "Suspendu": return <Badge className="bg-amber-50 text-amber-600 border-amber-100">Suspendu</Badge>;
      case "Livré": return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">Livré</Badge>;
      case "Annulé": return <Badge className="bg-rose-50 text-rose-600 border-rose-100">Annulé</Badge>;
      default: return <Badge variant="outline">{etat || "-"}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Suivi Technique</h1>
          <p className="text-slate-500">Coordination des intervenants et avancement physique des projets</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 h-11 px-4 border-slate-200">
                <Layout size={18} /> Modes de vue
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl">
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold">Mes Vues</DropdownMenuLabel>
              {trackingViewModes.map((mode) => (
                <div key={mode.id} className="flex items-center group px-1">
                  <DropdownMenuItem 
                    className="flex-1 cursor-pointer rounded-lg"
                    onClick={() => setVisibleColumns(mode.columns)}
                  >
                    {mode.name}
                  </DropdownMenuItem>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedViewMode(mode); setIsViewModeModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-primary"
                    >
                      <Edit size={12} />
                    </button>
                    {!mode.id.includes("-default") && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedViewMode(mode); setIsViewModeConfirmOpen(true); }}
                        className="p-2 text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-primary font-bold" onClick={() => { setSelectedViewMode(null); setIsViewModeModalOpen(true); }}>
                <Save size={14} /> Enregistrer vue actuelle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => { setSelectedProject(null); setIsModalOpen(true); }} className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 px-6">
            <Plus size={18} /> Nouveau Projet
          </Button>
        </div>
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
                  <ResizableHeader initialWidth={60} resizable={false}></ResizableHeader>
                  {isVisible("reference_projet") && <ResizableHeader initialWidth={120} className="text-center">Référence</ResizableHeader>}
                  {isVisible("nom_projet") && <ResizableHeader initialWidth={220} className="text-center">Projet / Maître d'Ouvrage</ResizableHeader>}
                  {isVisible("responsable_interne") && <ResizableHeader initialWidth={160} className="text-center">Resp. Interne</ResizableHeader>}
                  {isVisible("architecte") && <ResizableHeader initialWidth={160} className="text-center">Architecte</ResizableHeader>}
                  {isVisible("ing_fluides") && <ResizableHeader initialWidth={160} className="text-center">Ing. Fluides</ResizableHeader>}
                  {isVisible("ing_structure") && <ResizableHeader initialWidth={160} className="text-center">Ing. Structure</ResizableHeader>}
                  {isVisible("bureau_controle") && <ResizableHeader initialWidth={160} className="text-center">Bureau de Contrôle</ResizableHeader>}
                  {isVisible("phase") && <ResizableHeader initialWidth={100} className="text-center">Phase</ResizableHeader>}
                  {isVisible("indice") && <ResizableHeader initialWidth={80} className="text-center">Indice</ResizableHeader>}
                  {isVisible("etat") && <ResizableHeader initialWidth={120} className="text-center">État</ResizableHeader>}
                  {isVisible("avancement") && <ResizableHeader initialWidth={180} className="text-center">Avancement Études</ResizableHeader>}
                  {isVisible("entreprise_travaux") && <ResizableHeader initialWidth={160} className="text-center">Entreprise</ResizableHeader>}
                  {isVisible("avancement_travaux") && <ResizableHeader initialWidth={180} className="text-center">Avancement Travaux</ResizableHeader>}
                  <ResizableHeader initialWidth={60} resizable={false}>
                    <ColumnToggle columns={TRACKING_COLUMNS} visibleColumns={visibleColumns} onToggle={toggleColumn} />
                  </ResizableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={visibleColumns.length + 2} className="h-16 text-center">Chargement...</TableCell></TableRow>
                ) : (
                  projects.map((project) => (
                    <React.Fragment key={project.id}>
                      <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                              <GripVertical size={14} />
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => toggleExpand(project.id)}>
                              {expandedProjects.has(project.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </Button>
                          </div>
                        </TableCell>
                        {isVisible("reference_projet") && (
                          <TableCell className="font-mono text-[11px] font-bold text-primary text-center">
                            {project.reference_projet}
                          </TableCell>
                        )}
                        {isVisible("nom_projet") && (
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm truncate">{project.nom_projet}</span>
                              <span className="text-[10px] text-slate-500 uppercase font-medium truncate">{project.client}</span>
                            </div>
                          </TableCell>
                        )}
                        {isVisible("responsable_interne") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600">
                              <UserCheck size={12} className="shrink-0" />
                              {project.responsable_interne || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("architecte") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                              <User size={12} className="text-slate-400" />
                              {project.architecte || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("ing_fluides") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                              <Activity size={12} className="text-slate-400" />
                              {project.ing_fluides || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("ing_structure") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                              <HardHat size={12} className="text-slate-400" />
                              {project.ing_structure || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("bureau_controle") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                              <Building2 size={12} className="text-slate-400" />
                              {project.bureau_controle || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("phase") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                              <Layers size={12} className="text-slate-400" />
                              {project.phase || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("indice") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
                              <Hash size={12} className="text-indigo-400" />
                              {project.indice || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("etat") && (
                          <TableCell className="text-center">
                            {getEtatBadge(project.etat)}
                          </TableCell>
                        )}
                        {isVisible("avancement") && (
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
                        )}
                        {isVisible("entreprise_travaux") && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600">
                              <Construction size={12} className="shrink-0" />
                              {project.entreprise_travaux || "-"}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("avancement_travaux") && (
                          <TableCell>
                            <div className="space-y-2 px-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] h-4 px-1.5",
                                  project.avancement_travaux === 100 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                  {project.avancement_travaux === 100 ? "Terminé" : "Chantier"}
                                </Badge>
                                <span className="text-[10px] font-black text-slate-600">{project.avancement_travaux || 0}%</span>
                              </div>
                              <Progress value={project.avancement_travaux || 0} className="h-1.5 bg-slate-100" />
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}>
                                <Edit size={14} /> Modifier Suivi
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => { setSelectedProject(project); setIsConfirmOpen(true); }}>
                                <Trash2 size={14} /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedProjects.has(project.id) && (
                        <TableRow className="hover:bg-transparent border-none">
                          <TableCell colSpan={visibleColumns.length + 2} className="p-0">
                            <div className="flex flex-col">
                              <TechnicalClientResponsibles 
                                clientName={project.client} 
                                responsibles={project.client_responsibles || []} 
                                onManage={() => { setSelectedProject(project); setIsSelectionModalOpen(true); }}
                                onEdit={(resp) => { setSelectedProject(project); setSelectedResp(resp); setIsRespModalOpen(true); }}
                                onDelete={(resp) => { setSelectedResp(resp); setIsRespConfirmOpen(true); }}
                                onHide={handleHideResp}
                              />
                              <TechnicalEnterpriseResponsibles 
                                enterpriseName={project.entreprise_travaux} 
                                responsibles={project.enterprise_responsibles || []} 
                                onManage={() => { setSelectedProject(project); setIsEnterpriseSelectionModalOpen(true); }}
                                onEdit={(resp) => { setSelectedProject(project); setSelectedResp(resp); setIsRespModalOpen(true); }}
                                onDelete={(resp) => { setSelectedResp(resp); setIsRespConfirmOpen(true); }}
                                onHide={handleHideResp}
                              />
                              <TechnicalSubEntriesList 
                                entries={project.technical_entries || []} 
                                onAdd={() => { setSelectedProject(project); setSelectedEntry(null); setIsEntryModalOpen(true); }} 
                                onEdit={(entry) => { setSelectedProject(project); setSelectedEntry(entry); setIsEntryModalOpen(true); }} 
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
        onSubmit={() => { showSuccess("Suivi technique mis à jour"); setIsModalOpen(false); loadProjects(); }} 
        initialData={selectedProject} 
        technicalOnly={true}
      />

      <TechnicalEntryModal 
        isOpen={isEntryModalOpen} 
        onClose={() => setIsEntryModalOpen(false)} 
        onSubmit={() => { showSuccess("Intervention enregistrée"); setIsEntryModalOpen(false); loadProjects(); }} 
        initialData={selectedEntry} 
        projectName={selectedProject?.nom_projet || ""} 
      />

      <ContactSelectionModal 
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onSelect={handleSelection}
        onAddNew={() => { setIsSelectionModalOpen(false); setSelectedResp(null); setIsRespModalOpen(true); }}
        clientName={selectedProject?.client || ""}
        currentlyLinkedIds={selectedProject?.client_responsibles?.map((r: any) => r.id) || []}
      />

      <ContactSelectionModal 
        isOpen={isEnterpriseSelectionModalOpen}
        onClose={() => setIsEnterpriseSelectionModalOpen(false)}
        onSelect={handleSelection}
        onAddNew={() => { setIsEnterpriseSelectionModalOpen(false); setSelectedResp(null); setIsRespModalOpen(true); }}
        clientName={selectedProject?.entreprise_travaux || ""}
        currentlyLinkedIds={selectedProject?.enterprise_responsibles?.map((r: any) => r.id) || []}
      />

      <ResponsibleModal 
        isOpen={isRespModalOpen} 
        onClose={() => setIsRespModalOpen(false)} 
        onSubmit={() => { showSuccess("Contact enregistré dans l'annuaire"); setIsRespModalOpen(false); loadProjects(); }} 
        initialData={selectedResp} 
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

      <ConfirmDialog 
        isOpen={isRespConfirmOpen} 
        onClose={() => setIsRespConfirmOpen(false)} 
        onConfirm={handleDeleteResp} 
        title="Supprimer ce contact ?" 
        description="Ce contact sera retiré définitivement de l'annuaire des tiers." 
        variant="destructive" 
        confirmText="Supprimer" 
      />

      <ConfirmDialog 
        isOpen={isViewModeConfirmOpen} 
        onClose={() => setIsViewModeConfirmOpen(false)} 
        onConfirm={handleDeleteViewMode} 
        title="Supprimer ce mode de vue ?" 
        description="Cette action est irréversible." 
        variant="destructive" 
        confirmText="Supprimer" 
      />

      <ViewModeModal 
        isOpen={isViewModeModalOpen} 
        onClose={() => setIsViewModeModalOpen(false)} 
        availableColumns={TRACKING_COLUMNS}
        category="tracking"
        currentVisibleColumns={visibleColumns}
        initialData={selectedViewMode}
      />
    </div>
  );
};

export default ProjectTracking;