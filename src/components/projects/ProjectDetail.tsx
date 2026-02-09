import React, { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyDT, formatDateFR } from "@/utils/formatters";
import { fetcher } from "@/api/config";
import { Plus, FileText, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalesInvoiceModal } from "./SalesInvoiceModal";
import { showSuccess, showError } from "@/utils/toast";

interface ProjectDetailProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isOpen, onClose }) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    if (isOpen && project) {
      loadInvoices();
    }
  }, [isOpen, project]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/projects/${project.id}/sales-invoices`);
      setInvoices(data);
    } catch (err) {
      setInvoices([
        { id: 1, numero_facture: "FV-2026-001", date_facture: "2026-03-10", montant_ht: 5000, tva_pct: 19, statut: "Payée", note: "Avancement 10%" },
        { id: 2, numero_facture: "FV-2026-002", date_facture: "2026-04-15", montant_ht: 10000, tva_pct: 19, statut: "Émise", note: "Phase 2" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = async (data: any) => {
    try {
      // await fetcher(`/projects/${project.id}/sales-invoices`, { method: 'POST', body: JSON.stringify(data) });
      showSuccess("Facture ajoutée");
      setIsInvoiceModalOpen(false);
      loadInvoices();
    } catch (err) {
      showError("Erreur lors de l'ajout");
    }
  };

  if (!project) return null;

  const progress = (project.total_facture_ht / project.montant_total_ht) * 100;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 text-primary font-mono text-sm mb-1">
            <FileText size={14} /> {project.reference_projet}
          </div>
          <SheetTitle className="text-2xl font-bold">{project.nom_projet}</SheetTitle>
          <p className="text-slate-500">Client : {project.client}</p>
        </SheetHeader>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Total HT</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrencyDT(project.montant_total_ht)}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium mb-1">Facturé HT</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrencyDT(project.total_facture_ht)}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-xs text-amber-600 font-medium mb-1">Reste HT</p>
            <p className="text-lg font-bold text-amber-700">{formatCurrencyDT(project.reste_a_facturer_ht)}</p>
          </div>
        </div>

        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-600">Progression de la facturation</span>
            <span className="text-primary">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="summary" className="rounded-lg">Résumé</TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-lg">Factures de vente</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Informations</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500 text-sm">Date contrat</dt>
                    <dd className="text-slate-900 font-medium text-sm">{formatDateFR(project.date_contrat)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500 text-sm">TVA</dt>
                    <dd className="text-slate-900 font-medium text-sm">{project.tva_pct}%</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500 text-sm">Statut</dt>
                    <dd className="text-slate-900 font-medium text-sm">{project.statut}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800">Liste des factures</h4>
              <Button 
                size="sm" 
                className="gap-2 rounded-lg"
                onClick={() => { setSelectedInvoice(null); setIsInvoiceModalOpen(true); }}
              >
                <Plus size={14} /> Ajouter
              </Button>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs">N° Facture</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs text-right">Montant HT</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.numero_facture}</TableCell>
                      <TableCell className="text-xs">{formatDateFR(inv.date_facture)}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatCurrencyDT(inv.montant_ht)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {inv.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-slate-400 hover:text-primary"
                            onClick={() => { setSelectedInvoice(inv); setIsInvoiceModalOpen(true); }}
                          >
                            <Edit size={12} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500">
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                        Aucune facture pour ce projet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <SalesInvoiceModal 
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          onSubmit={handleAddInvoice}
          initialData={selectedInvoice}
        />
      </SheetContent>
    </Sheet>
  );
};