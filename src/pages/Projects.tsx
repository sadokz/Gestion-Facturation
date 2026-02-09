import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { fetcher } from "@/api/config";
import { formatCurrencyDT, computeTTC } from "@/utils/formatters";
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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProjectInvoicesList } from "@/components/projects/ProjectInvoicesList";
import { SalesInvoiceModal } from "@/components/projects/SalesInvoiceModal";

const Projects = () => {
  const { selectedYear } = useYear();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/projects?year=${selectedYear}&q=${search}&status=${statusFilter === 'all' ? '' : statusFilter}`);
      setProjects(data);
    } catch (err) {
      // Mock data enrichie pour les calculs TTC et paiements
      setProjects([
        { 
          id: 1, 
          reference_projet: "PRJ-2026-001", 
          nom_projet: "Eclairage Avenue", 
          client: "Commune X", 
          montant_total_ht: 50000, 
          tva_pct: 19,
          statut: "En cours",
          invoices: [
            { id: 101, numero_facture: "FV-2026-001", date_facture: "2026-01-10", montant_ht: 5000, tva_pct: 19, statut: "Payé", type_facture: "Acompte" },
            { id: 102, numero_facture: "FV-2026-002", date_facture: "2026-02-15", montant_ht: 10000, tva_pct: 19, statut: "Payement En Attente", type_facture: "Situation n°1" },
          ]
        },
        { 
          id: 2, 
          reference_projet: "PRJ-2026-002", 
          nom_projet: "Rénovation Pont", 
          client: "Ministère Y", 
          montant_total_ht: 120000, 
          tva_pct: 19,
          statut: "Terminé",
          invoices: [
            { id: 201, numero_facture: "FV-2026-005", date_facture: "2026-03-01", montant_ht: 120000, tva_pct: 19, statut: "Payé", type_facture: "Unique" },
          ]
        },
        { 
          id: 3, 
          reference_projet: "PRJ-2026-003", 
          nom_projet: "Audit Énergétique", 
          client: "Société Z", 
          montant_total_ht: 15000, 
          tva_pct: 19,
          statut: "En attente",
          invoices: []
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [selectedYear, search, statusFilter]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedProjects(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terminé": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Terminé</Badge>;
      case "En cours": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">En cours</Badge>;
      case "En attente": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">En attente</Badge>;
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
          <Plus size={18} /> Nouveau Projet
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Référence, nom ou client..." 
                className="pl-10 rounded-xl border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
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
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="font-bold text-slate-700">Référence</TableHead>
                  <TableHead className="font-bold text-slate-700">Projet</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Montant Total HT</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Montant Total TTC</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Total Facturé HT</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Total Payé TTC</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Reste à Payé TTC</TableHead>
                  <TableHead className="font-bold text-slate-700">Statut</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="h-16 text-center">Chargement...</TableCell></TableRow>
                ) : projects.map((project) => {
                  const totalHT = project.montant_total_ht;
                  const totalTTC = computeTTC(totalHT, project.tva_pct || 19);
                  
                  const invoices = project.invoices || [];
                  const totalFactureHT = invoices.reduce((sum: number, inv: any) => sum + inv.montant_ht, 0);
                  const totalPayeTTC = invoices
                    .filter((inv: any) => inv.statut === "Payé")
                    .reduce((sum: number, inv: any) => sum + computeTTC(inv.montant_ht, inv.tva_pct || 19), 0);
                  
                  const resteAPayeTTC = totalTTC - totalPayeTTC;

                  return (
                    <React.Fragment key={project.id}>
                      <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => toggleExpand(project.id)}
                          >
                            {expandedProjects.has(project.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-mono text-[11px] font-bold text-primary">{project.reference_projet}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{project.nom_projet}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-medium">{project.client}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-600">{formatCurrencyDT(totalHT)}</TableCell>
                        <TableCell className="text-right font-bold text-slate-900">{formatCurrencyDT(totalTTC)}</TableCell>
                        <TableCell className="text-right text-blue-600 font-bold">{formatCurrencyDT(totalFactureHT)}</TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">{formatCurrencyDT(totalPayeTTC)}</TableCell>
                        <TableCell className="text-right text-rose-600 font-black">{formatCurrencyDT(resteAPayeTTC)}</TableCell>
                        <TableCell>{getStatusBadge(project.statut)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedProject(project); setIsDetailOpen(true); }}>
                                <Eye size={14} /> Analyse complète
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}>
                                <Edit size={14} /> Modifier Projet
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600"
                                onClick={() => { setSelectedProject(project); setIsConfirmOpen(true); }}
                              >
                                <Trash2 size={14} /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedProjects.has(project.id) && (
                        <TableRow className="hover:bg-transparent border-none">
                          <TableCell colSpan={10} className="p-0">
                            <ProjectInvoicesList 
                              invoices={invoices} 
                              onAddInvoice={() => { setSelectedProject(project); setSelectedInvoice(null); setIsInvoiceModalOpen(true); }}
                              onEditInvoice={(inv) => { setSelectedProject(project); setSelectedInvoice(inv); setIsInvoiceModalOpen(true); }}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
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
      />
    </div>
  );
};

export default Projects;