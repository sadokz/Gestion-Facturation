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
import { Eye, EyeOff, Building2, ShieldCheck, User as UserIcon } from "lucide-react";
import { useMyCompany } from "@/context/CompanyContext";
import { cn } from "@/lib/utils";

const AVATAR_SEEDS = ["Felix", "Aneka", "Max", "Jack", "Luna", "Oliver", "Milo", "Sophie"];

const userSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  poste: z.string().min(1, "Le poste est requis"),
  statut: z.string().default("Actif"),
  avatar: z.string().default("Felix"),
  allowedCompanies: z.array(z.string()).default([]),
  permissions: z.record(z.boolean()).default({
    dashboard: true,
    projects: true,
    projectTracking: true,
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

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { myCompanies } = useMyCompany();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      nom: "",
      email: "",
      password: "",
      poste: "Ingénieur",
      statut: "Actif",
      avatar: "Felix",
      allowedCompanies: [],
      permissions: {
        dashboard: true,
        projects: true,
        projectTracking: true,
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
        avatar: "Felix",
        allowedCompanies: [],
        permissions: {
          dashboard: true,
          projects: true,
          projectTracking: true,
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
      <DialogContent className="sm:max-w-[550px] rounded-2xl overflow-hidden flex flex-col h-[85vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-8 py-4">
                {/* Sélection d'Avatar */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserIcon size={14} /> Avatar de l'utilisateur
                  </h4>
                  <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {AVATAR_SEEDS.map((seed) => (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => form.setValue("avatar", seed)}
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all overflow-hidden bg-white",
                          form.watch("avatar") === seed 
                            ? "border-primary ring-4 ring-primary/10 scale-110" 
                            : "border-transparent hover:border-slate-300"
                        )}
                      >
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                          alt={seed}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Infos de base */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informations de connexion</h4>
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
                </div>

                {/* Accès aux entreprises */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Building2 size={14} /> Accès aux Entités
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      type="button"
                      className="h-7 text-[10px] font-bold uppercase text-primary"
                      onClick={() => form.setValue("allowedCompanies", myCompanies.map(c => c.id))}
                    >
                      Tout autoriser
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {myCompanies.map((company) => (
                      <FormField
                        key={company.id}
                        control={form.control}
                        name="allowedCompanies"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(company.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, company.id]);
                                  } else {
                                    field.onChange(current.filter(id => id !== company.id));
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="flex-1 cursor-pointer" onClick={() => {
                              const current = field.value || [];
                              if (current.includes(company.id)) {
                                field.onChange(current.filter(id => id !== company.id));
                              } else {
                                field.onChange([...current, company.id]);
                              }
                            }}>
                              <FormLabel className="text-sm font-bold text-slate-700 cursor-pointer">
                                {company.nom}
                              </FormLabel>
                              <p className="text-[10px] text-slate-400 font-mono">{company.matricule_fiscale || "Sans matricule"}</p>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Permissions modules */}
                <div className="space-y-3 pt-4 border-t pb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={14} /> Permissions Modules
                  </h4>
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

            <DialogFooter className="p-6 border-t bg-slate-50/50">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6">Enregistrer l'utilisateur</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};