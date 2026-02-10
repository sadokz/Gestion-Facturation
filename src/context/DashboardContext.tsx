import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardPreferences {
  showKpiCards: boolean;
  showMonthlyFlux: boolean;
  showProjectStatus: boolean;
  showRecentActivity: boolean;
  showTopClients: boolean;
  showTotalCnssPaid: boolean; // New preference
  showTotalSalaries: boolean; // New preference
  showTotalRevenue: boolean; // New preference
  showTotalProfit: boolean; // New preference
}

interface DashboardContextType {
  preferences: DashboardPreferences;
  togglePreference: (key: keyof DashboardPreferences) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem("dashboard_preferences");
    return saved ? JSON.parse(saved) : {
      showKpiCards: true,
      showMonthlyFlux: true,
      showProjectStatus: true,
      showRecentActivity: true,
      showTopClients: true,
      showTotalCnssPaid: true, // Default to true
      showTotalSalaries: true, // Default to true
      showTotalRevenue: true, // Default to true
      showTotalProfit: true, // Default to true
    };
  });

  useEffect(() => {
    localStorage.setItem("dashboard_preferences", JSON.stringify(preferences));
  }, [preferences]);

  const togglePreference = (key: keyof DashboardPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardContext.Provider value={{ preferences, togglePreference }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};