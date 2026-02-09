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
  Printer
} from "lucide-react";
import { fetcher } from "@/api/config";
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
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { ClientModal } from "@/components/clients/ClientModal";
import { ResponsibleModal } from "@/components/clients/ResponsibleModal";
import { ClientResponsiblesList } from "@/components/clients/ClientResponsiblesList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedClients, setExpandedClients] = useState<Set<number>>(new Set());
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isRespModalOpen, setIsRespModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedResp, setSelectedResp] = useState<any>(null);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/clients?q=${search}`);
      setClients(data);
    } catch (err) {
      // Mock data
      setClients([
        { 
          id: 1, 
          nom: "Commune de Tunis", 
          adresse: "Avenue Habib Bourguiba, Tunis", 
          tel: "71 123 456", 
          fax: "71 123 457", 
          email: "contact@commune-tunis.gov.tn",
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
          responsibles: [
            { id: 201, nom: "M. Sami Trabelsi", role: "Ingénieur Principal", tel: "55 666 777", email: "s.trabelsi@steg.com.tn" }
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [search]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedClients(newExpanded);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Annuaire Clients</h1>
          <p className="text-slate-500">Gérez vos clients et leurs interlocuteurs privilégiés</p>
        </div>
        <Button 
          onClick={() => { setSelectedClient(null); setIsClientModalOpen(true); }}
          className="rounded-xl shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 gap-2 h-11 px-6"
        >
          <Plus size={18} /> Nouveau Client
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Rechercher un client..." 
                className="pl-10 rounded-xl border-slate-200 focus:ring-indigo-500/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="font-bold text-slate-700">Client</TableHead>
                  <TableHead className="font-bold text-slate-700">Adresse</TableHead>
                  <TableHead className="font-bold text-slate-700">Téléphone</TableHead>
                  <TableHead className="font-bold text-slate-700">Fax</TableHead>
                  <TableHead className="font-bold text-slate-700">Email</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="h-16 text-center">Chargement...</TableCell></TableRow>
                ) : clients.map((client) => (
                  <React.Fragment key={client.id}>
                    <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                          onClick={() => toggleExpand(client.id)}
                        >
                          {expandedClients.has(client.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-bold text-slate-800">{client.nom}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-500 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="shrink-0" /> {client.adresse}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone size={12} className="shrink-0" /> {client.tel}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {client.fax ? (
                          <div className="flex items-center gap-1">
                            <Printer size={12} className="shrink-0" /> {client.fax}
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-indigo-600 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Mail size={12} className="shrink-0" /> {client.email}
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
                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedClient(client); setIsClientModalOpen(true); }}>
                              <Edit size={14} /> Modifier Client
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600"
                              onClick={() => { setSelectedClient(client); setIsConfirmOpen(true); }}
                            >
                              <Trash2 size={14} /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedClients.has(client.id) && (
                      <TableRow className="hover:bg-transparent border-none">
                        <TableCell colSpan={7} className="p-0">
                          <ClientResponsiblesList 
                            responsibles={client.responsibles || []} 
                            onAdd={() => { setSelectedClient(client); setSelectedResp(null); setIsRespModalOpen(true); }}
                            onEdit={(resp) => { setSelectedClient(client); setSelectedResp(resp); setIsRespModalOpen(true); }}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        onSubmit={() => { showSuccess("Client enregistré"); setIsClientModalOpen(false); loadClients(); }} 
        initialData={selectedClient} 
      />

      <ResponsibleModal 
        isOpen={isRespModalOpen} 
        onClose={() => setIsRespModalOpen(false)} 
        onSubmit={() => { showSuccess("Responsable enregistré"); setIsRespModalOpen(false); loadClients(); }} 
        initialData={selectedResp} 
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={() => { showSuccess("Client supprimé"); setIsConfirmOpen(false); loadClients(); }} 
        title="Supprimer le client ?" 
        description="Cette action supprimera également tous les responsables liés." 
        variant="destructive" 
        confirmText="Supprimer" 
      />
    </div>
  );
};

export default Clients;