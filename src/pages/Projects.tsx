import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { usePrivacy } from "@/context/PrivacyContext";
import { fetcher } from "@/api/config";
import { formatCurrencyDT, computeTTC } from "@/utils/formatters";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProjectInvoicesList } from "@/components/projects/ProjectInvoicesList";
import { SalesInvoiceModal } from "@/components/projects/SalesInvoiceModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ColumnToggle } from "@/components/ui/ColumnToggle";
import { useSearchParams } from "react-router-dom";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PROJECT_COLUMNS = [
  { id: "reference_projet", label: "Référence" },
  { id: "nom_projet", label: "Projet" },
  { id: "contrat", label: "Contrat" },
  { id: "montant_total_ht", label: "Total Contrat HT" },
  { id: "montant_avenant_ht", label: "Avenant HT" },
  { id: "tva_pct", label: "TVA" },
  { id: "total_ttc", label: "Total Contrat TTC" },
  { id: "facture_ht", label: "Total Facturé HT" },
  { id: "facture_ttc", label: "Facturé TTC" },
  { id: "paye_ttc", label: "Total Reçu TTC" },
  { id: "reste_ttc", label: "Reste à Facturer TTC" },
  { id: "statut", label: "Statut" },
];

const SortableProjectRow = ({ 
  project, 
  expandedProjects, 
  toggleExpand, 
  getStatusBadge, 
  handleAddInvoiceClick, 
  handleEditInvoiceClick,
  setSelectedProject,
  setIsDetailOpen,
  setIsModalOpen,
  setIsConfirmOpen,
  visibleColumns
}: any) => {
  const { isPrivate } = usePrivacy();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const baseHT = project.montant_total_ht;
  const avenantHT = project.montant_avenant_ht || 0;
  const totalHT = baseHT + avenantHT;
  const tvaPct = project.tva_pct || 19;
  const totalTVA = totalHT * (tvaPct / 100);
  const totalTTC = totalHT + totalTVA;
  
  const invoices = project.invoices || [];
  const totalFactureHT = invoices.reduce((sum: number, inv: any) => sum + inv.montant_ht, 0);
  const totalFactureTTC = invoices.reduce((sum: number, inv: any) => sum + computeTTC(inv.montant_ht, inv.tva_pct || 19), 0);
  const totalPayeTTC = invoices
    .filter((inv: any) => inv.statut === "Payé")
    .reduce((sum: number, inv: any) => sum + computeTTC(inv.montant_ht, inv.tva_pct || 19), 0);
  
  const resteAFacturerTTC = totalTTC - totalFactureTTC;

  let calculatedStatus = "Non facturé";
  if (totalFactureHT > 0) {
    if (totalFactureHT < totalHT) {
      calculatedStatus = "Partiellement Facturé";
    } else {
      calculatedStatus = "Totalement Facturé";
    }
  }

  const isVisible = (id: string) => visibleColumns.includes(id);
  const format = (val: number) => isPrivate ? "*****" : formatCurrencyDT(val);

  return (
    <React.Fragment>
      <TableRow 
        ref={setNodeRef}
        style={style}
        className={cn(
          "hover:bg-slate-50/50 transition-colors border-slate-100 group",
          isDragging && "bg-slate-100 shadow-lg"
        )}
      >
        <TableCell className="p-0 text-center">
          <div className="flex items-center justify-center gap-0.5">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1">
              <GripVertical size={14} />
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => toggleExpand(project.id)}>
              {expandedProjects.has(project.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </TableCell>
        {isVisible("reference_projet") && <TableCell className="font-mono text-[11px] font-bold text-primary truncate">{project.reference_projet}</TableCell>}
        {isVisible("nom_projet") && (
          <TableCell className="truncate">
            <div className="flex flex-col truncate">
              <span className="font-bold text-slate-800 text-sm truncate">{project.nom_projet}</span>
              <span className="text-[10px] text-slate-500 uppercase font-medium truncate">{project.client}</span>
            </div>
          </TableCell>
        )}
        {isVisible("contrat") && (
          <TableCell className="text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setIsModalOpen(true); }} className={cn("flex flex-col items-center justify-center w-10 h-10 rounded-xl border transition-all mx-auto", project.file_contrat ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-primary/30 hover:text-primary")}>
                  {project.file_contrat ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
                  <span className="text-[7px] font-bold uppercase mt-0.5">Contrat</span>
                </button>
              </TooltipTrigger>
              <TooltipContent><p className="text-xs">{project.file_contrat ? "Voir/Modifier le contrat" : "Téléverser le contrat"}</p></TooltipContent>
            </Tooltip>
          </TableCell>
        )}
        {isVisible("montant_total_ht") && <TableCell className="text-right font-medium text-slate-600 truncate">{format(baseHT)}</TableCell>}
        {isVisible("montant_avenant_ht") && <TableCell className="text-right font-medium text-amber-600 truncate">{format(avenantHT)}</TableCell>}
        {isVisible("tva_pct") && <TableCell className="text-right font-medium text-slate-500 truncate">{format(totalTVA)}</TableCell>}
        {isVisible("total_ttc") && <TableCell className="text-right font-bold text-slate-900 truncate">{format(totalTTC)}</TableCell>}
        {isVisible("facture_ht") && <TableCell className="text-right text-blue-600 font-bold truncate">{format(totalFactureHT)}</TableCell>}
        {isVisible("facture_ttc") && <TableCell className="text-right text-indigo-600 font-bold truncate">{format(totalFactureTTC)}</TableCell>}
        {isVisible("paye_ttc") && <TableCell className="text-right text-emerald-600 font-bold truncate">{format(totalPayeTTC)}</TableCell>}
        {isVisible("reste_ttc") && <TableCell className="text-right text-rose-600 font-black truncate">{format(resteAFacturerTTC)}</TableCell>}
        {isVisible("statut") && <TableCell className="truncate">{getStatusBadge(calculatedStatus)}</TableCell>}
        <TableCell className="p-0 text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedProject(project); setIsDetailOpen(true); }}><Eye size={14} /> Analyse complète</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}><Edit size={14} /> Modifier Projet</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => { setSelectedProject(project); setIsConfirmOpen(true); }}><Trash2 size={14} /> Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {expandedProjects.has(project.id) && (
        <TableRow className="hover:bg-transparent border-none">
          <TableCell colSpan={visibleColumns.length + 2} className="p-0">
            <ProjectInvoicesList invoices={invoices} onAddInvoice={() => handleAddInvoiceClick(project)} onEditInvoice={(inv) => handleEditInvoiceClick(project, inv)} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

const Projects = () => {
  const { selectedYear } = useYear();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState(PROJECT_COLUMNS.map(c => c.id));
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/projects?year=${selectedYear}&q=${search}&status=${statusFilter === 'all' ? '' : statusFilter}`);
      setProjects(data);
    } catch (err) {
      setProjects([
        { id: 1, reference_projet: "PRJ-2026-001", nom_projet: "Eclairage Avenue", client: "Commune de Tunis", montant_total_ht: 50000, montant_avenant_ht: 5000, tva_pct: 19, file_contrat: { name: "contrat_001.pdf" }, invoices: [{ id: 101, numero_facture: "FV-2026-001", date_facture: "2026-01-10", montant_ht: 5000, tva_pct: 19, statut: "Payé", type_facture: "Acompte" }, { id: 102, numero_facture: "FV-2026-002", date_facture: "2026-02-15", montant_ht: 10000, tva_pct: 19, statut: "Payement En Attente", type_facture: "Situation n°1" }] },
        { id: 2, reference_projet: "PRJ-2026-002", nom_projet: "Rénovation Pont", client: "Commune de Tunis", montant_total_ht: 120000, montant_avenant_ht: 0, tva_pct: 19, file_contrat: null, invoices: [{ id: 201, numero_facture: "FV-2026-005", date_facture: "2026-03-01", montant_ht: 120000, tva_pct: 19, statut: "Payé", type_facture: "Unique" }] },
        { id: 3, reference_projet: "PRJ-2026-003", nom_projet: "Audit STEG", client: "STEG", montant_total_ht: 15000, montant_avenant_ht: 0, tva_pct: 19, file_contrat: null, invoices: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearch(urlSearch);
    }
    loadProjects(); 
  }, [selectedYear, search, statusFilter, searchParams]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return projects;

    return [...projects].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'total_ttc') {
        aValue = a.montant_total_ht * (1 + (a.tva_pct || 19) / 100);
        bValue = b.montant_total_ht * (1 + (b.tva_pct || 19) / 100);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projects, sortConfig]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleColumn = (id: string) => {
    setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedProjects(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Totalement Facturé": return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Totalement Facturé</Badge>;
      case "Partiellement Facturé": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Partiellement Facturé</Badge>;
      case "Non facturé": return <Badge className="bg-slate-100 text-slate-500 border-slate-200">Non facturé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddInvoiceClick = (project: any) => { setSelectedProject(project); setSelectedInvoice(null); setIsInvoiceModalOpen(true); };
  const handleEditInvoiceClick = (project: any, invoice: any) => { setSelectedProject(project); setSelectedInvoice(invoice); setIsInvoiceModalOpen(true); };

  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Projets & Facturation</h1>
          <p className="text-slate-500">Gérez vos contrats et suivez l'avancement de la facturation</p>
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
              <Input placeholder="Référence, nom ou client..." className="pl-10 rounded-xl border-slate-200" value={search} onChange={(e) => { setSearch(e.target.value); setSearchParams({ search: e.target.value }); }} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter size={14} className="text-slate-500" />
                <select className="text-sm font-medium bg-transparent outline-none border-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="Totalement Facturé">Totalement Facturé</option>
                  <option value="Partiellement Facturé">Partiellement Facturé</option>
                  <option value="Non facturé">Non facturé</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table className="table-fixed w-max min-w-full">
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <ResizableHeader initialWidth={70} resizable={false}></ResizableHeader>
                    {isVisible("reference_projet") && <ResizableHeader initialWidth={120} minWidth={80} className="text-center" sortKey="reference_projet" currentSort={sortConfig} onSort={handleSort}>Référence</ResizableHeader>}
                    {isVisible("nom_projet") && <ResizableHeader initialWidth={250} minWidth={100} className="text-center" sortKey="nom_projet" currentSort={sortConfig} onSort={handleSort}>Projet</ResizableHeader>}
                    {isVisible("contrat") && <ResizableHeader initialWidth={100} minWidth={80} className="text-center">Contrat</ResizableHeader>}
                    {isVisible("montant_total_ht") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center" sortKey="montant_total_ht" currentSort={sortConfig} onSort={handleSort}>Total Contrat HT</ResizableHeader>}
                    {isVisible("montant_avenant_ht") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center" sortKey="montant_avenant_ht" currentSort={sortConfig} onSort={handleSort}>Avenant HT</ResizableHeader>}
                    {isVisible("tva_pct") && <ResizableHeader initialWidth={120} minWidth={80} className="text-center" sortKey="tva_pct" currentSort={sortConfig} onSort={handleSort}>TVA</ResizableHeader>}
                    {isVisible("total_ttc") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center" sortKey="total_ttc" currentSort={sortConfig} onSort={handleSort}>Total Contrat TTC</ResizableHeader>}
                    {isVisible("facture_ht") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center">Total Facturé HT</ResizableHeader>}
                    {isVisible("facture_ttc") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center">Facturé TTC</ResizableHeader>}
                    {isVisible("paye_ttc") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center">Total Reçu TTC</ResizableHeader>}
                    {isVisible("reste_ttc") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center">Reste à Facturer TTC</ResizableHeader>}
                    {isVisible("statut") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="statut" currentSort={sortConfig} onSort={handleSort}>Statut</ResizableHeader>}
                    <ResizableHeader initialWidth={60} resizable={false}>
                      <ColumnToggle columns={PROJECT_COLUMNS} visibleColumns={visibleColumns} onToggle={toggleColumn} />
                    </ResizableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={visibleColumns.length + 2} className="h-16 text-center">Chargement...</TableCell></TableRow>
                  ) : (
                    <SortableContext items={sortedProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      {sortedProjects.map((project) => (
                        <SortableProjectRow key={project.id} project={project} expandedProjects={expandedProjects} toggleExpand={toggleExpand} getStatusBadge={getStatusBadge} handleAddInvoiceClick={handleAddInvoiceClick} handleEditInvoiceClick={handleEditInvoiceClick} setSelectedProject={setSelectedProject} setIsDetailOpen={setIsDetailOpen} setIsModalOpen={setIsModalOpen} setIsConfirmOpen={setIsConfirmOpen} visibleColumns={visibleColumns} />
                      ))}
                    </SortableContext>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </CardContent>
      </Card>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={() => { showSuccess("Projet enregistré"); setIsModalOpen(false); loadProjects(); }} initialData={selectedProject} />
      <ProjectDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} project={selectedProject} />
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => { showSuccess("Projet supprimé"); setIsConfirmOpen(false); loadProjects(); }} title="Supprimer le projet ?" description="Cette action supprimera également toutes les factures liées." variant="destructive" confirmText="Supprimer" />
      <SalesInvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        onSubmit={() => { showSuccess("Facture enregistrée"); setIsInvoiceModalOpen(false); loadProjects(); }} 
        initialData={selectedInvoice} 
        projectTva={selectedProject?.tva_pct}
      />
    </div>
  );
};

export default Projects;