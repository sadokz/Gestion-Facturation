import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardPreferences {
  totalContractsHT: boolean;
  totalInvoicedHT: boolean;
  totalRemainingHT: boolean;
  totalPurchasesHT: boolean;
  showMonthlyFlux: boolean;
  showProjectStatus: boolean;
  showRecentActivity: boolean;
  showTopClients: boolean;
  showTotalCnssPaid: boolean;
  showTotalSalaries: boolean;
  showTotalRevenue: boolean;
  showTotalProfit: boolean;
  // Préférences pour le graphique de flux
  fluxShowInvoiced: boolean;
  fluxShowPending: boolean;
  fluxShowPurchases: boolean;
  fluxShowSalaries: boolean;
}

const ALL_KPI_IDS = [
  "totalContractsHT",
  "totalInvoicedHT",
  "totalRemainingHT",
  "totalPurchasesHT",
  "totalCnssPaid",
  "totalSalaries",
  "totalRevenue",
  "totalProfit",
];

interface DashboardContextType {
  preferences: DashboardPreferences;
  togglePreference: (key: keyof DashboardPreferences) => void;
  kpiOrder: string[];
  setKpiOrder: (order: string[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem("dashboard_preferences");
    return saved ? JSON.parse(saved) : {
      totalContractsHT: true,
      totalInvoicedHT: true,
      totalRemainingHT: true,
      totalPurchasesHT: true,
      showMonthlyFlux: true,
      showProjectStatus: true,
      showRecentActivity: true,
      showTopClients: true,
      showTotalCnssPaid: true,
      showTotalSalaries: true,
      showTotalRevenue: true,
      showTotalProfit: true,
      fluxShowInvoiced: true,
      fluxShowPending: true,
      fluxShowPurchases: true,
      fluxShowSalaries: true,
    };
  });

  const [kpiOrder, setKpiOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem("dashboard_kpi_order");
    return savedOrder ? JSON.parse(savedOrder) : ALL_KPI_IDS;
  });

  useEffect(() => {
    localStorage.setItem("dashboard_preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem("dashboard_kpi_order", JSON.stringify(kpiOrder));
  }, [kpiOrder]);

  const togglePreference = (key: keyof DashboardPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardContext.Provider value={{ preferences, togglePreference, kpiOrder, setKpiOrder }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};