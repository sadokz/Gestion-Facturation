import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/api/config";
import { useYear } from "@/context/YearContext";

const purchaseSchema = z.object({
  fournisseur: z.string().min(1, "Le fournisseur est requis"),
  numero_facture: z.string().min(1, "Le numéro de facture est requis"),
  date_facture: z.string().min(1, "La date est requise"),
  categorie: z.string().min(1, "La catégorie est requise"),
  montant_ht: z.coerce.number().min(0),
  tva_pct: z.coerce.number().default(19),
  statut: z.string().default("À payer"),
  projet_id: z.string().optional(),
  note: z.string().optional(),
});

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { selectedYear } = useYear();
  const [projects, setProjects] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: initialData || {
      fournisseur: "",
      numero_facture: "",
      date_facture: new Date().toISOString().split('T')[0],
      categorie: "Matériel",
      montant_ht: 0,
      tva_pct: 19,
      statut: "À payer",
      projet_id: "",
      note: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const loadProjects = async () => {
        try {
          const data = await fetcher(`/projects?year=${selectedYear}`);
          setProjects(data);
        } catch (err) {
          setProjects([
            { id: 1, reference_projet: "PRJ-2026-001", nom_projet: "Eclairage Avenue" },
            { id: 2, reference_projet: "PRJ-2026-002", nom_projet: "Rénovation Pont" },
          ]);
        }
      };
      loadProjects();
    }
  }, [isOpen, selectedYear]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-width-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {initialData ? "Modifier l'achat" : "Nouvel achat"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="fournisseur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fournisseur</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du fournisseur" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero_facture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° Facture</FormLabel>
                    <FormControl>
                      <Input placeholder="FA-XXXX" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_facture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date facture</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categorie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Matériel">Matériel</SelectItem>
                        <SelectItem value="Déplacement">Déplacement</SelectItem>
                        <SelectItem value="Logiciels">Logiciels</SelectItem>
                        <SelectItem value="Fournitures">Fournitures</SelectItem>
                        <SelectItem value="Abonnement">Abonnement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projet lié (Optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Choisir un projet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        {projects.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.reference_projet} - {p.nom_projet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="montant_ht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant HT (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="À payer">À payer</SelectItem>
                        <SelectItem value="Payée">Payée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note / Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Détails optionnels..." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-8 bg-rose-600 hover:bg-rose-700">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};