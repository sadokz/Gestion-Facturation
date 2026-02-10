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

const leaveSchema = z.object({
  type: z.string().min(1, "Le type est requis"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().min(1, "La date de fin est requise"),
  nb_jours: z.coerce.number().min(0.5, "Minimum 0.5 jour"),
  statut: z.string().default("Validé"),
  commentaire: z.string().optional(),
  file_justificatif: z.any().optional(),
});

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  employeeName: string;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  employeeName 
}) => {
  const form = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: initialData || {
      type: "Congé Payé",
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: new Date().toISOString().split('T')[0],
      nb_jours: 1,
      statut: "Validé",
      commentaire: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) form.reset(initialData || {
      type: "Congé Payé",
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: new Date().toISOString().split('T')[0],
      nb_jours: 1,
      statut: "Validé",
      commentaire: "",
    });
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Absence : {employeeName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'absence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Congé Payé">Congé Payé</SelectItem>
                      <SelectItem value="Maladie">Maladie</SelectItem>
                      <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                      <SelectItem value="Récupération">Récupération</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date fin</FormLabel>
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
                name="nb_jours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de jours</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} className="rounded-xl" />
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
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Validé">Validé</SelectItem>
                        <SelectItem value="Refusé">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel className="text-sm font-bold text-slate-700">Justificatif (PDF, Image)</FormLabel>
              <FormField
                control={form.control}
                name="file_justificatif"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="file" 
                          className="hidden" 
                          id="file_justificatif" 
                          onChange={(e) => onChange(e.target.files?.[0])} 
                        />
                        <label 
                          htmlFor="file_justificatif" 
                          className={cn(
                            "flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                            value ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {value ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                          <span className="text-xs mt-2 font-bold">
                            {value ? (value.name || "Justificatif sélectionné") : "Téléverser le justificatif"}
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
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire / Motif</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Détails optionnels..." {...field} className="rounded-xl resize-none h-20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};