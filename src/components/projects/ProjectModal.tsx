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
import { UploadCloud, FileCheck, HardHat, User, Building2, Activity, FileText, UserCheck, Construction, Layers, Hash, Info, ShieldCheck, UserCog, ClipboardList, Lock } from "lucide-react";
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
  phase: z.string().optional(),
  indice: z.string().optional(),
  etat_mo: z.string().default("Non Envoyé"),
  etat_bc: z.string().default("Non Envoyé"),
  etat_interne: z.string().default("Non Envoyé"),
  etat_global: z.string().default("Etude en Cours"),
  avancement: z.coerce.number().min(0).max(100).default(0),
  avancement_travaux: z.coerce.number().min(0).max(100).default(0),
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
  const [tiers, setTiers] = useState<any[]>([]);

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
      phase: "APS",
      indice: "A",
      etat_mo: "Non Envoyé",
      etat_bc: "Non Envoyé",
      etat_interne: "Non Envoyé",
      etat_global: "Etude en Cours",
      avancement: 0,
      avancement_travaux: 0,
    },
  });

  const currentPhase = form.watch("phase");

  useEffect(() => {
    if (isOpen) {
      const loadTiers = async () => {
        try {
          const data = await fetcher("/tiers");
          setTiers(data);
        } catch (err) {
          setTiers([
            { id: 1, nom: "Commune de Tunis", type: "Client" },
            { id: 2, nom: "STEG", type: "Client" },
            { id: 3, nom: "SOTETRA", type: "Entreprise" },
            { id: 4, nom: "STP Sfax", type: "Entreprise" }
          ]);
        }
      };
      loadTiers();
      if (initialData) {
        form.reset({
          ...initialData,
          etat_global: initialData.etat_global || initialData.etat || "Etude en Cours"
        });
      }
    }
  }, [isOpen, initialData, form]);

  const phaseOptions = ["APS", "APD", "DAO", "EXE"];
  const indiceOptions = ["A", "B", "C", "D", "E"];
  const approvalOptions = ["Non Envoyé", "En Attente de Réponse", "Approuvé", "Approuvé avec réserves", "Refusé", "Vérifié"];
  const etatOptions = [
    "Etude en Cours", 
    "Etudes Achevé", 
    "Travaux en Cours", 
    "Travaux Achevés", 
    "Réceptionné Provisoirement", 
    "Réceptionné Définitivement",
    "Bloqué"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] rounded-2xl overflow-hidden p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {technicalOnly && initialData 
              ? `Suivi ${initialData.nom_projet}` 
              : technicalOnly 
                ? "Suivi Technique" 
                : (initialData ? "Modifier le projet" : "Nouveau projet")}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <Tabs defaultValue={technicalOnly ? "technical" : "general"} className="flex flex-col flex-1 overflow-hidden">
              {!technicalOnly && (
                <div className="px-6 border-b shrink-0">
                  <TabsList className="bg-transparent h-12 p-0 gap-6">
                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0">Infos Générales</TabsTrigger>
                    <TabsTrigger value="technical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0">Suivi Technique</TabsTrigger>
                  </TabsList>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {!technicalOnly && (
                  <TabsContent value="general" className="space-y-4 mt-0 focus-visible:outline-none">
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
                              {tiers.filter(t => t.type === "Client").map((t) => (
                                <SelectItem key={t.id} value={t.nom}>{t.nom}</SelectItem>
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
                  </TabsContent>
                )}

                <TabsContent value="technical" className="space-y-4 mt-0 focus-visible:outline-none">
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
                              {tiers.filter(t => t.type === "Client").map((t) => (
                                <SelectItem key={t.id} value={t.nom}>{t.nom}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
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
                      name="entreprise_travaux"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-amber-600"><Construction size={14} /> Entreprise (Travaux)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-100">
                                <SelectValue placeholder="Sélectionner l'entreprise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tiers.filter(t => t.type === "Entreprise").map((t) => (
                                <SelectItem key={t.id} value={t.nom}>{t.nom}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <FormField
                      control={form.control}
                      name="phase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700"><Layers size={14} /> Phase</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Phase" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {phaseOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="indice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700"><Hash size={14} /> Indice</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Indice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {indiceOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100">
                    <FormField
                      control={form.control}
                      name="etat_mo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700 text-[11px]"><UserCog size={12} /> État MO</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-white h-9 text-xs">
                                <SelectValue placeholder="État MO" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {approvalOptions.map((opt) => (
                                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="etat_bc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700 text-[11px]"><ShieldCheck size={12} /> État BC</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-white h-9 text-xs">
                                <SelectValue placeholder="État BC" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {approvalOptions.map((opt) => (
                                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="etat_interne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700 text-[11px]"><ClipboardList size={12} /> État Interne</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-white h-9 text-xs">
                                <SelectValue placeholder="État Interne" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {approvalOptions.map((opt) => (
                                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="etat_global"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-blue-700"><Info size={14} /> État Global</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="État" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {etatOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2 pb-4">
                    <FormField
                      control={form.control}
                      name="avancement"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center mb-2">
                            <FormLabel className="text-xs font-bold text-slate-600">Avancement Études (%)</FormLabel>
                            <span className="text-xs font-black text-primary">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Input type="range" min="0" max="100" step="5" {...field} className="h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avancement_travaux"
                      render={({ field }) => (
                        <FormItem className={cn(currentPhase !== "EXE" && "opacity-50")}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-xs font-bold text-slate-600">Avancement Travaux (%)</FormLabel>
                              {currentPhase !== "EXE" && <Lock size={10} className="text-slate-400" />}
                            </div>
                            <span className="text-xs font-black text-amber-600">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Input 
                              type="range" 
                              min="0" 
                              max="100" 
                              step="5" 
                              {...field} 
                              disabled={currentPhase !== "EXE"}
                              className={cn(
                                "h-2 bg-slate-100 rounded-lg appearance-none accent-amber-500",
                                currentPhase === "EXE" ? "cursor-pointer" : "cursor-not-allowed"
                              )} 
                            />
                          </FormControl>
                          {currentPhase !== "EXE" && (
                            <p className="text-[9px] text-amber-600 font-medium mt-1 italic">Modifiable uniquement en phase EXE</p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-6 border-t bg-slate-50/50 shrink-0">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-8">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};