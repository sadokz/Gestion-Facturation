"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/api/config";
import { Building2 } from "lucide-react";

const responsibleSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  tel: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  projets_suivis: z.string().optional().or(z.literal("")),
  tiers_id: z.string().min(1, "L'entreprise est requise"),
});

interface CompanyResponsibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const CompanyResponsibleModal: React.FC<CompanyResponsibleModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [tiers, setTiers] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(responsibleSchema),
    defaultValues: initialData || {
      nom: "",
      role: "",
      tel: "",
      email: "",
      projets_suivis: "",
      tiers_id: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const loadTiers = async () => {
        try {
          const data = await fetcher("/tiers");
          // On filtre pour ne garder que les entreprises dans ce modal spécifique
          setTiers(data.filter((t: any) => t.type === "Entreprise"));
        } catch (err) {
          // Données de secours si l'API n'est pas disponible
          setTiers([
            { id: 3, nom: "SOTETRA", type: "Entreprise" },
            { id: 4, nom: "STP Sfax", type: "Entreprise" }
          ]);
        }
      };
      loadTiers();
      
      if (initialData) {
        form.reset({
          ...initialData,
          tiers_id: initialData.tiers_id?.toString() || "",
        });
      } else {
        form.reset({
          nom: "",
          role: "",
          tel: "",
          email: "",
          projets_suivis: "",
          tiers_id: "",
        });
      }
    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? "Modifier le responsable" : "Nouveau responsable entreprise"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="tiers_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-amber-600">
                    <Building2 size={14} /> Entreprise
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Sélectionner l'entreprise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiers.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          <span className="font-medium">{t.nom}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="M. Foulen Ben Foulen" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle / Poste</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conducteur de travaux, Gérant..." {...field} className="rounded-xl" />
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
                    <FormLabel>Téléphone direct</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 ..." {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email professionnel</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="nom@entreprise.tn" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="projets_suivis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projets suivis</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Listez les projets gérés par ce contact..." 
                      {...field} 
                      className="rounded-xl min-h-[80px] resize-none" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6 bg-amber-600 hover:bg-amber-700 text-white">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};