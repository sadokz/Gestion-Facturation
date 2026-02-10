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
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const invoiceSchema = z.object({
  numero_facture: z.string().min(1, "Le numéro est requis"),
  date_emission: z.string().min(1, "La date d'émission est requise"),
  date_payement: z.string().optional(),
  type_facture: z.string().default("Mission S0"),
  montant_ht: z.coerce.number().min(0),
  montant_retenue: z.coerce.number().min(0).default(0),
  tva_pct: z.coerce.number(),
  statut: z.string().default("Non facturé"),
  note: z.string().optional(),
  file_facture: z.any().optional(),
  file_decharge: z.any().optional(),
  file_retenue: z.any().optional(),
});

interface SalesInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  projectTva?: number;
}

export const SalesInvoiceModal: React.FC<SalesInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  projectTva = 19
}) => {
  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      numero_facture: "",
      date_emission: new Date().toISOString().split('T')[0],
      date_payement: "",
      type_facture: "Mission S0",
      montant_ht: 0,
      montant_retenue: 0,
      tva_pct: projectTva,
      statut: "Non facturé",
      note: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        numero_facture: initialData?.numero_facture || "",
        date_emission: initialData?.date_emission || initialData?.date_facture || new Date().toISOString().split('T')[0],
        date_payement: initialData?.date_payement || "",
        type_facture: initialData?.type_facture || "Mission S0",
        montant_ht: initialData?.montant_ht || 0,
        montant_retenue: initialData?.montant_retenue || 0,
        tva_pct: initialData?.tva_pct || projectTva,
        statut: initialData?.statut || "Non facturé",
        note: initialData?.note || "",
      });
    }
  }, [isOpen, initialData, form, projectTva]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? "Modifier la facture" : "Nouvelle facture (Vente)"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero_facture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° Facture</FormLabel>
                    <FormControl>
                      <Input placeholder="FV-2026-XXX" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type_facture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Avance">Avance</SelectItem>
                        <SelectItem value="Mission S0">Mission S0</SelectItem>
                        <SelectItem value="Mission S1">Mission S1</SelectItem>
                        <SelectItem value="Mission S2">Mission S2</SelectItem>
                        <SelectItem value="Mission S3">Mission S3</SelectItem>
                        <SelectItem value="Mission S4">Mission S4</SelectItem>
                        <SelectItem value="Mission S5">Mission S5</SelectItem>
                        <SelectItem value="Règlement Définitif">Règlement Définitif</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_emission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'émission</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_payement"
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
            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="Non facturé">Non facturé</SelectItem>
                        <SelectItem value="Payement En Attente">Payement En Attente</SelectItem>
                        <SelectItem value="Payé">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tva_pct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TVA (%) <span className="text-[10px] text-slate-400 font-normal">(Lié au projet)</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed" 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="montant_ht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Facture HT (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="montant_retenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Retenue (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3 border-t pt-4 mt-4">
              <h4 className="text-sm font-bold text-slate-700">Documents joints</h4>
              <div className="grid grid-cols-3 gap-3">
                {['file_facture', 'file_decharge', 'file_retenue'].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase text-slate-500">
                          {fieldName === 'file_facture' ? 'Facture' : fieldName === 'file_decharge' ? 'Décharge' : 'Retenue'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="file" 
                              className="hidden" 
                              id={fieldName} 
                              onChange={(e) => onChange(e.target.files?.[0])} 
                            />
                            <label 
                              htmlFor={fieldName} 
                              className={cn(
                                "flex flex-col items-center justify-center h-20 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                                value ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                              )}
                            >
                              <UploadCloud size={20} />
                              <span className="text-[9px] mt-1 font-bold">{value ? "Modifer" : "Choisir"}</span>
                            </label>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé / Note (ex: Situation n°2)</FormLabel>
                  <FormControl>
                    <Input placeholder="Détails de la prestation..." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
              <Button type="submit" className="rounded-xl px-6">Enregistrer la facture</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};