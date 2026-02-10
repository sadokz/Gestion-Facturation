import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardPreferences {
  totalContractsHT: boolean; // New individual preference
  totalInvoicedHT: boolean;  // New individual preference
  totalRemainingHT: boolean; // New individual preference
  totalPurchasesHT: boolean; // New individual preference
  showMonthlyFlux: boolean;
  showProjectStatus: boolean;
  showRecentActivity: boolean;
  showTopClients: boolean;
  showTotalCnssPaid: boolean;
  showTotalSalaries: boolean;
  showTotalRevenue: boolean;
  showTotalProfit: boolean;
}

// Define all possible KPI IDs for ordering
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
  kpiOrder: string[]; // Store the order of KPI IDs
  setKpiOrder: (order: string[]) => void; // Function to update KPI order
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem("dashboard_preferences");
    return saved ? JSON.parse(saved) : {
      totalContractsHT: true, // Default to true
      totalInvoicedHT: true,  // Default to true
      totalRemainingHT: true, // Default to true
      totalPurchasesHT: true, // Default to true
      showMonthlyFlux: true,
      showProjectStatus: true,
      showRecentActivity: true,
      showTopClients: true,
      showTotalCnssPaid: true,
      showTotalSalaries: true,
      showTotalRevenue: true,
      showTotalProfit: true,
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