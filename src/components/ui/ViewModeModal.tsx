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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useViewModes, ViewMode } from "@/context/ViewModeContext";
import { showSuccess } from "@/utils/toast";
import { Trash2, Save, Layout } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

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
  const { saveViewMode, updateViewMode, deleteViewMode } = useViewModes();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(viewModeSchema),
    defaultValues: {
      name: "",
      columns: currentVisibleColumns,
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
      showSuccess("Mode de vue mis à jour");
    } else {
      saveViewMode(data.name, data.columns, category);
      showSuccess("Nouveau mode de vue enregistré");
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialData) {
      deleteViewMode(initialData.id);
      showSuccess("Mode de vue supprimé");
      setIsConfirmDeleteOpen(false);
      onClose();
    }
  };

  const isSystemView = initialData?.id.startsWith("p-") || initialData?.id.includes("-default");

  return (
    <>
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
                        <Input placeholder="Ex: Vue Financière, Vue Simplifiée..." {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider">Colonnes à afficher</FormLabel>
                  <ScrollArea className="h-[300px] pr-4 border rounded-xl p-2 bg-slate-50/50">
                    <div className="grid grid-cols-1 gap-1">
                      {availableColumns.map((col) => (
                        <FormField
                          key={col.id}
                          control={form.control}
                          name="columns"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
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
                              <FormLabel className="text-sm font-medium cursor-pointer flex-1">
                                {col.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <DialogFooter className="p-6 border-t bg-slate-50/50 flex flex-col sm:flex-row gap-3">
                {initialData && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2 order-2 sm:order-1"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    disabled={isSystemView}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </Button>
                )}
                <div className="flex gap-3 flex-1 justify-end order-1 sm:order-2">
                  <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                    Annuler
                  </Button>
                  <Button type="submit" className="rounded-xl gap-2 px-6">
                    <Save size={16} />
                    Enregistrer
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer ce mode de vue ?"
        description="Cette action est irréversible. Vous perdrez cette configuration de colonnes."
        variant="destructive"
        confirmText="Supprimer définitivement"
      />
    </>
  );
};