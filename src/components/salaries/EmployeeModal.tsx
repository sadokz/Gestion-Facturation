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
import { UploadCloud, FileCheck, CreditCard, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const employeeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  cin: z.string().min(8, "Le CIN doit comporter 8 chiffres").max(8),
  num_cnss: z.string().optional().or(z.literal("")),
  type_contrat: z.string().min(1, "Le type de contrat est requis"),
  tel: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  poste: z.string().min(1, "Le poste est requis"),
  salaire_net: z.coerce.number().min(0, "Le salaire net doit être positif"),
  salaire_brut: z.coerce.number().min(0, "Le salaire brut doit être positif"),
  total_leave_entitlement: z.coerce.number().min(0).default(30),
  file_cin: z.any().optional(),
  file_contrat: z.any().optional(),
});

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      nom: "",
      prenom: "",
      cin: "",
      num_cnss: "",
      type_contrat: "CDI",
      tel: "",
      email: "",
      adresse: "",
      poste: "",
      salaire_net: 0,
      salaire_brut: 0,
      total_leave_entitlement: 30,
    },
  });

  React.useEffect(() => {
    if (isOpen) form.reset(initialData || { 
      nom: "", 
      prenom: "", 
      cin: "", 
      num_cnss: "",
      type_contrat: "CDI",
      tel: "", 
      email: "", 
      adresse: "", 
      poste: "",
      salaire_net: 0,
      salaire_brut: 0,
      total_leave_entitlement: 30,
    });
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {initialData ? "Modifier l'employé" : "Nouvel employé"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <FormField
                control={form.control}
                name="cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><CreditCard size={14} /> N° CIN</FormLabel>
                    <FormControl>
                      <Input placeholder="00000000" {...field} className="rounded-xl bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_cnss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileText size={14} /> Numéro CNSS</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12345678-90" {...field} className="rounded-xl bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type_contrat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Contrat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STAGE">STAGE</SelectItem>
                        <SelectItem value="SIVP">SIVP</SelectItem>
                        <SelectItem value="CDD">CDD</SelectItem>
                        <SelectItem value="CDI">CDI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_leave_entitlement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Droit Congés (j/an)</FormLabel>
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
                name="salaire_brut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire Brut (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl border-amber-200 focus:ring-amber-500/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salaire_net"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire Net (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl border-emerald-200 focus:ring-emerald-500/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 ..." {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste / Fonction</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingénieur, Technicien..." {...field} className="rounded-xl" />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@bureau.tn" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 border-t pt-6">
              <FormField
                control={form.control}
                name="file_cin"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">Copie CIN (PDF/Image)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="file" 
                          className="hidden" 
                          id="file_cin" 
                          onChange={(e) => onChange(e.target.files?.[0])} 
                        />
                        <label 
                          htmlFor="file_cin" 
                          className={cn(
                            "flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                            value ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {value ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                          <span className="text-[10px] mt-2 font-bold">
                            {value ? (value.name || "CIN sélectionnée") : "Téléverser CIN"}
                          </span>
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file_contrat"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">Contrat Signé (PDF)</FormLabel>
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
                            value ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {value ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                          <span className="text-[10px] mt-2 font-bold">
                            {value ? (value.name || "Contrat sélectionné") : "Téléverser Contrat"}
                          </span>
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};