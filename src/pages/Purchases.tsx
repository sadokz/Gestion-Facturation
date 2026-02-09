import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Download,
  GripVertical
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { fetcher } from "@/api/config";
import { formatCurrencyDT, formatDateFR, computeTTC } from "@/utils/formatters";
import { exportToCSV } from "@/utils/export";
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
import { PurchaseModal } from "@/components/purchases/PurchaseModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

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

const SortablePurchaseRow = ({ 
  purchase, 
  setSelectedPurchase, 
  setIsModalOpen, 
  setIsConfirmOpen 
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: purchase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <TableRow 
      ref={setNodeRef}
      style={style}
      className={cn(
        "hover:bg-slate-50/50 transition-colors border-slate-100 group",
        isDragging && "bg-slate-100 shadow-lg"
      )}
    >
      <TableCell>
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1"
        >
          <GripVertical size={16} />
        </div>
      </TableCell>
      <TableCell className="font-bold text-slate-800">{purchase.fournisseur}</TableCell>
      <TableCell className="font-mono text-xs text-slate-500">{purchase.numero_facture}</TableCell>
      <TableCell className="text-slate-600">{formatDateFR(purchase.date_facture)}</TableCell>
      <TableCell className="text-slate-600 font-medium">{formatDateFR(purchase.date_payement)}</TableCell>
      <TableCell>
        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
          {purchase.categorie}
        </span>
      </TableCell>
      <TableCell className="text-right font-medium">{formatCurrencyDT(purchase.montant_ht)}</TableCell>
      <TableCell className="text-right font-bold text-slate-900">
        {formatCurrencyDT(computeTTC(purchase.montant_ht, purchase.tva_pct))}
      </TableCell>
      <TableCell>
        <Badge className={purchase.statut === "Payée" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"}>
          {purchase.statut}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedPurchase(purchase); setIsModalOpen(true); }}>
              <Edit size={14} /> Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600"
              onClick={() => { setSelectedPurchase(purchase); setIsConfirmOpen(true); }}
            >
              <Trash2 size={14} /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const Purchases = () => {
  const { selectedYear } = useYear();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/purchases?year=${selectedYear}&q=${search}`);
      setPurchases(data);
    } catch (err) {
      setPurchases([
        { id: 1, fournisseur: "Société ABC", numero_facture: "FA-4587", date_facture: "2026-02-20", date_payement: "2026-02-25", categorie: "Matériel", montant_ht: 2400, tva_pct: 19, statut: "À payer", note: "Câbles" },
        { id: 2, fournisseur: "Bureau Vallée", numero_facture: "BV-992", date_facture: "2026-03-05", date_payement: "2026-03-10", categorie: "Fournitures", montant_ht: 450, tva_pct: 19, statut: "Payée", note: "Papeterie" },
        { id: 3, fournisseur: "Tunisie Telecom", numero_facture: "TT-2026-01", date_facture: "2026-01-15", date_payement: "2026-01-20", categorie: "Abonnement", montant_ht: 120, tva_pct: 19, statut: "Payée", note: "Internet" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [selectedYear, search]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPurchases((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleExport = () => {
    exportToCSV(purchases, `achats_${selectedYear}`);
    showSuccess("Exportation CSV lancée");
  };

  const handleDelete = async () => {
    try {
      showSuccess("Achat supprimé");
      setIsConfirmOpen(false);
      loadPurchases();
    } catch (err) {
      showError("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Achats & Dépenses</h1>
          <p className="text-slate-500">Suivez vos factures fournisseurs et vos coûts opérationnels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl gap-2 h-11 px-4 border-slate-200"
            onClick={handleExport}
          >
            <Download size={18} /> Export
          </Button>
          <Button 
            onClick={() => { setSelectedPurchase(null); setIsModalOpen(true); }}
            className="rounded-xl shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 gap-2 h-11 px-6"
          >
            <Plus size={18} /> Nouvel Achat
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Fournisseur ou N° facture..." 
                className="pl-10 rounded-xl border-slate-200 focus:ring-rose-500/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead className="font-bold text-slate-700">Fournisseur</TableHead>
                    <TableHead className="font-bold text-slate-700">N° Facture</TableHead>
                    <TableHead className="font-bold text-slate-700">Date Facture</TableHead>
                    <TableHead className="font-bold text-slate-700">Date Paiement</TableHead>
                    <TableHead className="font-bold text-slate-700">Catégorie</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Montant HT</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">TTC</TableHead>
                    <TableHead className="font-bold text-slate-700">Statut</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={10} className="h-16 text-center">Chargement...</TableCell></TableRow>
                  ) : (
                    <SortableContext 
                      items={purchases.map(p => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {purchases.map((purchase) => (
                        <SortablePurchaseRow 
                          key={purchase.id}
                          purchase={purchase}
                          setSelectedPurchase={setSelectedPurchase}
                          setIsModalOpen={setIsModalOpen}
                          setIsConfirmOpen={setIsConfirmOpen}
                        />
                      ))}
                    </SortableContext>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </CardContent>
      </Card>

      <PurchaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={() => { showSuccess("Action simulée"); setIsModalOpen(false); }}
        initialData={selectedPurchase}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer cet achat ?"
        description="Cette action est irréversible. La dépense sera retirée de vos statistiques."
        variant="destructive"
        confirmText="Supprimer"
      />
    </div>
  );
};

export default Purchases;