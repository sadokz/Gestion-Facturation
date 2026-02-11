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
  fluxShowInvoiced: boolean;
  fluxShowPending: boolean;
  fluxShowPurchases: boolean;
  fluxShowSalaries: boolean;
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
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

const ALL_MAIN_SECTION_IDS = [
  "monthlyFlux",
  "projectStatus",
  "recentActivity",
  "topClients",
];

type SectionWidth = "25" | "50" | "75" | "100";

interface DashboardContextType {
  preferences: DashboardPreferences;
  togglePreference: (key: keyof DashboardPreferences) => void;
  resetPreferences: () => void;
  kpiOrder: string[];
  setKpiOrder: (order: string[]) => void;
  mainSectionOrder: string[];
  setMainSectionOrder: (order: string[]) => void;
  sectionWidths: Record<string, SectionWidth>;
  setSectionWidth: (id: string, width: SectionWidth) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem("dashboard_preferences");
    if (!saved) return DEFAULT_PREFERENCES;
    try {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [kpiOrder, setKpiOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem("dashboard_kpi_order");
    return savedOrder ? JSON.parse(savedOrder) : ALL_KPI_IDS;
  });

  const [mainSectionOrder, setMainSectionOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem("dashboard_main_section_order");
    return savedOrder ? JSON.parse(savedOrder) : ALL_MAIN_SECTION_IDS;
  });

  const [sectionWidths, setSectionWidths] = useState<Record<string, SectionWidth>>(() => {
    const saved = localStorage.getItem("dashboard_section_widths");
    return saved ? JSON.parse(saved) : {
      monthlyFlux: "50",
      projectStatus: "50",
      recentActivity: "50",
      topClients: "50",
    };
  });

  useEffect(() => {
    localStorage.setItem("dashboard_preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem("dashboard_kpi_order", JSON.stringify(kpiOrder));
  }, [kpiOrder]);

  useEffect(() => {
    localStorage.setItem("dashboard_main_section_order", JSON.stringify(mainSectionOrder));
  }, [mainSectionOrder]);

  useEffect(() => {
    localStorage.setItem("dashboard_section_widths", JSON.stringify(sectionWidths));
  }, [sectionWidths]);

  const togglePreference = (key: keyof DashboardPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setSectionWidth = (id: string, width: SectionWidth) => {
    setSectionWidths(prev => ({ ...prev, [id]: width }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setKpiOrder(ALL_KPI_IDS);
    setMainSectionOrder(ALL_MAIN_SECTION_IDS);
    setSectionWidths({
      monthlyFlux: "50",
      projectStatus: "50",
      recentActivity: "50",
      topClients: "50",
    });
  };

  return (
    <DashboardContext.Provider value={{ 
      preferences, 
      togglePreference, 
      resetPreferences, 
      kpiOrder, 
      setKpiOrder,
      mainSectionOrder,
      setMainSectionOrder,
      sectionWidths,
      setSectionWidth
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};