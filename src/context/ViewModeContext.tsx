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
      { id: "p-default", category: "projects", name: "Vue Complète", columns: ["reference_projet", "nom_projet", "contrat", "montant_total_ht", "montant_avenant_ht", "tva_pct", "total_ttc", "facture_ht", "facture_ttc", "paye_ttc", "reste_ttc", "statut"] },
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
    // Empêcher la suppression des vues par défaut (celles qui commencent par une lettre et un tiret)
    if (id.includes("-default")) return;
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