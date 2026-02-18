import React, { createContext, useContext, useState, useEffect } from "react";

export interface ViewMode {
  id: string;
  name: string;
  columns: string[];
}

interface ViewModeContextType {
  viewModes: ViewMode[];
  saveViewMode: (name: string, columns: string[]) => void;
  deleteViewMode: (id: string) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModes, setViewModes] = useState<ViewMode[]>(() => {
    const saved = localStorage.getItem("project_view_modes");
    return saved ? JSON.parse(saved) : [
      { id: "default", name: "Vue Complète", columns: ["reference_projet", "nom_projet", "contrat", "montant_total_ht", "montant_avenant_ht", "tva_pct", "total_ttc", "facture_ht", "facture_ttc", "paye_ttc", "reste_ttc", "statut"] },
      { id: "finance", name: "Vue Financière", columns: ["nom_projet", "total_ttc", "facture_ttc", "paye_ttc", "reste_ttc"] }
    ];
  });

  useEffect(() => {
    localStorage.setItem("project_view_modes", JSON.stringify(viewModes));
  }, [viewModes]);

  const saveViewMode = (name: string, columns: string[]) => {
    const newMode = {
      id: Date.now().toString(),
      name,
      columns
    };
    setViewModes(prev => [...prev, newMode]);
  };

  const deleteViewMode = (id: string) => {
    if (id === "default" || id === "finance") return; // Garder les modes de base
    setViewModes(prev => prev.filter(m => m.id !== id));
  };

  return (
    <ViewModeContext.Provider value={{ viewModes, saveViewMode, deleteViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewModes = () => {
  const context = useContext(ViewModeContext);
  if (!context) throw new Error("useViewModes must be used within a ViewModeProvider");
  return context;
};