import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Download,
  GripVertical,
  Layout,
  Save
} from "lucide-react";
import { useYear } from "@/context/YearContext";
import { useMyCompany } from "@/context/CompanyContext";
import { useViewModes, ViewMode } from "@/context/ViewModeContext";
import { fetcher } from "@/api/config";
import { formatCurrencyDT, formatDateFR, computeTTC } from "@/utils/formatters";
import { exportToCSV } from "@/utils/export";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseModal } from "@/components/purchases/PurchaseModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ViewModeModal } from "@/components/ui/ViewModeModal";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ColumnToggle } from "@/components/ui/ColumnToggle";

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

const PURCHASE_COLUMNS = [
  { id: "fournisseur", label: "Fournisseur" },
  { id: "numero_facture", label: "N° Facture" },
  { id: "date_facture", label: "Date Facture" },
  { id: "date_payement", label: "Date Paiement" },
  { id: "categorie", label: "Catégorie" },
  { id: "montant_ht", label: "Montant HT" },
  { id: "ttc", label: "TTC" },
  { id: "statut", label: "Statut" },
];

const SortablePurchaseRow = ({ 
  purchase, 
  setSelectedPurchase, 
  setIsModalOpen, 
  setIsConfirmOpen,
  visibleColumns
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

  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <TableRow 
      ref={setNodeRef}
      style={style}
      className={cn(
        "hover:bg-slate-50/50 transition-colors border-slate-100 group",
        isDragging && "bg-slate-100 shadow-lg"
      )}
    >
      <TableCell className="w-[40px] p-0 text-center">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1">
          <GripVertical size={14} />
        </div>
      </TableCell>
      {isVisible("fournisseur") && <TableCell className="font-bold text-slate-800 truncate">{purchase.fournisseur}</TableCell>}
      {isVisible("numero_facture") && <TableCell className="font-mono text-xs text-slate-500 truncate">{purchase.numero_facture}</TableCell>}
      {isVisible("date_facture") && <TableCell className="text-slate-600 truncate">{formatDateFR(purchase.date_facture)}</TableCell>}
      {isVisible("date_payement") && <TableCell className="text-slate-600 font-medium truncate">{formatDateFR(purchase.date_payement)}</TableCell>}
      {isVisible("categorie") && (
        <TableCell>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-lg truncate">
            {purchase.categorie}
          </span>
        </TableCell>
      )}
      {isVisible("montant_ht") && <TableCell className="text-right font-medium truncate">{formatCurrencyDT(purchase.montant_ht)}</TableCell>}
      {isVisible("ttc") && (
        <TableCell className="text-right font-bold text-slate-900 truncate">
          {formatCurrencyDT(computeTTC(purchase.montant_ht, purchase.tva_pct))}
        </TableCell>
      )}
      {isVisible("statut") && (
        <TableCell>
          <Badge className={cn("truncate", purchase.statut === "Payée" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200")}>
            {purchase.statut}
          </Badge>
        </TableCell>
      )}
      <TableCell className="w-[50px] p-0 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedPurchase(purchase); setIsModalOpen(true); }}><Edit size={14} /> Modifier</DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => { setSelectedPurchase(purchase); setIsConfirmOpen(true); }}><Trash2 size={14} /> Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const Purchases = () => {
  const { selectedYear } = useYear();
  const { selectedCompany } = useMyCompany();
  const { getViewModesByCategory, deleteViewMode } = useViewModes();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(PURCHASE_COLUMNS.map(c => c.id));
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isViewModeModalOpen, setIsViewModeModalOpen] = useState(false);
  const [isViewModeConfirmOpen, setIsViewModeConfirmOpen] = useState(false);
  
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode | null>(null);

  const purchaseViewModes = getViewModesByCategory("purchases");

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const loadPurchases = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
      const data = await fetcher(`/purchases?year=${selectedYear}&company_id=${selectedCompany.id}&q=${search}`);
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

  useEffect(() => { loadPurchases(); }, [selectedYear, selectedCompany, search]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedPurchases = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return purchases;

    return [...purchases].sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';

      if (sortConfig.key === 'ttc') {
        aValue = a.montant_ht * (1 + (a.tva_pct || 19) / 100);
        bValue = b.montant_ht * (1 + (b.tva_pct || 19) / 100);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [purchases, sortConfig]);

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

  const toggleColumn = (id: string) => {
    setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleExport = () => { exportToCSV(purchases, `achats_${selectedYear}`); showSuccess("Exportation CSV lancée"); };
  const handleDelete = async () => { try { showSuccess("Achat supprimé"); setIsConfirmOpen(false); loadPurchases(); } catch (err) { showError("Erreur lors de la suppression"); } };

  const isVisible = (id: string) => visibleColumns.includes(id);

  const handleDeleteViewMode = () => {
    if (selectedViewMode) {
      deleteViewMode(selectedViewMode.id);
      showSuccess("Mode de vue supprimé");
      setIsViewModeConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Achats & Dépenses</h1>
          <p className="text-slate-500">Suivez vos coûts pour {selectedCompany?.nom}</p>
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
              {purchaseViewModes.map((mode) => (
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
          <Button variant="outline" className="rounded-xl gap-2 h-11 px-4 border-slate-200" onClick={handleExport}><Download size={18} /> Export</Button>
          <Button onClick={() => { setSelectedPurchase(null); setIsModalOpen(true); }} className="rounded-xl shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 gap-2 h-11 px-6"><Plus size={18} /> Nouvel Achat</Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Fournisseur ou N° facture..." className="pl-10 rounded-xl border-slate-200 focus:ring-rose-500/10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <ResizableHeader initialWidth={40} resizable={false}></ResizableHeader>
                    {isVisible("fournisseur") && <ResizableHeader initialWidth={200} minWidth={100} className="text-center" sortKey="fournisseur" currentSort={sortConfig} onSort={handleSort}>Fournisseur</ResizableHeader>}
                    {isVisible("numero_facture") && <ResizableHeader initialWidth={150} minWidth={80} className="text-center" sortKey="numero_facture" currentSort={sortConfig} onSort={handleSort}>N° Facture</ResizableHeader>}
                    {isVisible("date_facture") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="date_facture" currentSort={sortConfig} onSort={handleSort}>Date Facture</ResizableHeader>}
                    {isVisible("date_payement") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="date_payement" currentSort={sortConfig} onSort={handleSort}>Date Paiement</ResizableHeader>}
                    {isVisible("categorie") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="categorie" currentSort={sortConfig} onSort={handleSort}>Catégorie</ResizableHeader>}
                    {isVisible("montant_ht") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="montant_ht" currentSort={sortConfig} onSort={handleSort}>Montant HT</ResizableHeader>}
                    {isVisible("ttc") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="ttc" currentSort={sortConfig} onSort={handleSort}>TTC</ResizableHeader>}
                    {isVisible("statut") && <ResizableHeader initialWidth={150} minWidth={100} className="text-center" sortKey="statut" currentSort={sortConfig} onSort={handleSort}>Statut</ResizableHeader>}
                    <ResizableHeader initialWidth={50} resizable={false}>
                      <ColumnToggle columns={PURCHASE_COLUMNS} visibleColumns={visibleColumns} onToggle={toggleColumn} />
                    </ResizableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={visibleColumns.length + 2} className="h-16 text-center">Chargement...</TableCell></TableRow>
                  ) : (
                    <SortableContext items={sortedPurchases.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      {sortedPurchases.map((purchase) => (
                        <SortablePurchaseRow key={purchase.id} purchase={purchase} setSelectedPurchase={setSelectedPurchase} setIsModalOpen={setIsModalOpen} setIsConfirmOpen={setIsConfirmOpen} visibleColumns={visibleColumns} />
                      ))}
                    </SortableContext>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </CardContent>
      </Card>

      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={() => { showSuccess("Action simulée"); setIsModalOpen(false); }} initialData={selectedPurchase} />
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Supprimer cet achat ?" description="Cette action est irréversible. La dépense sera retirée de vos statistiques." variant="destructive" confirmText="Supprimer" />
      <ConfirmDialog isOpen={isViewModeConfirmOpen} onClose={() => setIsViewModeConfirmOpen(false)} onConfirm={handleDeleteViewMode} title="Supprimer ce mode de vue ?" description="Cette action est irréversible." variant="destructive" confirmText="Supprimer" />
      
      <ViewModeModal 
        isOpen={isViewModeModalOpen} 
        onClose={() => setIsViewModeModalOpen(false)} 
        availableColumns={PURCHASE_COLUMNS}
        category="purchases"
        currentVisibleColumns={visibleColumns}
        initialData={selectedViewMode}
      />
    </div>
  );
};

export default Purchases;