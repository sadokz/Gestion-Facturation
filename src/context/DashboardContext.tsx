import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardPreferences {
  showKpiCards: boolean;
  showMonthlyFlux: boolean;
  showProjectStatus: boolean;
  showRecentActivity: boolean;
  showTopClients: boolean;
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