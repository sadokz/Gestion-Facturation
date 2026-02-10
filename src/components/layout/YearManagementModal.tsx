import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useYear } from "@/context/YearContext";
import { Plus, Trash2, Calendar } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface YearManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YearManagementModal: React.FC<YearManagementModalProps> = ({ isOpen, onClose }) => {
  const { availableYears, addYear, deleteYear } = useYear();
  const [newYear, setNewYear] = useState<string>(new Date().getFullYear().toString());

  const handleAdd = () => {
    const year = parseInt(newYear);
    if (isNaN(year) || year < 2000 || year > 2100) {
      showError("Année invalide");
      return;
    }
    if (availableYears.includes(year)) {
      showError("Cette année existe déjà");
      return;
    }
    addYear(year);
    showSuccess(`Année ${year} ajoutée`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Gérer les Exercices
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              value={newYear} 
              onChange={(e) => setNewYear(e.target.value)}
              className="rounded-xl"
              placeholder="Ex: 2027"
            />
            <Button onClick={handleAdd} className="rounded-xl gap-2">
              <Plus size={16} /> Ajouter
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Années configurées</h4>
            <div className="grid grid-cols-1 gap-2">
              {availableYears.map((year) => (
                <div key={year} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="font-bold text-slate-700">{year}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={() => deleteYear(year)}
                    disabled={availableYears.length <= 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};