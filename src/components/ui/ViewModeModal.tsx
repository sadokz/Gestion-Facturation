"use client";

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
import { useViewModes, ViewMode } from "@/context/ViewModeContext";
import { showSuccess } from "@/utils/toast";
import { Layout, Save } from "lucide-react";

const viewModeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  columns: z.array(z.string()).min(1, "Sélectionnez au moins une colonne"),
});

interface ViewModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: { id: string; label: string }[];
  category: string;
  currentVisibleColumns: string[];
  initialData?: ViewMode | null;
}

export const ViewModeModal: React.FC<ViewModeModalProps> = ({
  isOpen,
  onClose,
  availableColumns,
  category,
  currentVisibleColumns,
  initialData,
}) => {
  const { saveViewMode, updateViewMode } = useViewModes();

  const form = useForm({
    resolver: zodResolver(viewModeSchema),
    defaultValues: {
      name: initialData?.name || "",
      columns: initialData?.columns || currentVisibleColumns,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialData?.name || "",
        columns: initialData?.columns || currentVisibleColumns,
      });
    }
  }, [isOpen, initialData, currentVisibleColumns, form]);

  const onSubmit = (data: any) => {
    if (initialData) {
      updateViewMode(initialData.id, data.name, data.columns);
      showSuccess("Vue mise à jour");
    } else {
      saveViewMode(data.name, data.columns, category);
      showSuccess("Nouvelle vue enregistrée");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl flex flex-col max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layout size={20} className="text-primary" />
            {initialData ? "Modifier la vue" : "Enregistrer la vue actuelle"}
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
                    <FormLabel>Nom de la vue</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ma Vue Finance, Export..." {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Colonnes à afficher</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableColumns.map((col) => (
                    <FormField
                      key={col.id}
                      control={form.control}
                      name="columns"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(col.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, col.id]);
                                } else {
                                  field.onChange(current.filter((id) => id !== col.id));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-medium cursor-pointer flex-1">
                            {col.label}
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
              <Button type="submit" className="rounded-xl px-6 gap-2">
                <Save size={16} /> {initialData ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};