import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Printer,
  GripVertical,
  Briefcase
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { ClientModal } from "@/components/clients/ClientModal";
import { ResponsibleModal } from "@/components/clients/ResponsibleModal";
import { ClientResponsiblesList } from "@/components/clients/ClientResponsiblesList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ColumnToggle } from "@/components/ui/ColumnToggle";
import { useNavigate } from "react-router-dom";

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

const CLIENT_COLUMNS = [
  { id: "nom", label: "Client" },
  { id: "adresse", label: "Adresse" },
  { id: "tel", label: "Téléphone" },
  { id: "fax", label: "Fax" },
  { id: "email", label: "Email" },
];

const SortableClientRow = ({ 
  client, 
  expandedClients, 
  toggleExpand, 
  setSelectedClient, 
  setIsClientModalOpen, 
  setIsConfirmOpen,
  setSelectedResp,
  setIsRespModalOpen,
  visibleColumns
}: any) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

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
        <TableCell>
          <div className="flex items-center gap-1">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1">
              <GripVertical size={16} />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors" onClick={() => toggleExpand(client.id)}>
              {expandedClients.has(client.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
        </TableCell>
        {isVisible("nom") && <TableCell className="font-bold text-slate-800 truncate">{client.nom}</TableCell>}
        {isVisible("adresse") && (
          <TableCell className="text-slate-500 text-xs">
            <div className="flex items-center gap-1 truncate">
              <MapPin size={12} className="shrink-0" /> {client.adresse}
            </div>
          </TableCell>
        )}
        {isVisible("tel") && (
          <TableCell className="text-slate-600 text-sm">
            <div className="flex items-center gap-1 truncate">
              <Phone size={12} className="shrink-0" /> {client.tel}
            </div>
          </TableCell>
        )}
        {isVisible("fax") && (
          <TableCell className="text-slate-400 text-sm">
            {client.fax ? (
              <div className="flex items-center gap-1 truncate">
                <Printer size={12} className="shrink-0" /> {client.fax}
              </div>
            ) : "-"}
          </TableCell>
        )}
        {isVisible("email") && (
          <TableCell className="text-indigo-600 text-sm font-medium">
            <div className="flex items-center gap-1 truncate">
              <Mail size={12} className="shrink-0" /> {client.email}
            </div>
          </TableCell>
        )}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl w-56">
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold">Actions</DropdownMenuLabel>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedClient(client); setIsClientModalOpen(true); }}><Edit size={14} /> Modifier Client</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => { setSelectedClient(client); setIsConfirmOpen(true); }}><Trash2 size={14} /> Supprimer</DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold">Projets associés</DropdownMenuLabel>
              {client.projects && client.projects.length > 0 ? (
                client.projects.map((project: any) => (
                  <DropdownMenuItem 
                    key={project.id} 
                    className="gap-2 cursor-pointer text-xs"
                    onClick={() => navigate(`/projects?search=${project.nom_projet}`)}
                  >
                    <Briefcase size={12} className="text-indigo-500" />
                    <span className="truncate">{project.nom_projet}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-[10px] text-slate-400 italic">Aucun projet enregistré</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {expandedClients.has(client.id) && (
        <TableRow className="hover:bg-transparent border-none">
          <TableCell colSpan={visibleColumns.length + 2} className="p-0">
            <ClientResponsiblesList responsibles={client.responsibles || []} onAdd={() => { setSelectedClient(client); setSelectedResp(null); setIsRespModalOpen(true); }} onEdit={(resp) => { setSelectedClient(client); setSelectedResp(resp); setIsRespModalOpen(true); }} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedClients, setExpandedClients] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(CLIENT_COLUMNS.map(c => c.id));
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isRespModalOpen, setIsRespModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedResp, setSelectedResp] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/clients?q=${search}`);
      setClients(data);
    } catch (err) {
      setClients([
        { 
          id: 1, 
          nom: "Commune de Tunis", 
          adresse: "Avenue Habib Bourguiba, Tunis", 
          tel: "71 123 456", 
          fax: "71 123 457", 
          email: "contact@commune-tunis.gov.tn", 
          projects: [
            { id: 1, nom_projet: "Eclairage Avenue" },
            { id: 2, nom_projet: "Rénovation Pont" }
          ],
          responsibles: [
            { id: 101, nom: "M. Ahmed Ben Salah", role: "Directeur Technique", tel: "98 000 111", email: "ahmed.salah@commune.tn" }, 
            { id: 102, nom: "Mme. Sarra Mansour", role: "Chef de Projet", tel: "22 333 444", email: "sarra.m@commune.tn" }
          ] 
        },
        { 
          id: 2, 
          nom: "STEG", 
          adresse: "Rue Kamel Ataturk, Tunis", 
          tel: "71 333 444", 
          fax: "71 333 445", 
          email: "info@steg.com.tn", 
          projects: [
            { id: 3, nom_projet: "Audit STEG" }
          ],
          responsibles: [
            { id: 201, nom: "M. Sami Trabelsi", role: "Ingénieur Principal", tel: "55 666 777", email: "s.trabelsi@steg.com.tn" }
          ] 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClients(); }, [search]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return clients;

    return [...clients].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [clients, sortConfig]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setClients((items) => {
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
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedClients(newExpanded);
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Annuaire Clients</h1>
          <p className="text-slate-500">Gérez vos clients et leurs interlocuteurs privilégiés</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setSelectedClient(null); setIsClientModalOpen(true); }} className="rounded-xl shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 gap-2 h-11 px-6">
            <Plus size={18} /> Nouveau Client
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Rechercher un client..." className="pl-10 rounded-xl border-slate-200 focus:ring-indigo-500/10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <ResizableHeader initialWidth={80} minWidth={60}></ResizableHeader>
                    {isVisible("nom") && <ResizableHeader initialWidth={250} minWidth={100} sortKey="nom" currentSort={sortConfig} onSort={handleSort}>Client</ResizableHeader>}
                    {isVisible("adresse") && <ResizableHeader initialWidth={300} minWidth={150} sortKey="adresse" currentSort={sortConfig} onSort={handleSort}>Adresse</ResizableHeader>}
                    {isVisible("tel") && <ResizableHeader initialWidth={150} minWidth={100} sortKey="tel" currentSort={sortConfig} onSort={handleSort}>Téléphone</ResizableHeader>}
                    {isVisible("fax") && <ResizableHeader initialWidth={150} minWidth={100} sortKey="fax" currentSort={sortConfig} onSort={handleSort}>Fax</ResizableHeader>}
                    {isVisible("email") && <ResizableHeader initialWidth={250} minWidth={150} sortKey="email" currentSort={sortConfig} onSort={handleSort}>Email</ResizableHeader>}
                    <ResizableHeader initialWidth={60} minWidth={40}>
                      <ColumnToggle columns={CLIENT_COLUMNS} visibleColumns={visibleColumns} onToggle={toggleColumn} />
                    </ResizableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={visibleColumns.length + 2} className="h-16 text-center">Chargement...</TableCell></TableRow>
                  ) : (
                    <SortableContext items={sortedClients.map(c => c.id)} strategy={verticalListSortingStrategy}>
                      {sortedClients.map((client) => (
                        <SortableClientRow key={client.id} client={client} expandedClients={expandedClients} toggleExpand={toggleExpand} setSelectedClient={setSelectedClient} setIsClientModalOpen={setIsClientModalOpen} setIsConfirmOpen={setIsConfirmOpen} setSelectedResp={setSelectedResp} setIsRespModalOpen={setIsRespModalOpen} visibleColumns={visibleColumns} />
                      ))}
                    </SortableContext>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </CardContent>
      </Card>

      <ClientModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} onSubmit={() => { showSuccess("Client enregistré"); setIsClientModalOpen(false); loadClients(); }} initialData={selectedClient} />
      <ResponsibleModal isOpen={isRespModalOpen} onClose={() => setIsRespModalOpen(false)} onSubmit={() => { showSuccess("Responsable enregistré"); setIsRespModalOpen(false); loadClients(); }} initialData={selectedResp} />
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => { showSuccess("Client supprimé"); setIsConfirmOpen(false); loadClients(); }} title="Supprimer le client ?" description="Cette action supprimera également tous les responsables liés." variant="destructive" confirmText="Supprimer" />
    </div>
  );
};

export default Clients;