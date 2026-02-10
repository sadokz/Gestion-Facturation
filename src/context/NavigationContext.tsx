import React, { createContext, useContext, useState, useEffect } from "react";

interface NavigationState {
  dashboard: boolean;
  projects: boolean;
  clients: boolean;
  companies: boolean;
  purchases: boolean;
  salaries: boolean;
  hr: boolean;
  settings: boolean;
}

interface NavigationContextType {
  tabs: NavigationState;
  toggleTab: (tab: keyof NavigationState) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<NavigationState>(() => {
    const saved = localStorage.getItem("app_navigation_tabs");
    return saved ? JSON.parse(saved) : {
      dashboard: true,
      projects: true,
      clients: true,
      companies: true,
      purchases: true,
      salaries: true,
      hr: true,
      settings: true,
    };
  });

  useEffect(() => {
    localStorage.setItem("app_navigation_tabs", JSON.stringify(tabs));
  }, [tabs]);

  const toggleTab = (tab: keyof NavigationState) => {
    setTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  return (
    <NavigationContext.Provider value={{ tabs, toggleTab }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within a NavigationProvider");
  return context;
};