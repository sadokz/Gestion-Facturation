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
import { UploadCloud, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const projectSchema = z.object({
  reference_projet: z.string().min(1, "La référence est requise"),
  nom_projet: z.string().min(1, "Le nom est requis"),
  client: z.string().min(1, "Le client est requis"),
  date_contrat: z.string().min(1, "La date est requise"),
  montant_total_ht: z.coerce.number().min(0),
  montant_avenant_ht: z.coerce.number().min(0).default(0),
  tva_pct: z.coerce.number().default(19),
  statut: z.string().default("Partiellement Facturé"),
  file_contrat: z.any().optional(),
});

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [clients, setClients] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      reference_projet: "",
      nom_projet: "",
      client: "",
      date_contrat: new Date().toISOString().split('T')[0],
      montant_total_ht: 0,
      montant_avenant_ht: 0,
      tva_pct: 19,
      statut: "Partiellement Facturé",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const loadClients = async () => {
        try {
          const data = await fetcher("/clients");
          setClients(data);
        } catch (err) {
          setClients([
            { id: 1, nom: "Commune de Tunis" },
            { id: 2, nom: "STEG" },
            { id: 3, nom: "Ministère de l'Équipement" }
          ]);
        }
      };
      loadClients();
      if (initialData) form.reset(initialData);
    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {initialData ? "Modifier le projet" : "Nouveau projet"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reference_projet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input placeholder="PRJ-2026-XXX" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_contrat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date contrat</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nom_projet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rénovation..." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.nom}>
                          {client.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="montant_total_ht"
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
                name="montant_avenant_ht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avenant HT (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tva_pct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TVA (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 border-t pt-4">
              <FormLabel className="text-sm font-bold text-slate-700">Document du Contrat</FormLabel>
              <FormField
                control={form.control}
                name="file_contrat"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="file" 
                          className="hidden" 
                          id="file_contrat" 
                          onChange={(e) => onChange(e.target.files?.[0])} 
                        />
                        <label 
                          htmlFor="file_contrat" 
                          className={cn(
                            "flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                            value ? "bg-primary/5 border-primary/30 text-primary" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {value ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                          <span className="text-xs mt-2 font-bold">
                            {value ? (value.name || "Contrat sélectionné") : "Téléverser le contrat signé (PDF, Image)"}
                          </span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-8">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};