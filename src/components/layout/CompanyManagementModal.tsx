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
import { Label } from "@/components/ui/label";
import { useMyCompany } from "@/context/CompanyContext";
import { Plus, Trash2, Building2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CompanyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyManagementModal: React.FC<CompanyManagementModalProps> = ({ isOpen, onClose }) => {
  const { myCompanies, addMyCompany, deleteMyCompany } = useMyCompany();
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyTaxId, setNewCompanyTaxId] = useState("");

  const handleAdd = () => {
    if (!newCompanyName.trim()) {
      showError("Le nom est requis");
      return;
    }
    addMyCompany({
      id: Date.now().toString(),
      nom: newCompanyName,
      matricule_fiscale: newCompanyTaxId
    });
    setNewCompanyName("");
    setNewCompanyTaxId("");
    showSuccess("Entreprise ajoutée");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Gérer mes Entités
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <Label>Nom de l'entité</Label>
              <Input 
                value={newCompanyName} 
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Ex: Bureau d'Études Sud"
                className="rounded-xl bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Matricule Fiscal</Label>
              <Input 
                value={newCompanyTaxId} 
                onChange={(e) => setNewCompanyTaxId(e.target.value)}
                placeholder="0000000/A/M/000"
                className="rounded-xl bg-white"
              />
            </div>
            <Button onClick={handleAdd} className="w-full rounded-xl gap-2 mt-2">
              <Plus size={16} /> Ajouter l'entité
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entités configurées</h4>
            <div className="space-y-2">
              {myCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-700">{company.nom}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{company.matricule_fiscale || "Pas de matricule"}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={() => deleteMyCompany(company.id)}
                    disabled={myCompanies.length <= 1}
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