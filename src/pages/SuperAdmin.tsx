import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users as UsersIcon, 
  Building, 
  ShoppingCart, 
  Banknote, 
  UserCheck, 
  ShieldCheck,
  Calculator,
  Settings as SettingsIcon,
  ClipboardCheck,
  Plus,
  Shield,
  ShieldAlert,
  Save,
  Building2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess } from "@/utils/toast";
import { useNavigation, NavigationState } from "@/context/NavigationContext";
import { useRoles, Role } from "@/context/RoleContext";
import { RoleModal } from "@/components/settings/RoleModal";
import { RoleList } from "@/components/settings/RoleList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useUser } from "@/context/UserContext";
import { useMyCompany } from "@/context/CompanyContext";
import { Navigate } from "react-router-dom";

const SuperAdmin = () => {
  const { currentUser } = useUser();
  const { myCompanies, selectedCompany: activeCompany } = useMyCompany();
  const { getTabsForCompany, toggleTabForCompany } = useNavigation();
  const { roles, addRole, updateRole, deleteRole } = useRoles();
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isRoleConfirmOpen, setIsRoleConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // État local pour l'entité en cours de configuration (indépendant de l'entité active)
  const [configCompanyId, setConfigCompanyId] = useState<string>(activeCompany?.id || myCompanies[0]?.id || "");

  useEffect(() => {
    if (!configCompanyId && activeCompany?.id) {
      setConfigCompanyId(activeCompany.id);
    }
  }, [activeCompany, configCompanyId]);

  if (!currentUser.isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleAddRole = (data: any) => {
    if (selectedRole) {
      updateRole({ ...data, id: selectedRole.id });
      showSuccess("Rôle mis à jour");
    } else {
      addRole({ ...data, id: Date.now().toString() });
      showSuccess("Rôle ajouté");
    }
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      deleteRole(selectedRole.id);
      showSuccess("Rôle supprimé");
    }
    setIsRoleConfirmOpen(false);
  };

  const currentConfigTabs = getTabsForCompany(configCompanyId);

  const TabToggle = ({ id, label, icon: Icon }: { id: keyof NavigationState, label: string, icon: any }) => (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <Switch 
        checked={currentConfigTabs[id]} 
        onCheckedChange={() => toggleTabForCompany(configCompanyId, id)} 
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl text-white">
            <ShieldAlert size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Administration Système</h1>
        </div>
        <p className="text-slate-500">Configuration globale des accès et de l'interface</p>
      </div>

      {/* Gestion des Rôles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Gestion des Rôles</h3>
          <p className="text-sm text-slate-500">Définissez des profils types et leurs permissions par défaut pour tout le système.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => { setSelectedRole(null); setIsRoleModalOpen(true); }} 
              className="rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5"
            >
              <Shield size={18} /> Nouveau Rôle
            </Button>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="p-6">
              <RoleList 
                roles={roles} 
                onEdit={(role) => { setSelectedRole(role); setIsRoleModalOpen(true); }} 
                onDelete={(role) => { setSelectedRole(role); setIsRoleConfirmOpen(true); }} 
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Visibilité des Modules */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800">Visibilité des Modules</h3>
            <p className="text-sm text-slate-500">
              Configurez les onglets visibles pour l'entité sélectionnée ci-dessous.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Entité à configurer</label>
            <Select value={configCompanyId} onValueChange={setConfigCompanyId}>
              <SelectTrigger className="rounded-xl border-slate-200 bg-white shadow-sm h-12">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  <SelectValue placeholder="Choisir une entité" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {myCompanies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-amber-600 font-medium italic">
              * Cette sélection n'affecte pas votre entité de travail actuelle.
            </p>
          </div>
        </div>

        <Card className="md:col-span-2 border-none shadow-md">
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TabToggle id="dashboard" label="Tableau de bord" icon={LayoutDashboard} />
            <TabToggle id="projects" label="Projets & Ventes" icon={Briefcase} />
            <TabToggle id="projectTracking" label="Suivi Technique" icon={ClipboardCheck} />
            <TabToggle id="clients" label="Clients" icon={UsersIcon} />
            <TabToggle id="companies" label="Entreprises" icon={Building} />
            <TabToggle id="purchases" label="Achats" icon={ShoppingCart} />
            <TabToggle id="salaries" label="Salaires" icon={Banknote} />
            <TabToggle id="hr" label="RH (Congés)" icon={UserCheck} />
            <TabToggle id="cnss" label="Déclaration CNSS" icon={ShieldCheck} />
            <TabToggle id="accounting" label="Bilan Comptable" icon={Calculator} />
            <TabToggle id="settings" label="Paramètres" icon={SettingsIcon} />
          </CardContent>
        </Card>
      </section>

      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={() => showSuccess("Configuration système enregistrée")} className="rounded-xl px-8 gap-2">
          <Save size={18} /> Enregistrer la configuration
        </Button>
      </div>

      <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSubmit={handleAddRole} initialData={selectedRole} />
      <ConfirmDialog isOpen={isRoleConfirmOpen} onClose={() => setIsRoleConfirmOpen(false)} onConfirm={handleDeleteRole} title="Supprimer ce rôle ?" description="Les utilisateurs ayant ce rôle conserveront leurs permissions actuelles mais le profil type sera supprimé." variant="destructive" confirmText="Supprimer" />
    </div>
  );
};

export default SuperAdmin;