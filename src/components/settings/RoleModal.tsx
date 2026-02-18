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
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";

const roleSchema = z.object({
  name: z.string().min(1, "Le nom du rôle est requis"),
  permissions: z.record(z.boolean()),
});

const MODULES = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "projects", label: "Projets & Ventes" },
  { id: "projectTracking", label: "Suivi Technique" },
  { id: "clients", label: "Clients" },
  { id: "companies", label: "Entreprises" },
  { id: "purchases", label: "Achats" },
  { id: "salaries", label: "Salaires" },
  { id: "hr", label: "RH (Congés)" },
  { id: "cnss", label: "Déclaration CNSS" },
  { id: "accounting", label: "Bilan Comptable" },
  { id: "settings", label: "Paramètres" },
];

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const form = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: "",
      permissions: MODULES.reduce((acc, mod) => ({ ...acc, [mod.id]: false }), {}),
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || {
        name: "",
        permissions: MODULES.reduce((acc, mod) => ({ ...acc, [mod.id]: false }), {}),
      });
    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-hidden flex flex-col max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? "Modifier le rôle" : "Nouveau rôle"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du rôle</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Chef de Projet, Comptable..." {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={14} /> Permissions du rôle
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {MODULES.map((module) => (
                    <FormField
                      key={module.id}
                      control={form.control}
                      name={`permissions.${module.id}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer flex-1">
                            {module.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 border-t bg-slate-50/50">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6">Enregistrer le rôle</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};