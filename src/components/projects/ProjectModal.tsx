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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/api/config";
import { UploadCloud, FileCheck, HardHat, User, Building2, Activity, FileText, UserCheck, Construction } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projectSchema = z.object({
  reference_projet: z.string().min(1, "La référence est requise"),
  nom_projet: z.string().min(1, "Le nom est requis"),
  client: z.string().min(1, "Le client est requis"),
  date_contrat: z.string().min(1, "La date est requise"),
  montant_total_ht: z.coerce.number().min(0),
  montant_avenant_ht: z.coerce.number().min(0).default(0),
  tva_pct: z.coerce.number().default(19),
  statut: z.string().default("Partiellement Facturé"),
  file_contrat: z.any().optional(),
  architecte: z.string().optional(),
  ing_fluides: z.string().optional(),
  ing_structure: z.string().optional(),
  bureau_controle: z.string().optional(),
  entreprise_travaux: z.string().optional(),
  responsable_interne: z.string().optional(),
  avancement: z.coerce.number().min(0).max(100).default(0),
});

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  technicalOnly?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  technicalOnly = false 
}) => {
  const [clients, setClients] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      reference_projet: "",
      nom_projet: "",
      client: "",
      date_contrat: new Date().toISOString().split('T')[0],
      montant_total_ht: 0,
      montant_avenant_ht: 0,
      tva_pct: 19,
      statut: "Partiellement Facturé",
      architecte: "",
      ing_fluides: "",
      ing_structure: "",
      bureau_controle: "",
      entreprise_travaux: "",
      responsable_interne: "",
      avancement: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      const loadClients = async () => {
        try {
          const data = await fetcher("/clients");
          setClients(data);
        } catch (err) {
          setClients([
            { id: 1, nom: "Commune de Tunis" },
            { id: 2, nom: "STEG" },
            { id: 3, nom: "Ministère de l'Équipement" }
          ]);
        }
      };
      loadClients();
      if (initialData) form.reset(initialData);
    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {technicalOnly ? "Suivi Technique" : (initialData ? "Modifier le projet" : "Nouveau projet")}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[85vh]">
            <Tabs defaultValue={technicalOnly ? "technical" : "general"} className="w-full">
              {!technicalOnly && (
                <div className="px-6 border-b">
                  <TabsList className="bg-transparent h-12 p-0 gap-6">
                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0">Infos Générales</TabsTrigger>
                    <TabsTrigger value="technical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0">Suivi Technique</TabsTrigger>
                  </TabsList>
                </div>
              )}

              <div className="p-6 overflow-y-auto flex-1">
                {!technicalOnly && (
                  <TabsContent value="general" className="space-y-4 mt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="reference_projet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Référence</FormLabel>
                            <FormControl>
                              <Input placeholder="PRJ-2026-XXX" {...field} className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date_contrat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date contrat</FormLabel>
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
                      name="nom_projet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du projet</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Rénovation..." {...field} className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client (Maître d'Ouvrage)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Sélectionner un client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.nom}>
                                  {client.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="montant_total_ht"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant HT (DT)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.001" {...field} className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="montant_avenant_ht"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avenant HT (DT)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.001" {...field} className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tva_pct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TVA (%)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <FormLabel className="text-sm font-bold text-slate-700">Document du Contrat</FormLabel>
                      <FormField
                        control={form.control}
                        name="file_contrat"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
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
                                    value ? "bg-primary/5 border-primary/30 text-primary" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                  )}
                                >
                                  {value ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                                  <span className="text-xs mt-2 font-bold">
                                    {value ? (value.name || "Contrat sélectionné") : "Téléverser le contrat signé (PDF, Image)"}
                                  </span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="technical" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                    <FormField
                      control={form.control}
                      name="reference_projet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-primary"><FileText size={14} /> Référence</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-xl bg-white" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-primary"><Building2 size={14} /> Client</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-white">
                                <SelectValue placeholder="Client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.nom}>
                                  {client.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="nom_projet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Nom du projet</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-xl bg-white" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="responsable_interne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-600"><UserCheck size={14} /> Responsable Interne</FormLabel>
                          <FormControl>
                            <Input placeholder="Ingénieur en charge..." {...field} className="rounded-xl border-indigo-100" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="architecte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><User size={14} /> Architecte</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom du cabinet..." {...field} className="rounded-xl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bureau_controle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Building2 size={14} /> Bureau de Contrôle</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Veritas, Socotec..." {...field} className="rounded-xl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="entreprise_travaux"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-amber-600"><Construction size={14} /> Entreprise (Travaux)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de l'entreprise..." {...field} className="rounded-xl border-amber-100" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ing_fluides"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Activity size={14} /> Ingénieur Fluides</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom du BET..." {...field} className="rounded-xl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ing_structure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><HardHat size={14} /> Ingénieur Structure</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom du BET..." {...field} className="rounded-xl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="avancement"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel>État d'avancement Études (%)</FormLabel>
                          <span className="text-sm font-bold text-primary">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Input type="range" min="0" max="100" step="5" {...field} className="h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-6 border-t bg-slate-50/50">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-8">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};