import React, { createContext, useContext, useState, useEffect } from "react";
import { useMyCompany } from "./CompanyContext";

interface NavigationState {
  dashboard: boolean;
  projects: boolean;
  projectTracking: boolean;
  clients: boolean;
  companies: boolean;
  purchases: boolean;
  salaries: boolean;
  hr: boolean;
  cnss: boolean;
  accounting: boolean;
  settings: boolean;
}

const DEFAULT_TABS: NavigationState = {
  dashboard: true,
  projects: true,
  projectTracking: true,
  clients: true,
  companies: true,
  purchases: true,
  salaries: true,
  hr: true,
  cnss: true,
  accounting: true,
  settings: true,
};

interface NavigationContextType {
  tabs: NavigationState;
  toggleTab: (tab: keyof NavigationState) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCompany } = useMyCompany();
  
  // État global stockant les préférences par ID d'entreprise : { [companyId]: NavigationState }
  const [allCompanyTabs, setAllCompanyTabs] = useState<Record<string, NavigationState>>(() => {
    const saved = localStorage.getItem("app_navigation_tabs_per_company");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("app_navigation_tabs_per_company", JSON.stringify(allCompanyTabs));
  }, [allCompanyTabs]);

  // Récupérer les onglets de l'entreprise actuelle ou les valeurs par défaut
  const currentTabs = (selectedCompany && allCompanyTabs[selectedCompany.id]) 
    ? allCompanyTabs[selectedCompany.id] 
    : DEFAULT_TABS;

  const toggleTab = (tab: keyof NavigationState) => {
    if (!selectedCompany) return;
    
    setAllCompanyTabs((prev) => ({
      ...prev,
      [selectedCompany.id]: {
        ...currentTabs,
        [tab]: !currentTabs[tab]
      }
    }));
  };

  return (
    <NavigationContext.Provider value={{ tabs: currentTabs, toggleTab }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within a NavigationProvider");
  return context;
};