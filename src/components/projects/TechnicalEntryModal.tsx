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

const entrySchema = z.object({
  type: z.string().min(1, "Le type est requis"),
  date: z.string().min(1, "La date est requise"),
  libelle: z.string().min(1, "Le libellé est requis"),
  intervenants: z.string().optional(),
  compte_rendu: z.string().optional(),
  statut: z.string().default("Terminé"),
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
      intervenants: "",
      compte_rendu: "",
      statut: "Terminé",
    });
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
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
                    <Input placeholder="Ex: Réunion de chantier n°5" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intervenants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervenants présents</FormLabel>
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
                  <FormLabel>Notes / Compte-rendu rapide</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Points clés abordés..." {...field} className="rounded-xl resize-none h-24" />
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