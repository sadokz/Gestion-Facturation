import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, ShieldCheck, Bell, Save } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const Settings = () => {
  const handleSave = () => {
    showSuccess("Paramètres enregistrés avec succès");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez les informations de votre bureau et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Profil du Bureau</h3>
          <p className="text-sm text-slate-500">Ces informations apparaîtront sur vos factures et rapports.</p>
        </div>
        <Card className="md:col-span-2 border-none shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
                <Building2 size={24} />
                <span className="text-[10px] mt-1 font-medium">LOGO</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">Logo de l'entreprise</h4>
                <p className="text-xs text-slate-500">PNG ou JPG, max 2MB. Recommandé : 400x400px.</p>
                <Button variant="outline" size="sm" className="mt-2 rounded-lg h-8">Changer le logo</Button>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom du Bureau</Label>
                <Input id="company-name" defaultValue="Bureau d'Études Ingénierie" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">Matricule Fiscal</Label>
                <Input id="tax-id" defaultValue="1234567/A/M/000" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse Siège</Label>
              <Input id="address" defaultValue="Avenue Habib Bourguiba, Tunis" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input id="email" type="email" defaultValue="contact@bei.tn" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+216 71 000 000" className="rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Préférences Financières</h3>
          <p className="text-sm text-slate-500">Configurez vos taux par défaut et devises.</p>
        </div>
        <Card className="md:col-span-2 border-none shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-tva">Taux TVA par défaut (%)</Label>
                <Input id="default-tva" type="number" defaultValue="19" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Input id="currency" defaultValue="DT (Dinar Tunisien)" disabled className="rounded-xl bg-slate-50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" className="rounded-xl px-6">Annuler</Button>
        <Button onClick={handleSave} className="rounded-xl px-8 gap-2">
          <Save size={18} /> Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default Settings;