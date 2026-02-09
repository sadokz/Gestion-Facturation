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
import { Plus, FileText, Trash2, Edit, ShoppingCart, BarChart3, Receipt } from "lucide-react";
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
      // Mock data pour la démo multi-factures
      setInvoices([
        { id: 1, numero_facture: "FV-2026-001", date_facture: "2026-01-10", montant_ht: 5000, tva_pct: 19, statut: "Payée", note: "Acompte 10%" },
        { id: 2, numero_facture: "FV-2026-002", date_facture: "2026-02-15", montant_ht: 15000, tva_pct: 19, statut: "Payée", note: "Situation n°1" },
        { id: 3, numero_facture: "FV-2026-003", date_facture: "2026-03-20", montant_ht: 10000, tva_pct: 19, statut: "Émise", note: "Situation n°2" },
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
      showSuccess("Facture enregistrée");
      setIsInvoiceModalOpen(false);
      loadData();
    } catch (err) {
      showError("Erreur lors de l'enregistrement");
    }
  };

  if (!project) return null;

  // Calculs dynamiques basés sur la liste des factures
  const totalInvoicedHT = invoices.reduce((sum, inv) => sum + inv.montant_ht, 0);
  const totalPurchasesHT = purchases.reduce((sum, p) => sum + p.montant_ht, 0);
  const remainingToInvoiceHT = project.montant_total_ht - totalInvoicedHT;
  const marginHT = totalInvoicedHT - totalPurchasesHT;
  const progress = (totalInvoicedHT / project.montant_total_ht) * 100;

  const chartData = [
    { name: 'Budget Total', value: project.montant_total_ht, color: '#6366f1' },
    { name: 'Déjà Facturé', value: totalInvoicedHT, color: '#10b981' },
    { name: 'Dépenses', value: totalPurchasesHT, color: '#f43f5e' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[850px] overflow-y-auto border-l-0 shadow-2xl">
        <SheetHeader className="mb-8">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold bg-primary/5 w-fit px-3 py-1 rounded-full mb-2">
            <FileText size={12} /> {project.reference_projet}
          </div>
          <SheetTitle className="text-3xl font-black text-slate-900 tracking-tight">{project.nom_projet}</SheetTitle>
          <p className="text-slate-500 font-medium">Client : {project.client}</p>
        </SheetHeader>

        {/* Cartes de synthèse */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Contrat Global HT</p>
            <p className="text-xl font-black text-slate-900">{formatCurrencyDT(project.montant_total_ht)}</p>
          </div>
          <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100 shadow-sm">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Total Facturé HT</p>
            <p className="text-xl font-black text-emerald-700">{formatCurrencyDT(totalInvoicedHT)}</p>
          </div>
          <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-100 shadow-sm">
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">Reste à Facturer</p>
            <p className="text-xl font-black text-amber-700">{formatCurrencyDT(remainingToInvoiceHT)}</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-10 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Avancement de la facturation</h4>
              <p className="text-xs text-slate-500">{invoices.length} facture(s) émise(s)</p>
            </div>
            <span className="text-lg font-black text-primary">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full bg-slate-100" />
        </div>

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100/50 p-1.5 rounded-2xl">
            <TabsTrigger value="invoices" className="rounded-xl data-[state=active]:shadow-md">Ventes</TabsTrigger>
            <TabsTrigger value="purchases" className="rounded-xl data-[state=active]:shadow-md">Achats</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-xl data-[state=active]:shadow-md">Analyse</TabsTrigger>
            <TabsTrigger value="summary" className="rounded-xl data-[state=active]:shadow-md">Infos</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Receipt className="text-primary" size={20} />
                <h4 className="font-bold text-slate-800">Historique des factures</h4>
              </div>
              <Button 
                size="sm" 
                className="gap-2 rounded-xl shadow-lg shadow-primary/20" 
                onClick={() => { setSelectedInvoice(null); setIsInvoiceModalOpen(true); }}
              >
                <Plus size={16} /> Nouvelle Facture
              </Button>
            </div>
            
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-bold">N° Facture</TableHead>
                    <TableHead className="text-xs font-bold">Date</TableHead>
                    <TableHead className="text-xs font-bold">Libellé / Note</TableHead>
                    <TableHead className="text-xs font-bold text-right">Montant HT</TableHead>
                    <TableHead className="text-xs font-bold">Statut</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="group">
                      <TableCell className="font-mono text-xs font-bold text-primary">{inv.numero_facture}</TableCell>
                      <TableCell className="text-xs text-slate-600">{formatDateFR(inv.date_facture)}</TableCell>
                      <TableCell className="text-xs text-slate-500 italic">{inv.note || "-"}</TableCell>
                      <TableCell className="text-xs text-right font-bold text-slate-900">{formatCurrencyDT(inv.montant_ht)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold px-2 py-0",
                          inv.statut === "Payée" ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-500"
                        )}>
                          {inv.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setSelectedInvoice(inv); setIsInvoiceModalOpen(true); }}>
                            <Edit size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                        <Receipt size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Aucune facture émise pour le moment</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {invoices.length > 0 && (
                <div className="bg-slate-50/50 p-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total cumulé</span>
                  <span className="text-sm font-black text-primary">{formatCurrencyDT(totalInvoicedHT)}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="purchases">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-rose-500" size={20} />
                <h4 className="font-bold text-slate-800">Dépenses liées</h4>
              </div>
            </div>
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-bold">Fournisseur</TableHead>
                    <TableHead className="text-xs font-bold">N° Facture</TableHead>
                    <TableHead className="text-xs font-bold text-right">Montant HT</TableHead>
                    <TableHead className="text-xs font-bold">Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((pur) => (
                    <TableRow key={pur.id}>
                      <TableCell className="text-xs font-bold text-slate-800">{pur.fournisseur}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{pur.numero_facture}</TableCell>
                      <TableCell className="text-xs text-right font-bold text-slate-900">{formatCurrencyDT(pur.montant_ht)}</TableCell>
                      <TableCell><span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{pur.categorie}</span></TableCell>
                    </TableRow>
                  ))}
                  {purchases.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-400 text-sm">Aucun achat lié</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              {purchases.length > 0 && (
                <div className="bg-slate-50/50 p-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total dépenses</span>
                  <span className="text-sm font-black text-rose-600">{formatCurrencyDT(totalPurchasesHT)}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 size={24} />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Marge Brute HT</p>
                <p className={cn("text-3xl font-black", marginHT >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {formatCurrencyDT(marginHT)}
                </p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">(Facturé HT - Achats HT)</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                  <ShoppingCart size={24} />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Rentabilité</p>
                <p className="text-3xl font-black text-slate-900">
                  {totalInvoicedHT > 0 ? ((marginHT / totalInvoicedHT) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Sur le montant facturé</p>
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-8">Comparatif Financier (HT)</h4>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrencyDT(value)} 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Détails du contrat</h4>
              <dl className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="border-b border-slate-50 pb-4">
                  <dt className="text-slate-400 text-[10px] font-bold uppercase mb-1">Date de signature</dt>
                  <dd className="text-slate-900 font-bold">{formatDateFR(project.date_contrat)}</dd>
                </div>
                <div className="border-b border-slate-50 pb-4">
                  <dt className="text-slate-400 text-[10px] font-bold uppercase mb-1">Taux TVA</dt>
                  <dd className="text-slate-900 font-bold">{project.tva_pct}%</dd>
                </div>
                <div className="border-b border-slate-50 pb-4">
                  <dt className="text-slate-400 text-[10px] font-bold uppercase mb-1">Statut Projet</dt>
                  <dd className="text-slate-900 font-bold">{project.statut}</dd>
                </div>
                <div className="border-b border-slate-50 pb-4">
                  <dt className="text-slate-400 text-[10px] font-bold uppercase mb-1">Année d'exercice</dt>
                  <dd className="text-slate-900 font-bold">{project.annee}</dd>
                </div>
              </dl>
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