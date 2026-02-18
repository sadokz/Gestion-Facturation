import React, { createContext, useContext, useState, useEffect } from "react";

export interface ViewMode {
  id: string;
  name: string;
  columns: string[];
  category: string; // 'projects', 'tracking', 'clients', 'companies', 'purchases', 'salaries', 'hr'
}

interface ViewModeContextType {
  viewModes: ViewMode[];
  saveViewMode: (name: string, columns: string[], category: string) => void;
  updateViewMode: (id: string, name: string, columns: string[]) => void;
  deleteViewMode: (id: string) => void;
  getViewModesByCategory: (category: string) => ViewMode[];
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModes, setViewModes] = useState<ViewMode[]>(() => {
    const saved = localStorage.getItem("app_view_modes");
    if (saved) return JSON.parse(saved);
    
    // Vues par défaut pour chaque catégorie
    return [
      // Modes de vue Projets (uniquement les 5 demandés)
      { id: "p-ht", category: "projects", name: "Mode HT", columns: ["reference_projet", "nom_projet", "montant_total_ht", "montant_avenant_ht", "total_ht", "facture_ht", "paye_ht", "reste_ht", "statut"] },
      { id: "p-ttc", category: "projects", name: "Mode TTC", columns: ["reference_projet", "nom_projet", "total_ttc", "facture_ttc", "paye_ttc", "reste_ttc", "statut"] },
      { id: "p-partial", category: "projects", name: "Partiellement Facturé", columns: ["reference_projet", "nom_projet", "total_ht", "facture_ht", "reste_ht", "statut"] },
      { id: "p-total", category: "projects", name: "Totalement Facturé", columns: ["reference_projet", "nom_projet", "total_ht", "facture_ht", "statut"] },
      { id: "p-none", category: "projects", name: "Non Facturé", columns: ["reference_projet", "nom_projet", "total_ht", "reste_ht", "statut"] },
      
      // Autres catégories
      { id: "t-default", category: "tracking", name: "Vue Technique", columns: ["reference_projet", "nom_projet", "responsable_interne", "phase", "indice", "avancement", "entreprise_travaux", "avancement_travaux"] },
      { id: "c-default", category: "clients", name: "Vue Standard", columns: ["nom", "matricule_fiscale", "tel", "email"] },
      { id: "co-default", category: "companies", name: "Vue Standard", columns: ["nom", "matricule_fiscale", "tel", "email"] },
      { id: "pu-default", category: "purchases", name: "Vue Standard", columns: ["fournisseur", "numero_facture", "date_facture", "categorie", "montant_ht", "ttc", "statut"] },
      { id: "s-default", category: "salaries", name: "Vue Standard", columns: ["nom_complet", "poste", "salaire_net", "tel"] },
      { id: "h-default", category: "hr", name: "Vue Standard", columns: ["employe", "total_conges", "conges_pris", "solde_restant", "maladies"] },
    ];
  });

  useEffect(() => {
    localStorage.setItem("app_view_modes", JSON.stringify(viewModes));
  }, [viewModes]);

  const saveViewMode = (name: string, columns: string[], category: string) => {
    const newMode = {
      id: Date.now().toString(),
      name,
      columns,
      category
    };
    setViewModes(prev => [...prev, newMode]);
  };

  const updateViewMode = (id: string, name: string, columns: string[]) => {
    setViewModes(prev => prev.map(m => m.id === id ? { ...m, name, columns } : m));
  };

  const deleteViewMode = (id: string) => {
    // Empêcher la suppression des vues système (commençant par p- ou contenant -default)
    if (id.startsWith("p-") || id.includes("-default")) return;
    setViewModes(prev => prev.filter(m => m.id !== id));
  };

  const getViewModesByCategory = (category: string) => {
    return viewModes.filter(m => m.category === category);
  };

  return (
    <ViewModeContext.Provider value={{ viewModes, saveViewMode, updateViewMode, deleteViewMode, getViewModesByCategory }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewModes = () => {
  const context = useContext(ViewModeContext);
  if (!context) throw new Error("useViewModes must be used within a ViewModeProvider");
  return context;
};