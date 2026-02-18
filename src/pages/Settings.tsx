import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
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
  UserPlus,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useNavigation } from "@/context/NavigationContext";
import { useMyCompany } from "@/context/CompanyContext";
import { UserModal } from "@/components/settings/UserModal";
import { UserList } from "@/components/settings/UserList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { tabs, toggleTab } = useNavigation();
  const { myCompanies, addMyCompany, updateMyCompany, deleteMyCompany } = useMyCompany();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompanyConfirmOpen, setIsCompanyConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  
  // État local pour l'édition d'une entreprise
  const [companyForm, setCompanyForm] = useState({ id: "", nom: "", matricule_fiscale: "", adresse: "" });

  const [users, setUsers] = useState([
    { 
      id: 1, 
      nom: "Admin Principal", 
      email: "admin@bureau.tn", 
      password: "password123",
      poste: "Proprietaire", 
      statut: "Actif",
      avatar: "Felix",
      allowedCompanies: ["1"],
      permissions: { dashboard: true, projects: true, projectTracking: true, clients: true, companies: true, purchases: true, salaries: true, hr: true, cnss: true, accounting: true, settings: true }
    },
    { 
      id: 2, 
      nom: "Mohamed Ben Ali", 
      email: "m.benali@bureau.tn", 
      password: "password123",
      poste: "CEO", 
      statut: "Actif",
      avatar: "Aneka",
      allowedCompanies: ["1"],
      permissions: { dashboard: true, projects: true, projectTracking: true, clients: true, companies: true, purchases: true, salaries: true, hr: true, cnss: true, accounting: true, settings: false }
    },
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

  const startEditingCompany = (company: any) => {
    setEditingCompanyId(company.id);
    setCompanyForm(company);
  };

  const saveCompany = () => {
    if (editingCompanyId === "new") {
      addMyCompany({ ...companyForm, id: Date.now().toString() });
      showSuccess("Nouvelle entité ajoutée");
    } else {
      updateMyCompany(companyForm);
      showSuccess("Entité mise à jour");
    }
    setEditingCompanyId(null);
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
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez les informations de votre bureau et les accès utilisateurs</p>
      </div>

      {/* Profil du Bureau (Multi-Entités) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Profil du Bureau</h3>
          <p className="text-sm text-slate-500">Gérez vos différentes entités juridiques et succursales.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => {
                setEditingCompanyId("new");
                setCompanyForm({ id: "new", nom: "", matricule_fiscale: "", adresse: "" });
              }}
            >
              <Plus size={16} /> Ajouter une entité
            </Button>
          </div>

          <div className="space-y-3">
            {myCompanies.map((company) => (
              <Card key={company.id} className={cn(
                "border-none shadow-md transition-all",
                editingCompanyId === company.id ? "ring-2 ring-primary/20" : ""
              )}>
                <CardContent className="p-6">
                  {editingCompanyId === company.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom de l'entité</Label>
                          <Input 
                            value={companyForm.nom} 
                            onChange={(e) => setCompanyForm({...companyForm, nom: e.target.value})}
                            className="rounded-xl" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Matricule Fiscal</Label>
                          <Input 
                            value={companyForm.matricule_fiscale} 
                            onChange={(e) => setCompanyForm({...companyForm, matricule_fiscale: e.target.value})}
                            className="rounded-xl" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Adresse Siège</Label>
                        <Input 
                          value={companyForm.adresse} 
                          onChange={(e) => setCompanyForm({...companyForm, adresse: e.target.value})}
                          className="rounded-xl" 
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setEditingCompanyId(null)} className="rounded-xl">Annuler</Button>
                        <Button onClick={saveCompany} className="rounded-xl px-6">Enregistrer</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                          <Building size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{company.nom}</h4>
                          <p className="text-xs text-slate-500 font-mono">{company.matricule_fiscale || "Pas de matricule"}</p>
                          <p className="text-xs text-slate-400 mt-1">{company.adresse || "Pas d'adresse"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => startEditingCompany(company)}>
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          disabled={myCompanies.length <= 1}
                          onClick={() => {
                            setCompanyForm(company);
                            setIsCompanyConfirmOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {editingCompanyId === "new" && (
              <Card className="border-2 border-dashed border-primary/20 shadow-none bg-primary/5">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de l'entité</Label>
                      <Input 
                        value={companyForm.nom} 
                        onChange={(e) => setCompanyForm({...companyForm, nom: e.target.value})}
                        placeholder="Ex: Bureau d'Études Sud"
                        className="rounded-xl bg-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Matricule Fiscal</Label>
                      <Input 
                        value={companyForm.matricule_fiscale} 
                        onChange={(e) => setCompanyForm({...companyForm, matricule_fiscale: e.target.value})}
                        placeholder="0000000/A/M/000"
                        className="rounded-xl bg-white" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse Siège</Label>
                    <Input 
                      value={companyForm.adresse} 
                      onChange={(e) => setCompanyForm({...companyForm, adresse: e.target.value})}
                      placeholder="Adresse complète..."
                      className="rounded-xl bg-white" 
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setEditingCompanyId(null)} className="rounded-xl">Annuler</Button>
                    <Button onClick={saveCompany} className="rounded-xl px-6">Créer l'entité</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Gestion des Utilisateurs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Gestion des Utilisateurs</h3>
          <p className="text-sm text-slate-500">Créez des comptes pour vos collaborateurs et définissez leurs droits d'accès.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} 
              className="rounded-xl gap-2"
            >
              <UserPlus size={18} /> Nouvel Utilisateur
            </Button>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="p-6">
              <UserList 
                users={users} 
                onEdit={(user) => { setSelectedUser(user); setIsUserModalOpen(true); }} 
                onDelete={(user) => { setSelectedUser(user); setIsConfirmOpen(true); }} 
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Visibilité des Modules */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Visibilité des Modules</h3>
          <p className="text-sm text-slate-500">Activez ou désactivez les onglets du menu latéral pour l'ensemble de l'application.</p>
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
        description="Cet utilisateur n'aura plus accès à l'application. Cette action est irréversible." 
        variant="destructive" 
        confirmText="Supprimer" 
      />

      <ConfirmDialog 
        isOpen={isCompanyConfirmOpen} 
        onClose={() => setIsCompanyConfirmOpen(false)} 
        onConfirm={() => {
          deleteMyCompany(companyForm.id);
          showSuccess("Entité supprimée");
          setIsCompanyConfirmOpen(false);
        }} 
        title="Supprimer cette entité ?" 
        description="Toutes les données liées à cette entreprise seront inaccessibles. Cette action est irréversible." 
        variant="destructive" 
        confirmText="Supprimer" 
      />
    </div>
  );
};

export default Settings;