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
import { useViewModes, ViewMode } from "@/context/ViewModeContext";
import { showSuccess, showError } from "@/utils/toast";
import { Layout, Save } from "lucide-react";

interface ViewModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColumns: string[];
  initialData?: ViewMode | null;
}

export const ViewModeModal: React.FC<ViewModeModalProps> = ({ isOpen, onClose, currentColumns, initialData }) => {
  const { saveViewMode, updateViewMode } = useViewModes();
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!name.trim()) {
      showError("Veuillez donner un nom à ce mode de vue");
      return;
    }

    if (initialData) {
      updateViewMode(initialData.id, name, currentColumns);
      showSuccess(`Mode de vue "${name}" mis à jour`);
    } else {
      saveViewMode(name, currentColumns);
      showSuccess(`Mode de vue "${name}" enregistré`);
    }
    
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layout size={20} className="text-primary" />
            {initialData ? "Modifier le mode de vue" : "Enregistrer le mode de vue"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="view-name">Nom du mode</Label>
            <Input 
              id="view-name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez un nom..."
              className="rounded-xl"
              autoFocus
            />
          </div>
          <p className="text-[11px] text-slate-500 italic">
            {initialData 
              ? "Le mode sera mis à jour avec la sélection actuelle des colonnes." 
              : `Ce mode enregistrera la sélection actuelle des ${currentColumns.length} colonnes affichées.`
            }
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
          <Button onClick={handleSave} className="rounded-xl px-6 gap-2">
            <Save size={16} />
            {initialData ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};