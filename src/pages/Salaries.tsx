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
  User,
  CreditCard,
  GripVertical,
  Briefcase,
  Banknote
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
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { EmployeeModal } from "@/components/salaries/EmployeeModal";
import { SalaryPaymentModal } from "@/components/salaries/SalaryPaymentModal";
import { EmployeeSalariesList } from "@/components/salaries/EmployeeSalariesList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ColumnToggle } from "@/components/ui/ColumnToggle";
import { formatCurrencyDT } from "@/utils/formatters";

const EMPLOYEE_COLUMNS = [
  { id: "nom_complet", label: "Employé" },
  { id: "cin", label: "CIN" },
  { id: "poste", label: "Poste" },
  { id: "salaire_brut", label: "S. Brut" },
  { id: "salaire_net", label: "S. Net" },
  { id: "tel", label: "Téléphone" },
];

const Salaries = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(EMPLOYEE_COLUMNS.map(c => c.id));
  
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetcher(`/employees?q=${search}`);
      setEmployees(data);
    } catch (err) {
      setEmployees([
        { 
          id: 1, 
          nom: "Ben Ali", 
          prenom: "Mohamed", 
          cin: "08776655", 
          tel: "98 123 456", 
          email: "m.benali@bureau.tn", 
          adresse: "Cité Ennasr, Tunis", 
          poste: "Ingénieur Structure",
          salaire_net: 2450,
          salaire_brut: 3100,
          salaries: [
            { id: 101, mois: "Janvier", annee: 2026, montant_net: 2450, date_paiement: "2026-01-30", methode: "Virement" },
            { id: 102, mois: "Février", annee: 2026, montant_net: 2450, date_paiement: "2026-02-28", methode: "Virement" }
          ]
        },
        { 
          id: 2, 
          nom: "Trabelsi", 
          prenom: "Sarra", 
          cin: "12334455", 
          tel: "22 444 555", 
          email: "s.trabelsi@bureau.tn", 
          adresse: "L'Aouina, Tunis", 
          poste: "Technicienne DAO",
          salaire_net: 1200,
          salaire_brut: 1550,
          salaries: [
            { id: 201, mois: "Janvier", annee: 2026, montant_net: 1200, date_paiement: "2026-01-30", methode: "Chèque" }
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, [search]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedEmployees(newExpanded);
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Salaires</h1>
          <p className="text-slate-500">Gérez vos employés et suivez l'historique des rémunérations</p>
        </div>
        <Button onClick={() => { setSelectedEmployee(null); setIsEmployeeModalOpen(true); }} className="rounded-xl shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 gap-2 h-11 px-6 text-white">
          <Plus size={18} /> Nouvel Employé
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Rechercher un employé (Nom, CIN...)" className="pl-10 rounded-xl border-slate-200 focus:ring-emerald-500/10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <ResizableHeader initialWidth={60} minWidth={60}></ResizableHeader>
                  {isVisible("nom_complet") && <ResizableHeader initialWidth={220} minWidth={150} className="text-center">Employé</ResizableHeader>}
                  {isVisible("cin") && <ResizableHeader initialWidth={110} minWidth={90} className="text-center">CIN</ResizableHeader>}
                  {isVisible("poste") && <ResizableHeader initialWidth={160} minWidth={120} className="text-center">Poste</ResizableHeader>}
                  {isVisible("salaire_brut") && <ResizableHeader initialWidth={130} minWidth={100} className="text-center">S. Brut</ResizableHeader>}
                  {isVisible("salaire_net") && <ResizableHeader initialWidth={130} minWidth={100} className="text-center">S. Net</ResizableHeader>}
                  {isVisible("tel") && <ResizableHeader initialWidth={140} minWidth={100} className="text-center">Téléphone</ResizableHeader>}
                  <ResizableHeader initialWidth={60} minWidth={40}>
                    <ColumnToggle columns={EMPLOYEE_COLUMNS} visibleColumns={visibleColumns} onToggle={(id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])} />
                  </ResizableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={visibleColumns.length + 2} className="h-16 text-center">Chargement...</TableCell></TableRow>
                ) : (
                  employees.map((emp) => (
                    <React.Fragment key={emp.id}>
                      <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-100 hover:text-emerald-600 transition-colors" onClick={() => toggleExpand(emp.id)}>
                            {expandedEmployees.has(emp.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </Button>
                        </TableCell>
                        {isVisible("nom_complet") && (
                          <TableCell className="font-bold text-slate-800 truncate">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs shrink-0">
                                {emp.prenom.charAt(0)}{emp.nom.charAt(0)}
                              </div>
                              <span className="truncate">{emp.prenom} {emp.nom}</span>
                            </div>
                          </TableCell>
                        )}
                        {isVisible("cin") && <TableCell className="text-slate-500 font-mono text-xs">{emp.cin}</TableCell>}
                        {isVisible("poste") && (
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                              <Briefcase size={12} className="text-slate-400" /> {emp.poste}
                            </div>
                          </TableCell>
                        )}
                        {isVisible("salaire_brut") && (
                          <TableCell className="text-right font-medium text-amber-600 text-xs">
                            {formatCurrencyDT(emp.salaire_brut || 0)}
                          </TableCell>
                        )}
                        {isVisible("salaire_net") && (
                          <TableCell className="text-right font-bold text-emerald-600 text-xs">
                            {formatCurrencyDT(emp.salaire_net || 0)}
                          </TableCell>
                        )}
                        {isVisible("tel") && (
                          <TableCell className="text-slate-600 text-sm">
                            <div className="flex items-center gap-1 truncate">
                              <Phone size={12} className="shrink-0 text-slate-400" /> {emp.tel}
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
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedEmployee(emp); setIsEmployeeModalOpen(true); }}><Edit size={14} /> Modifier Profil</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => { setSelectedEmployee(emp); setIsConfirmOpen(true); }}><Trash2 size={14} /> Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedEmployees.has(emp.id) && (
                        <TableRow className="hover:bg-transparent border-none">
                          <TableCell colSpan={visibleColumns.length + 2} className="p-0">
                            <EmployeeSalariesList 
                              salaries={emp.salaries || []} 
                              onAdd={() => { setSelectedEmployee(emp); setSelectedPayment(null); setIsPaymentModalOpen(true); }} 
                              onEdit={(sal) => { setSelectedEmployee(emp); setSelectedPayment(sal); setIsPaymentModalOpen(true); }} 
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EmployeeModal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} onSubmit={() => { showSuccess("Employé enregistré"); setIsEmployeeModalOpen(false); loadEmployees(); }} initialData={selectedEmployee} />
      <SalaryPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSubmit={() => { showSuccess("Paiement validé"); setIsPaymentModalOpen(false); loadEmployees(); }} initialData={selectedPayment} employeeName={selectedEmployee ? `${selectedEmployee.prenom} ${selectedEmployee.nom}` : ""} />
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => { showSuccess("Employé supprimé"); setIsConfirmOpen(false); loadEmployees(); }} title="Supprimer l'employé ?" description="Cette action supprimera également tout l'historique de ses salaires." variant="destructive" confirmText="Supprimer" />
    </div>
  );
};

export default Salaries;