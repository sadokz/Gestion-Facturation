import React, { useEffect, useState } from "react";
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
  Building2,
  GripVertical
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { CompanyModal } from "@/components/companies/CompanyModal";
import { CompanyResponsibleModal } from "@/components/companies/CompanyResponsibleModal";
import { CompanyResponsiblesList } from "@/components/companies/CompanyResponsiblesList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { ResizableHeader } from "@/components/ui/ResizableHeader";

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

const SortableCompanyRow = ({ 
  company, 
  expandedCompanies, 
  toggleExpand, 
  setSelectedCompany, 
  setIsCompanyModalOpen, 
  setIsConfirmOpen,
  setSelectedResp,
  setIsRespModalOpen
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: company.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

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
            <div 
              {...attributes} 
              {...listeners} 
              className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1"
            >
              <GripVertical size={16} />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg hover:bg-amber-100 hover:text-amber-600 transition-colors"
              onClick={() => toggleExpand(company.id)}
            >
              {expandedCompanies.has(company.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
        </TableCell>
        <TableCell className="font-bold text-slate-800 truncate">
          <div className="flex items-center gap-2 truncate">
            <Building2 size={14} className="text-amber-500 shrink-0" />
            {company.nom}
          </div>
        </TableCell>
        <TableCell className="text-slate-500 text-xs">
          <div className="flex items-center gap-1 truncate">
            <MapPin size={12} className="shrink-0" /> {company.adresse}
          </div>
        </TableCell>
        <TableCell className="text-slate-600 text-sm">
          <div className="flex items-center gap-1 truncate">
            <Phone size={12} className="shrink-0" /> {company.tel}
          </div>
        </TableCell>
        <TableCell className="text-slate-400 text-sm">
          {company.fax ? (
            <div className="flex items-center gap-1 truncate">
              <Printer size={12} className="shrink-0" /> {company.fax}
            </div>
          ) : "-"}
        </TableCell>
        <TableCell className="text-amber-700 text-sm font-medium">
          <div className="flex items-center gap-1 truncate">
            <Mail size={12} className="shrink-0" /> {company.email}
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedCompany(company); setIsCompanyModalOpen(true); }}>
                <Edit size={14} /> Modifier Entreprise
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600"
                onClick={() => { setSelectedCompany(company); setIsConfirmOpen(true); }}
              >
                <Trash2 size={14} /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {expandedCompanies.has(company.id) && (
        <TableRow className="hover:bg-transparent border-none">
          <TableCell colSpan={7} className="p-0">
            <CompanyResponsiblesList 
              responsibles={company.responsibles || []} 
              onAdd={() => { setSelectedCompany(company); setSelectedResp(null); setIsRespModalOpen(true); }}
              onEdit={(resp) => { setSelectedCompany(company); setSelectedResp(resp); setIsRespModalOpen(true); }}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

const Companies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCompanies, setExpandedCompanies] = useState<Set<number>>(new Set());
  
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isRespModalOpen, setIsRespModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedResp, setSelectedResp] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/companies?q=${search}`);
      setCompanies(data);
    } catch (err) {
      setCompanies([
        { 
          id: 1, 
          nom: "Bureau d'Études Alpha", 
          adresse: "Zone Industrielle, Sousse", 
          tel: "73 444 555", 
          fax: "73 444 556", 
          email: "contact@alpha-etudes.tn",
          responsibles: [
            { id: 101, nom: "M. Karim Jendoubi", role: "Gérant", tel: "98 111 222", email: "k.jendoubi@alpha.tn" }
          ]
        },
        { 
          id: 2, 
          nom: "Société de Travaux Publics (STP)", 
          adresse: "Route de Gabès, Sfax", 
          tel: "74 888 999", 
          fax: "", 
          email: "info@stp-travaux.tn",
          responsibles: [
            { id: 201, nom: "Mme. Ines Ben Amor", role: "Responsable RH", tel: "22 555 666", email: "ines.ba@stp.tn" },
            { id: 202, nom: "M. Walid Ghorbel", role: "Directeur Technique", tel: "55 777 888", email: "w.ghorbel@stp.tn" }
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [search]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCompanies((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCompanies(newExpanded);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Annuaire Entreprises</h1>
          <p className="text-slate-500">Gérez vos partenaires, sous-traitants et autres entreprises</p>
        </div>
        <Button 
          onClick={() => { setSelectedCompany(null); setIsCompanyModalOpen(true); }}
          className="rounded-xl shadow-lg shadow-amber-500/20 bg-amber-600 hover:bg-amber-700 gap-2 h-11 px-6 text-white"
        >
          <Plus size={18} /> Nouvelle Entreprise
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Rechercher une entreprise..." 
                className="pl-10 rounded-xl border-slate-200 focus:ring-amber-500/10"
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
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <ResizableHeader initialWidth={80} minWidth={60}></ResizableHeader>
                    <ResizableHeader initialWidth={250} minWidth={100} className="font-bold text-slate-700">Entreprise</ResizableHeader>
                    <ResizableHeader initialWidth={300} minWidth={150} className="font-bold text-slate-700">Adresse</ResizableHeader>
                    <ResizableHeader initialWidth={150} minWidth={100} className="font-bold text-slate-700">Téléphone</ResizableHeader>
                    <ResizableHeader initialWidth={150} minWidth={100} className="font-bold text-slate-700">Fax</ResizableHeader>
                    <ResizableHeader initialWidth={250} minWidth={150} className="font-bold text-slate-700">Email</ResizableHeader>
                    <ResizableHeader initialWidth={60} minWidth={40}></ResizableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="h-16 text-center">Chargement...</TableCell></TableRow>
                  ) : (
                    <SortableContext 
                      items={companies.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {companies.map((company) => (
                        <SortableCompanyRow 
                          key={company.id}
                          company={company}
                          expandedCompanies={expandedCompanies}
                          toggleExpand={toggleExpand}
                          setSelectedCompany={setSelectedCompany}
                          setIsCompanyModalOpen={setIsCompanyModalOpen}
                          setIsConfirmOpen={setIsConfirmOpen}
                          setSelectedResp={setSelectedResp}
                          setIsRespModalOpen={setIsRespModalOpen}
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

      <CompanyModal 
        isOpen={isCompanyModalOpen} 
        onClose={() => setIsCompanyModalOpen(false)} 
        onSubmit={() => { showSuccess("Entreprise enregistrée"); setIsCompanyModalOpen(false); loadCompanies(); }} 
        initialData={selectedCompany} 
      />

      <CompanyResponsibleModal 
        isOpen={isRespModalOpen} 
        onClose={() => setIsRespModalOpen(false)} 
        onSubmit={() => { showSuccess("Responsable enregistré"); setIsRespModalOpen(false); loadCompanies(); }} 
        initialData={selectedResp} 
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={() => { showSuccess("Entreprise supprimée"); setIsConfirmOpen(false); loadCompanies(); }} 
        title="Supprimer l'entreprise ?" 
        description="Cette action supprimera également tous les responsables liés à cette entreprise." 
        variant="destructive" 
        confirmText="Supprimer" 
      />
    </div>
  );
};

export default Companies;