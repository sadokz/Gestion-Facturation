import React from "react";
import { Banknote, Plus, Edit, Calendar, CreditCard, Utensils, Sparkles, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyDT, formatDateFR } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EmployeeSalariesListProps {
  salaries: any[];
  onAdd: () => void;
  onEdit: (salary: any) => void;
}

export const EmployeeSalariesList: React.FC<EmployeeSalariesListProps> = ({ 
  salaries, 
  onAdd,
  onEdit 
}) => {
  return (
    <div className="bg-emerald-50/30 p-6 rounded-b-2xl border-t border-emerald-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Banknote size={18} className="text-emerald-600" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historique des Paiements</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={onAdd}
        >
          <Plus size={14} /> Enregistrer un salaire
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase">Période</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Date Paiement</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Méthode</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-right">Ticket Resto</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-right">Prime</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-right">Carburant</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-right">Montant Net</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.length > 0 ? (
              salaries.map((sal, idx) => (
                <TableRow key={sal.id || idx} className="group">
                  <TableCell className="text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-slate-400" />
                      {sal.mois} {sal.annee}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{formatDateFR(sal.date_paiement)}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CreditCard size={12} className="text-slate-400" />
                      {sal.methode}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-right text-slate-600">
                    {sal.ticket_resto > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <Utensils size={10} className="text-orange-400" />
                        {formatCurrencyDT(sal.ticket_resto)}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-right text-slate-600">
                    {sal.prime > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <Sparkles size={10} className="text-amber-400" />
                        {formatCurrencyDT(sal.prime)}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-right text-slate-600">
                    {sal.carburant > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <Fuel size={10} className="text-blue-400" />
                        {formatCurrencyDT(sal.carburant)}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-xs font-black text-emerald-600 text-right">
                    {formatCurrencyDT(sal.montant_net)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onEdit(sal)}>
                      <Edit size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-400 text-xs italic">
                  Aucun paiement enregistré pour cet employé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};