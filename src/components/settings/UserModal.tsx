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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff } from "lucide-react";

const userSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  poste: z.string().min(1, "Le poste est requis"),
  statut: z.string().default("Actif"),
  permissions: z.record(z.boolean()).default({
    dashboard: true,
    projects: true,
    clients: true,
    companies: true,
    purchases: true,
    salaries: true,
    hr: true,
    cnss: true,
    accounting: true,
    settings: false,
  }),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const MODULES = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "projects", label: "Projets & Ventes" },
  { id: "clients", label: "Clients" },
  { id: "companies", label: "Entreprises" },
  { id: "purchases", label: "Achats" },
  { id: "salaries", label: "Salaires" },
  { id: "hr", label: "RH (Congés)" },
  { id: "cnss", label: "Déclaration CNSS" },
  { id: "accounting", label: "Bilan Comptable" },
  { id: "settings", label: "Paramètres" },
];

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      nom: "",
      email: "",
      password: "",
      poste: "Ingénieur",
      statut: "Actif",
      permissions: {
        dashboard: true,
        projects: true,
        clients: true,
        companies: true,
        purchases: true,
        salaries: true,
        hr: true,
        cnss: true,
        accounting: true,
        settings: false,
      },
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || { 
        nom: "", 
        email: "", 
        password: "",
        poste: "Ingénieur", 
        statut: "Actif",
        permissions: {
          dashboard: true,
          projects: true,
          clients: true,
          companies: true,
          purchases: true,
          salaries: true,
          hr: true,
          cnss: true,
          accounting: true,
          settings: false,
        }
      });
    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2 flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'utilisateur" {...field} className="rounded-xl" />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@bureau.tn" {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            className="rounded-xl pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="poste"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poste / Rôle</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Choisir un poste" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Proprietaire">Propriétaire</SelectItem>
                            <SelectItem value="CEO">CEO</SelectItem>
                            <SelectItem value="CFO">CFO</SelectItem>
                            <SelectItem value="Comptable">Comptable</SelectItem>
                            <SelectItem value="Ingénieur">Ingénieur</SelectItem>
                            <SelectItem value="Technicien">Technicien</SelectItem>
                            <SelectItem value="Secretaire">Secrétaire</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Actif">Actif</SelectItem>
                            <SelectItem value="Suspendu">Suspendu</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-bold text-slate-800">Accès aux modules</h4>
                  <div className="grid grid-cols-2 gap-3">
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
                            <FormLabel className="text-xs font-medium cursor-pointer">
                              {module.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};