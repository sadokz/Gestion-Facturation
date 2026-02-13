import React, { useEffect, useState } from "react";
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  User, 
  Calendar, 
  Stethoscope, 
  Palmtree,
  Clock,
  PieChart
} from "lucide-react";
import { fetcher } from "@/api/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";
import { LeaveModal } from "@/components/hr/LeaveModal";
import { EmployeeLeaveList } from "@/components/hr/EmployeeLeaveList";
import { ResizableHeader } from "@/components/ui/ResizableHeader";
import { ColumnToggle } from "@/components/ui/ColumnToggle";
import { useYear } from "@/context/YearContext";
import { cn } from "@/lib/utils";

const HR_COLUMNS = [
  { id: "employe", label: "Employé" },
  { id: "total_conges", label: "Total Congés" },
  { id: "conges_pris", label: "Congés Pris" },
  { id: "solde_restant", label: "Solde Restant" },
  { id: "maladies", label: "Maladies" },
  { id: "en_attente", label: "En attente" },
];

const HR = () => {
  const { selectedYear } = useYear();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(HR_COLUMNS.map(c => c.id));
  
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

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
          poste: "Ingénieur Structure",
          total_leave_entitlement: 30,
          leaves: [
            { id: 101, type: "Congé Payé", date_debut: "2026-01-05", date_fin: "2026-01-10", nb_jours: 5, statut: "Validé", commentaire: "Vacances hiver" },
            { id: 102, type: "Maladie", date_debut: "2026-02-12", date_fin: "2026-02-13", nb_jours: 2, statut: "Validé", commentaire: "Grippe" }
          ]
        },
        { 
          id: 2, 
          nom: "Trabelsi", 
          prenom: "Sarra", 
          poste: "Technicienne DAO",
          total_leave_entitlement: 30,
          leaves: [
            { id: 201, type: "Congé Payé", date_debut: "2026-03-15", date_fin: "2026-03-16", nb_jours: 1.5, statut: "En attente" }
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, [search, selectedYear]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedEmployees(newExpanded);
  };

  const getLeaveSummary = (leaves: any[], type: string) => {
    if (!leaves) return 0;
    return leaves
      .filter(l => l.type === type && l.statut === "Validé")
      .reduce((sum, l) => sum + (l.nb_jours || 0), 0);
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Ressources Humaines</h1>
        <p className="text-slate-500">Suivi des congés, maladies et absences pour l'exercice {selectedYear}</p>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Rechercher un employé..." 
                className="pl-10 rounded-xl border-slate-200 focus:ring-indigo-500/10" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <ResizableHeader initialWidth={60} minWidth={60} resizable={false}></ResizableHeader>
                  {isVisible("employe") && <ResizableHeader initialWidth={220} minWidth={150} className="text-center">Employé</ResizableHeader>}
                  {isVisible("total_conges") && <ResizableHeader initialWidth={130} minWidth={100} className="text-center">Total Congés</ResizableHeader>}
                  {isVisible("conges_pris") && <ResizableHeader initialWidth={130} minWidth={100} className="text-center">Congés Pris</ResizableHeader>}
                  {isVisible("solde_restant") && <ResizableHeader initialWidth={130} minWidth={100} className="text-center">Solde Restant</ResizableHeader>}
                  {isVisible("maladies") && <ResizableHeader initialWidth={120} minWidth={100} className="text-center">Maladies</ResizableHeader>}
                  {isVisible("en_attente") && <ResizableHeader initialWidth={120} minWidth={100} className="text-center">En attente</ResizableHeader>}
                  <ResizableHeader initialWidth={100} minWidth={80} resizable={false}>
                    <div className="flex justify-center">
                      <ColumnToggle columns={HR_COLUMNS} visibleColumns={visibleColumns} onToggle={(id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])} />
                    </div>
                  </ResizableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={visibleColumns.length + 2} className="h-16 text-center">Chargement...</TableCell></TableRow>
                ) : (
                  employees.map((emp) => {
                    const totalEntitlement = emp.total_leave_entitlement || 30;
                    const takenLeave = getLeaveSummary(emp.leaves || [], "Congé Payé");
                    const remainingLeave = totalEntitlement - takenLeave;
                    const sicknessDays = getLeaveSummary(emp.leaves || [], "Maladie");
                    const pendingRequests = (emp.leaves || []).filter((l: any) => l.statut === "En attente").length;

                    return (
                      <React.Fragment key={emp.id}>
                        <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors" onClick={() => toggleExpand(emp.id)}>
                              {expandedEmployees.has(emp.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </Button>
                          </TableCell>
                          {isVisible("employe") && (
                            <TableCell className="font-bold text-slate-800">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                  <User size={18} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="truncate">{emp.prenom} {emp.nom}</span>
                                  <span className="text-[10px] text-slate-400 font-medium uppercase">{emp.poste}</span>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {isVisible("total_conges") && (
                            <TableCell className="text-center font-medium text-slate-500">
                              {totalEntitlement} j
                            </TableCell>
                          )}
                          {isVisible("conges_pris") && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold">
                                <Palmtree size={14} />
                                {takenLeave} j
                              </div>
                            </TableCell>
                          )}
                          {isVisible("solde_restant") && (
                            <TableCell className="text-center">
                              <div className={cn(
                                "flex items-center justify-center gap-2 font-black",
                                remainingLeave > 5 ? "text-emerald-600" : "text-amber-600"
                              )}>
                                <PieChart size={14} />
                                {remainingLeave} j
                              </div>
                            </TableCell>
                          )}
                          {isVisible("maladies") && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2 text-rose-600 font-bold">
                                <Stethoscope size={14} />
                                {sicknessDays} j
                              </div>
                            </TableCell>
                          )}
                          {isVisible("en_attente") && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2 text-amber-600 font-bold">
                                <Clock size={14} />
                                {pendingRequests}
                              </div>
                            </TableCell>
                          )}
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs"
                              onClick={() => { setSelectedEmployee(emp); setSelectedLeave(null); setIsLeaveModalOpen(true); }}
                            >
                              Ajouter
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedEmployees.has(emp.id) && (
                          <TableRow className="hover:bg-transparent border-none">
                            <TableCell colSpan={visibleColumns.length + 2} className="p-0">
                              <EmployeeLeaveList 
                                leaves={emp.leaves || []} 
                                onAdd={() => { setSelectedEmployee(emp); setSelectedLeave(null); setIsLeaveModalOpen(true); }} 
                                onEdit={(leave) => { setSelectedEmployee(emp); setSelectedLeave(leave); setIsLeaveModalOpen(true); }} 
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <LeaveModal 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)} 
        onSubmit={() => { showSuccess("Absence enregistrée"); setIsLeaveModalOpen(false); loadEmployees(); }} 
        initialData={selectedLeave} 
        employeeName={selectedEmployee ? `${selectedEmployee.prenom} ${selectedEmployee.nom}` : ""} 
      />
    </div>
  );
};

export default HR;