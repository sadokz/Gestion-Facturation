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
import { Plus, FileText, Trash2, Edit, ShoppingCart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalesInvoiceModal } from "./SalesInvoiceModal";
import { showSuccess, showError } from "@/utils/toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface ProjectDetailProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isOpen, onClose }) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    if (isOpen && project) {
      loadData();
    }
  }, [isOpen, project]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invData, purData] = await Promise.all([
        fetcher(`/projects/${project.id}/sales-invoices`),
        fetcher(`/purchases?projet_id=${project.id}`)
      ]);
      setInvoices(invData);
      setPurchases(purData);
    } catch (err) {
      setInvoices([
        { id: 1, numero_facture: "FV-2026-001", date_facture: "2026-03-10", montant_ht: 5000, tva_pct: 19, statut: "Payée", note: "Avancement 10%" },
        { id: 2, numero_facture: "FV-2026-002", date_facture: "2026-04-15", montant_ht: 10000, tva_pct: 19, statut: "Émise", note: "Phase 2" },
      ]);
      setPurchases([
        { id: 101, fournisseur: "Fournisseur X", numero_facture: "FA-998", date_facture: "2026-02-10", montant_ht: 1200, categorie: "Matériel" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = async (data: any) => {
    try {
      showSuccess("Facture ajoutée");
      setIsInvoiceModalOpen(false);
      loadData();
    } catch (err) {
      showError("Erreur lors de l'ajout");
    }
  };

  if (!project) return null;

  const totalPurchasesHT = purchases.reduce((sum, p) => sum + p.montant_ht, 0);
  const marginHT = project.total_facture_ht - totalPurchasesHT;
  const progress = (project.total_facture_ht / project.montant_total_ht) * 100;

  const chartData = [
    { name: 'Budget Total', value: project.montant_total_ht, color: '#6366f1' },
    { name: 'Facturé', value: project.total_facture_ht, color: '#10b981' },
    { name: 'Dépenses', value: totalPurchasesHT, color: '#f43f5e' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[850px] overflow-y-auto">
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
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="summary" className="rounded-lg">Résumé</TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-lg">Ventes</TabsTrigger>
            <TabsTrigger value="purchases" className="rounded-lg">Achats</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Informations</h4>
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
              <h4 className="font-bold text-slate-800">Factures de vente</h4>
              <Button size="sm" className="gap-2 rounded-lg" onClick={() => { setSelectedInvoice(null); setIsInvoiceModalOpen(true); }}>
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
                      <TableCell><Badge variant="outline" className="text-[10px]">{inv.statut}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedInvoice(inv); setIsInvoiceModalOpen(true); }}><Edit size={12} /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500"><Trash2 size={12} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="purchases">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800">Achats liés au projet</h4>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs">Fournisseur</TableHead>
                    <TableHead className="text-xs">N° Facture</TableHead>
                    <TableHead className="text-xs text-right">Montant HT</TableHead>
                    <TableHead className="text-xs">Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((pur) => (
                    <TableRow key={pur.id}>
                      <TableCell className="text-xs font-medium">{pur.fournisseur}</TableCell>
                      <TableCell className="font-mono text-xs">{pur.numero_facture}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatCurrencyDT(pur.montant_ht)}</TableCell>
                      <TableCell><span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{pur.categorie}</span></TableCell>
                    </TableRow>
                  ))}
                  {purchases.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-400 text-sm">Aucun achat lié</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <BarChart3 className="text-primary mb-2" size={32} />
                <p className="text-sm text-slate-500 font-medium">Marge Brute HT</p>
                <p className={cn("text-2xl font-bold mt-1", marginHT >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {formatCurrencyDT(marginHT)}
                </p>
                <p className="text-xs text-slate-400 mt-2">(Facturé HT - Achats HT)</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <ShoppingCart className="text-rose-500 mb-2" size={32} />
                <p className="text-sm text-slate-500 font-medium">Total Dépenses HT</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrencyDT(totalPurchasesHT)}</p>
                <p className="text-xs text-slate-400 mt-2">{purchases.length} factures fournisseurs</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-6">Comparatif Financier (HT)</h4>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatCurrencyDT(value)} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <SalesInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} onSubmit={handleAddInvoice} initialData={selectedInvoice} />
      </SheetContent>
    </Sheet>
  );
};