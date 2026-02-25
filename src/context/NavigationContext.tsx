import React, { createContext, useContext, useState, useEffect } from "react";
import { useMyCompany } from "./CompanyContext";

export interface NavigationState {
  dashboard: boolean;
  technicalDashboard: boolean;
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

export const DEFAULT_TABS: NavigationState = {
  dashboard: true,
  technicalDashboard: true,
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
  getTabsForCompany: (companyId: string) => NavigationState;
  toggleTabForCompany: (companyId: string, tab: keyof NavigationState) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCompany } = useMyCompany();
  
  const [allCompanyTabs, setAllCompanyTabs] = useState<Record<string, NavigationState>>(() => {
    const saved = localStorage.getItem("app_navigation_tabs_per_company");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("app_navigation_tabs_per_company", JSON.stringify(allCompanyTabs));
  }, [allCompanyTabs]);

  const getTabsForCompany = (companyId: string) => {
    return allCompanyTabs[companyId] || DEFAULT_TABS;
  };

  const toggleTabForCompany = (companyId: string, tab: keyof NavigationState) => {
    const current = getTabsForCompany(companyId);
    setAllCompanyTabs((prev) => ({
      ...prev,
      [companyId]: {
        ...current,
        [tab]: !current[tab]
      }
    }));
  };

  const currentTabs = selectedCompany ? getTabsForCompany(selectedCompany.id) : DEFAULT_TABS;

  const toggleTab = (tab: keyof NavigationState) => {
    if (!selectedCompany) return;
    toggleTabForCompany(selectedCompany.id, tab);
  };

  return (
    <NavigationContext.Provider value={{ tabs: currentTabs, toggleTab, getTabsForCompany, toggleTabForCompany }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within a NavigationProvider");
  return context;
};