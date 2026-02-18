import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useViewModes, ViewMode } from "@/context/ViewModeContext";
import { showSuccess, showError } from "@/utils/toast";
import { Layout, Save, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: { id: string; label: string }[];
  initialData?: ViewMode | null;
  currentVisibleColumns: string[];
}

export const ViewModeModal: React.FC<ViewModeModalProps> = ({ 
  isOpen, 
  onClose, 
  availableColumns, 
  initialData,
  currentVisibleColumns
}) => {
  const { saveViewMode, updateViewMode } = useViewModes();
  const [name, setName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      // Si on édite, on prend les colonnes du mode. Si on crée, on prend les colonnes actuellement visibles.
      setSelectedColumns(initialData?.columns || [...currentVisibleColumns]);
    }
  }, [isOpen, initialData, currentVisibleColumns]);

  const toggleColumn = (id: string) => {
    setSelectedColumns(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      showError("Veuillez donner un nom à ce mode de vue");
      return;
    }
    if (selectedColumns.length === 0) {
      showError("Veuillez sélectionner au moins une colonne");
      return;
    }

    if (initialData) {
      updateViewMode(initialData.id, name, selectedColumns);
      showSuccess(`Mode "${name}" mis à jour`);
    } else {
      saveViewMode(name, selectedColumns);
      showSuccess(`Mode "${name}" enregistré`);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl flex flex-col max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layout size={20} className="text-primary" />
            {initialData ? "Modifier le mode de vue" : "Nouveau mode de vue"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="view-name" className="text-xs font-bold text-slate-500 uppercase">Nom du mode</Label>
            <Input 
              id="view-name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vue Financière, Suivi Contrat..."
              className="rounded-xl"
              autoFocus
            />
          </div>

          <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <ListChecks size={14} /> Colonnes à afficher ({selectedColumns.length})
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-bold uppercase text-primary"
                onClick={() => setSelectedColumns(availableColumns.map(c => c.id))}
              >
                Tout cocher
              </Button>
            </div>
            
            <ScrollArea className="flex-1 border rounded-xl bg-slate-50/50 p-2">
              <div className="grid grid-cols-1 gap-1">
                {availableColumns.map((col) => (
                  <div 
                    key={col.id}
                    className={cn(
                      "flex items-center space-x-3 p-2.5 rounded-lg transition-colors cursor-pointer hover:bg-white",
                      selectedColumns.includes(col.id) ? "bg-white shadow-sm" : "opacity-70"
                    )}
                    onClick={() => toggleColumn(col.id)}
                  >
                    <Checkbox 
                      id={`col-${col.id}`} 
                      checked={selectedColumns.includes(col.id)}
                      onCheckedChange={() => toggleColumn(col.id)}
                      className="rounded-md"
                    />
                    <label 
                      htmlFor={`col-${col.id}`}
                      className="text-sm font-medium leading-none cursor-pointer flex-1"
                    >
                      {col.label}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-slate-50/50">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
          <Button onClick={handleSave} className="rounded-xl px-8 gap-2">
            <Save size={16} />
            {initialData ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};