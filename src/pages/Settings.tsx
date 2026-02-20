import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Plus,
  Trash2,
  Edit,
  Globe,
  Phone,
  Mail,
  User,
  Calculator,
  Settings as SettingsIcon,
  UploadCloud,
  ImageIcon,
  UserPlus,
  Building,
  Lock
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useMyCompany } from "@/context/CompanyContext";
import { useUser } from "@/context/UserContext";
import { UserModal } from "@/components/settings/UserModal";
import { UserList } from "@/components/settings/UserList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { myCompanies, selectedCompany, addMyCompany, updateMyCompany, deleteMyCompany } = useMyCompany();
  const { currentUser, allUsers, setAllUsers } = useUser();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompanyConfirmOpen, setIsCompanyConfirmOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  
  const [companyForm, setCompanyForm] = useState({ 
    id: "", nom: "", matricule_fiscale: "", rne: "", gerant: "", comptable: "", 
    adresse: "", tel: "", fax: "", email: "", website: "", logo: "" 
  });

  const isSuperAdmin = currentUser.isSuperAdmin;
  
  // Vérification des droits de gestion des utilisateurs (Gérant, Administrateur ou Super Admin)
  const canManageUsers = isSuperAdmin || 
                         currentUser.poste === "Gérant" || 
                         currentUser.poste === "Administrateur";

  const handleAddUser = (data: any) => {
    if (selectedUser) {
      setAllUsers(allUsers.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
      showSuccess("Utilisateur mis à jour");
    } else {
      setAllUsers([...allUsers, { ...data, id: Date.now() }]);
      showSuccess("Utilisateur ajouté");
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser?.isSuperAdmin) {
      showSuccess("Le compte Super Admin ne peut pas être supprimé");
      setIsConfirmOpen(false);
      return;
    }
    setAllUsers(allUsers.filter(u => u.id !== selectedUser.id));
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyForm({ ...companyForm, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const companiesToShow = isSuperAdmin 
    ? myCompanies 
    : myCompanies.filter(c => c.id === selectedCompany?.id);

  // Filtrage strict : on retire les Super Admins de la liste de gestion
  const filteredUsers = allUsers.filter(u => 
    !u.isSuperAdmin && (selectedCompany && u.allowedCompanies?.includes(selectedCompany.id))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez les informations de votre bureau et les accès utilisateurs</p>
      </div>

      {/* Profil du Bureau */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Profil du Bureau</h3>
          <p className="text-sm text-slate-500">
            {isSuperAdmin 
              ? "Gérez toutes les entités juridiques du bureau." 
              : `Informations légales de l'entité : ${selectedCompany?.nom}.`}
          </p>
        </div>
        <div className="md:col-span-2 space-y-4">
          {isSuperAdmin && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => {
                  setEditingCompanyId("new");
                  setCompanyForm({ 
                    id: "new", nom: "", matricule_fiscale: "", rne: "", gerant: "", 
                    comptable: "", adresse: "", tel: "", fax: "", email: "", website: "", logo: "" 
                  });
                }}
              >
                <Plus size={16} /> Ajouter une entité
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {companiesToShow.map((company) => (
              <Card key={company.id} className={cn(
                "border-none shadow-md transition-all overflow-hidden",
                editingCompanyId === company.id ? "ring-2 ring-primary/20" : ""
              )}>
                <CardContent className="p-0">
                  {editingCompanyId === company.id ? (
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <div className="w-24 h-24 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden">
                            {companyForm.logo ? (
                              <img src={companyForm.logo} alt="Logo preview" className="w-full h-full object-contain" />
                            ) : (
                              <>
                                <ImageIcon size={24} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 mt-1">LOGO</span>
                              </>
                            )}
                          </div>
                          <label htmlFor="logo-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                            <UploadCloud size={24} className="text-white" />
                            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nom de l'entité</Label>
                              <Input value={companyForm.nom} onChange={(e) => setCompanyForm({...companyForm, nom: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                              <Label>RNE</Label>
                              <Input value={companyForm.rne} onChange={(e) => setCompanyForm({...companyForm, rne: e.target.value})} className="rounded-xl" placeholder="Registre National des Entreprises" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Matricule Fiscal</Label>
                          <Input value={companyForm.matricule_fiscale} onChange={(e) => setCompanyForm({...companyForm, matricule_fiscale: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Gérant</Label>
                          <Input value={companyForm.gerant} onChange={(e) => setCompanyForm({...companyForm, gerant: e.target.value})} className="rounded-xl" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Comptable / Cabinet</Label>
                          <Input value={companyForm.comptable} onChange={(e) => setCompanyForm({...companyForm, comptable: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Site Web</Label>
                          <Input value={companyForm.website} onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})} className="rounded-xl" placeholder="www.exemple.tn" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Téléphone</Label>
                          <Input value={companyForm.tel} onChange={(e) => setCompanyForm({...companyForm, tel: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Fax</Label>
                          <Input value={companyForm.fax} onChange={(e) => setCompanyForm({...companyForm, fax: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={companyForm.email} onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})} className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Adresse Siège</Label>
                        <Input value={companyForm.adresse} onChange={(e) => setCompanyForm({...companyForm, adresse: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setEditingCompanyId(null)} className="rounded-xl">Annuler</Button>
                        <Button onClick={saveCompany} className="rounded-xl px-6">Enregistrer</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center overflow-hidden">
                            {company.logo ? (
                              <img src={company.logo} alt={company.nom} className="w-full h-full object-contain" />
                            ) : (
                              <Building size={28} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-slate-800">{company.nom}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MF: {company.matricule_fiscale || "-"}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RNE: {company.rne || "-"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => startEditingCompany(company)}>
                            <Edit size={16} />
                          </Button>
                          {isSuperAdmin && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                              disabled={myCompanies.length <= 1}
                              onClick={() => { setCompanyForm(company); setIsCompanyConfirmOpen(true); }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-t pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs">
                            <User size={14} className="text-slate-400" />
                            <span className="text-slate-500">Gérant :</span>
                            <span className="font-bold text-slate-700">{company.gerant || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calculator size={14} className="text-slate-400" />
                            <span className="text-slate-500">Comptable :</span>
                            <span className="font-bold text-slate-700">{company.comptable || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Globe size={14} className="text-slate-400" />
                            <span className="text-slate-500">Site :</span>
                            <a href={`https://${company.website}`} target="_blank" className="font-bold text-primary hover:underline">{company.website || "-"}</a>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs">
                            <Phone size={14} className="text-slate-400" />
                            <span className="text-slate-500">Tel :</span>
                            <span className="font-bold text-slate-700">{company.tel || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Mail size={14} className="text-slate-400" />
                            <span className="text-slate-500">Email :</span>
                            <span className="font-bold text-slate-700">{company.email || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <SettingsIcon size={14} className="text-slate-400" />
                            <span className="text-slate-500">Fax :</span>
                            <span className="font-bold text-slate-700">{company.fax || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Gestion des Utilisateurs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Gestion des Utilisateurs</h3>
          <p className="text-sm text-slate-500">Gérez les accès pour l'entité : <span className="font-bold text-primary">{selectedCompany?.nom}</span>.</p>
          {!canManageUsers && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-medium">
              <Lock size={14} />
              Modification réservée aux administrateurs
            </div>
          )}
        </div>
        <div className="md:col-span-2 space-y-4">
          {canManageUsers && (
            <div className="flex justify-end">
              <Button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="rounded-xl gap-2">
                <UserPlus size={18} /> Nouvel Utilisateur
              </Button>
            </div>
          )}
          <Card className="border-none shadow-md">
            <CardContent className="p-6">
              <UserList 
                users={filteredUsers} 
                onEdit={(user) => { setSelectedUser(user); setIsUserModalOpen(true); }} 
                onDelete={(user) => { setSelectedUser(user); setIsConfirmOpen(true); }} 
                canManage={canManageUsers}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={() => showSuccess("Paramètres enregistrés")} className="rounded-xl px-8 gap-2">
          <Save size={18} /> Enregistrer les modifications
        </Button>
      </div>

      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSubmit={handleAddUser} initialData={selectedUser} />
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDeleteUser} title="Supprimer l'utilisateur ?" description="Cet utilisateur n'aura plus accès à l'application. Cette action est irréversible." variant="destructive" confirmText="Supprimer" />
      <ConfirmDialog isOpen={isCompanyConfirmOpen} onClose={() => setIsCompanyConfirmOpen(false)} onConfirm={() => { deleteMyCompany(companyForm.id); showSuccess("Entité supprimée"); setIsCompanyConfirmOpen(false); }} title="Supprimer cette entité ?" description="Toutes les données liées à cette entreprise seront inaccessibles. Cette action est irréversible." variant="destructive" confirmText="Supprimer" />
    </div>
  );
};

export default Settings;