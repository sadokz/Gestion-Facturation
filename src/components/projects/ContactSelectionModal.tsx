import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/api/config";

interface ContactSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedIds: number[]) => void;
  onAddNew: () => void;
  clientName: string;
  currentlyLinkedIds: number[];
}

export const ContactSelectionModal: React.FC<ContactSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onAddNew,
  clientName,
  currentlyLinkedIds,
}) => {
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds([...currentlyLinkedIds]);
      loadContacts();
    }
  }, [isOpen, currentlyLinkedIds]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      // Simulation de récupération de tous les contacts du client
      const data = [
        { id: 101, nom: "M. Ahmed Ben Salah", role: "Directeur Technique" },
        { id: 102, nom: "Mme. Sarra Mansour", role: "Chef de Projet" },
        { id: 103, nom: "M. Ali Gharbi", role: "Responsable Achats" },
        { id: 104, nom: "Mme. Ines Feki", role: "Secrétaire Générale" },
      ];
      setAllContacts(data);
    } catch (err) {
      setAllContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleContact = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredContacts = allContacts.filter(c => 
    c.nom.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-primary" size={20} />
            Gérer les contacts : {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="p-1 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Rechercher un contact existant..." 
              className="pl-10 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1 border rounded-xl p-2 bg-slate-50/50">
            {loading ? (
              <p className="text-center py-8 text-sm text-slate-400">Chargement...</p>
            ) : filteredContacts.length > 0 ? (
              <div className="space-y-1">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer hover:bg-white",
                      selectedIds.includes(contact.id) ? "bg-white shadow-sm border-primary/20" : "border-transparent"
                    )}
                    onClick={() => toggleContact(contact.id)}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{contact.nom}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-medium">{contact.role}</span>
                    </div>
                    <Checkbox 
                      checked={selectedIds.includes(contact.id)} 
                      onCheckedChange={() => toggleContact(contact.id)}
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-sm text-slate-400 italic">Aucun contact trouvé</p>
            )}
          </ScrollArea>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-primary hover:text-primary hover:bg-primary/5 rounded-xl h-12 border-2 border-dashed border-primary/20"
            onClick={onAddNew}
          >
            <UserPlus size={18} />
            <span>Créer un nouveau contact</span>
          </Button>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
          <Button onClick={() => onSelect(selectedIds)} className="rounded-xl px-8">Valider la sélection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { cn } from "@/lib/utils";