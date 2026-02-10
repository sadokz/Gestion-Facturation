import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  Save, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building, 
  ShoppingCart, 
  Banknote, 
  UserCheck, 
  ShieldCheck,
  Calculator,
  Settings as SettingsIcon,
  Plus,
  UserPlus
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useNavigation } from "@/context/NavigationContext";
import { UserList } from "@/components/settings/UserList";
import { UserModal } from "@/components/settings/UserModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const Settings = () => {
  const { tabs, toggleTab } = useNavigation();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Mock users data
  const [users, setUsers] = useState([
    { id: 1, nom: "Admin Principal", email: "admin@bureau.tn", poste: "Proprietaire", statut: "Actif" },
    { id: 2, nom: "Mohamed Ben Ali", email: "m.benali@bureau.tn", poste: "CEO", statut: "Actif" },
    { id: 3, nom: "Sarra Mansour", email: "s.mansour@bureau.tn", poste: "Comptable", statut: "Actif" },
  ]);

  const handleSave = () => {
    showSuccess("Paramètres enregistrés avec succès");
  };

  const handleAddUser = (data: any) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
      showSuccess("Utilisateur mis à jour");
    } else {
      setUsers([...users, { ...data, id: Date.now() }]);
      showSuccess("Utilisateur ajouté");
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    showSuccess("Utilisateur supprimé");
    setIsConfirmOpen(false);
  };

  const TabToggle = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <Switch 
        checked={tabs[id as keyof typeof tabs]} 
        onCheckedChange={() => toggleTab(id)} 
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez les informations de votre bureau et vos préférences</p>
      </div>

      {/* Profil du Bureau */}
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

      {/* Gestion des Utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Utilisateurs</h3>
          <p className="text-sm text-slate-500">Gérez les accès des membres de votre équipe.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} 
              className="rounded-xl gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-700"
            >
              <UserPlus size={16} /> Ajouter un utilisateur
            </Button>
          </div>
          <UserList 
            users={users} 
            onEdit={(user) => { setSelectedUser(user); setIsUserModalOpen(true); }} 
            onDelete={(user) => { setSelectedUser(user); setIsConfirmOpen(true); }} 
          />
        </div>
      </div>

      <Separator />

      {/* Gestion des Onglets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Gestion des Onglets</h3>
          <p className="text-sm text-slate-500">Activez ou désactivez les modules de l'application.</p>
        </div>
        <Card className="md:col-span-2 border-none shadow-md">
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TabToggle id="dashboard" label="Tableau de bord" icon={LayoutDashboard} />
            <TabToggle id="projects" label="Projets & Ventes" icon={Briefcase} />
            <TabToggle id="clients" label="Clients" icon={Users} />
            <TabToggle id="companies" label="Entreprises" icon={Building} />
            <TabToggle id="purchases" label="Achats" icon={ShoppingCart} />
            <TabToggle id="salaries" label="Salaires" icon={Banknote} />
            <TabToggle id="hr" label="RH (Congés)" icon={UserCheck} />
            <TabToggle id="cnss" label="Déclaration CNSS" icon={ShieldCheck} />
            <TabToggle id="accounting" label="Bilan Comptable" icon={Calculator} />
            <TabToggle id="settings" label="Paramètres" icon={SettingsIcon} />
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Préférences Financières */}
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

      <UserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onSubmit={handleAddUser} 
        initialData={selectedUser} 
      />
      
      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDeleteUser} 
        title="Supprimer l'utilisateur ?" 
        description="Cet utilisateur n'aura plus accès à l'application." 
        variant="destructive" 
        confirmText="Supprimer" 
      />
    </div>
  );
};

export default Settings;