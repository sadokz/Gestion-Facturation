"use client";

import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Upload, 
  Database, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { exportAppData, importAppData } from "@/utils/data-transfer";
import { showSuccess, showError } from "@/utils/toast";

export const DataTransferSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      exportAppData();
      showSuccess("Exportation réussie");
    } catch (err) {
      showError("Erreur lors de l'exportation");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importAppData(file);
      showSuccess("Données importées avec succès. Redémarrage...");
      // On laisse un peu de temps pour voir le toast avant de recharger
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      showError("Fichier invalide ou corrompu");
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-1">
        <h3 className="font-bold text-slate-800">Gestion des Données</h3>
        <p className="text-sm text-slate-500">
          Sauvegardez ou restaurez l'intégralité de vos configurations système.
        </p>
      </div>
      <div className="md:col-span-2">
        <Card className="border-none shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Download size={18} />
                  <span className="font-bold text-sm">Exporter</span>
                </div>
                <p className="text-xs text-slate-500">
                  Téléchargez un fichier JSON contenant vos utilisateurs, rôles, entités et préférences d'affichage.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl bg-white border-slate-200 hover:bg-primary hover:text-white transition-all"
                  onClick={handleExport}
                >
                  Générer la sauvegarde
                </Button>
              </div>

              <div className="flex-1 p-4 bg-amber-50/30 rounded-2xl border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <Upload size={18} />
                  <span className="font-bold text-sm">Importer</span>
                </div>
                <p className="text-xs text-slate-500">
                  Restaurez vos données à partir d'un fichier de sauvegarde. <span className="font-bold text-amber-600">Attention : cela écrasera vos données actuelles.</span>
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImport} 
                  accept=".json" 
                  className="hidden" 
                />
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl bg-white border-amber-200 text-amber-700 hover:bg-amber-600 hover:text-white transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Charger un fichier
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-800">Note importante</p>
                <p className="text-[11px] text-rose-600 leading-relaxed">
                  L'importation déclenchera un rechargement automatique de l'application pour appliquer les nouveaux paramètres. Assurez-vous d'avoir enregistré vos travaux en cours dans les autres onglets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};