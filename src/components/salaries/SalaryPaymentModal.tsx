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

const paymentSchema = z.object({
  mois: z.string().min(1, "Le mois est requis"),
  annee: z.coerce.number().min(2000),
  montant_net: z.coerce.number().min(0),
  date_paiement: z.string().min(1, "La date est requise"),
  methode: z.string().min(1, "La méthode est requise"),
  ticket_resto: z.coerce.number().min(0).default(0),
  prime: z.coerce.number().min(0).default(0),
  carburant: z.coerce.number().min(0).default(0),
  note: z.string().optional(),
});

interface SalaryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  employeeName: string;
}

export const SalaryPaymentModal: React.FC<SalaryPaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  employeeName 
}) => {
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      mois: new Date().toLocaleString('fr-FR', { month: 'long' }),
      annee: new Date().getFullYear(),
      montant_net: 0,
      date_paiement: new Date().toISOString().split('T')[0],
      methode: "Virement",
      ticket_resto: 0,
      prime: 0,
      carburant: 0,
      note: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) form.reset(initialData || {
      mois: new Date().toLocaleString('fr-FR', { month: 'long' }),
      annee: new Date().getFullYear(),
      montant_net: 0,
      date_paiement: new Date().toISOString().split('T')[0],
      methode: "Virement",
      ticket_resto: 0,
      prime: 0,
      carburant: 0,
      note: "",
    });
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Paiement : {employeeName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mois"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Mois" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"].map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="montant_net"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Net (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_paiement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de paiement</FormLabel>
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
              name="methode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Méthode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Virement">Virement</SelectItem>
                      <SelectItem value="Chèque">Chèque</SelectItem>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-3 border-t pt-4">
              <FormField
                control={form.control}
                name="ticket_resto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Ticket Resto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Prime</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="carburant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Carburant</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white">Valider</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};