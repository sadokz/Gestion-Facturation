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

const companySchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  matricule_fiscale: z.string().optional().or(z.literal("")),
  adresse: z.string().optional().or(z.literal("")),
  google_maps_link: z.string().url("Lien Google Maps invalide").optional().or(z.literal("")),
  tel: z.string().optional().or(z.literal("")),
  fax: z.string().optional().or(z.literal("")),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      nom: "",
      matricule_fiscale: "",
      adresse: "",
      google_maps_link: "",
      tel: "",
      fax: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) form.reset(initialData || { nom: "", matricule_fiscale: "", adresse: "", google_maps_link: "", tel: "", fax: "", email: "" });
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {initialData ? "Modifier l'entreprise" : "Nouvelle entreprise"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom / Raison Sociale</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matricule_fiscale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule Fiscal (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567/A/M/000" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse (Optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="google_maps_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien Google Maps (Optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://goo.gl/maps/..." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 ..." {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 ..." {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optionnel)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@entreprise.tn" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-8 bg-amber-600 hover:bg-amber-700 text-white">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};