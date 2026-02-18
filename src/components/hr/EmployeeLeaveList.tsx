import React from "react";
import { Calendar, Plus, Edit, Trash2, Clock, CheckCircle2, XCircle, FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateFR } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EmployeeLeaveListProps {
  leaves: any[];
  onAdd: () => void;
  onEdit: (leave: any) => void;
}

export const EmployeeLeaveList: React.FC<EmployeeLeaveListProps> = ({ 
  leaves, 
  onAdd,
  onEdit 
}) => {
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "Validé": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "En attente": return <Clock size={14} className="text-amber-500" />;
      case "Refusé": return <XCircle size={14} className="text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-indigo-50/30 p-6 rounded-b-2xl border-t border-indigo-100 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historique des Absences</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          onClick={onAdd}
        >
          <Plus size={14} /> Déclarer une absence
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase">Type</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Période</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Jours</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Justificatif</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Statut</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Commentaire</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.length > 0 ? (
              leaves.map((leave, idx) => (
                <TableRow key={leave.id || idx} className="group">
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold",
                      leave.type === "Maladie" ? "border-rose-200 text-rose-600 bg-rose-50" : "border-indigo-200 text-indigo-600 bg-indigo-50"
                    )}>
                      {leave.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    Du {formatDateFR(leave.date_debut)} au {formatDateFR(leave.date_fin)}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-center text-slate-700">
                    {leave.nb_jours} j
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit(leave); }}
                          className={cn(
                            "mx-auto flex items-center justify-center w-8 h-8 rounded-lg border transition-all",
                            leave.file_justificatif 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600"
                          )}
                        >
                          {leave.file_justificatif ? <FileText size={14} /> : <UploadCloud size={14} />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{leave.file_justificatif ? "Voir le justificatif" : "Ajouter un justificatif"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      {getStatutIcon(leave.statut)}
                      {leave.statut}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 italic truncate max-w-[200px]">
                    {leave.commentaire || "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onEdit(leave)}>
                      <Edit size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs italic">
                  Aucune absence enregistrée pour cet employé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};