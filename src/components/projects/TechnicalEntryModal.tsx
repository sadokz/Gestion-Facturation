import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const entrySchema = z.object({
  type: z.string().min(1, "Le type est requis"),
  date: z.string().min(1, "La date est requise"),
  libelle: z.string().min(1, "Le libellé est requis"),
  effectue_par: z.string().min(1, "L'auteur est requis"),
  intervenants: z.string().optional(),
  compte_rendu: z.string().optional(),
  statut: z.string().default("Terminé"),
  file_intervention: z.any().optional(),
});

interface TechnicalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  projectName: string;
}

export const TechnicalEntryModal: React.FC<TechnicalEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  projectName 
}) => {
  const form = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: initialData || {
      type: "Réunion",
      date: new Date().toISOString().split('T')[0],
      libelle: "",
      effectue_par: "",
      intervenants: "",
      compte_rendu: "",
      statut: "Terminé",
    },
  });

  React.useEffect(() => {
    if (isOpen) form.reset(initialData || {
      type: "Réunion",
      date: new Date().toISOString().split('T')[0],
      libelle: "",
      effectue_par: "",
      intervenants: "",
      compte_rendu: "",
      statut: "Terminé",
    });
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Nouvelle entrée : {projectName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'intervention</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Réunion">Réunion</SelectItem>
                        <SelectItem value="Relevée">Relevée</SelectItem>
                        <SelectItem value="Tache">Tâche</SelectItem>
                        <SelectItem value="Envoyé">Envoyé</SelectItem>
                        <SelectItem value="Reçu">Reçu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
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
              name="libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé / Objet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Envoi plans d'exécution" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="effectue_par"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effectué par</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du collaborateur" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2 border-t pt-4">
              <FormLabel className="text-sm font-bold text-slate-700">Document joint (PV, Décharge, Lettre...)</FormLabel>
              <FormField
                control={form.control}
                name="file_intervention"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="file" 
                          className="hidden" 
                          id="file_intervention" 
                          onChange={(e) => onChange(e.target.files?.[0])} 
                        />
                        <label 
                          htmlFor="file_intervention" 
                          className={cn(
                            "flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                            value ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {value ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                          <span className="text-xs mt-2 font-bold">
                            {value ? (value.name || "Document sélectionné") : "Téléverser le document"}
                          </span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="intervenants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervenants / Destinataires (Tiers)</FormLabel>
                  <FormControl>
                    <Input placeholder="Architecte, Client, etc." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="compte_rendu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / Détails</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Précisions sur l'envoi ou la réception..." {...field} className="rounded-xl resize-none h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};