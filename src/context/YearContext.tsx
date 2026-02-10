import React, { createContext, useContext, useState, useEffect } from "react";

interface YearContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  addYear: (year: number) => void;
  deleteYear: (year: number) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(() => {
    const saved = localStorage.getItem("selected_year");
    return saved ? parseInt(saved) : new Date().getFullYear();
  });

  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const saved = localStorage.getItem("available_years");
    if (saved) return JSON.parse(saved);
    // Par défaut, les 5 dernières années
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i).sort((a, b) => b - a);
  });

  useEffect(() => {
    localStorage.setItem("selected_year", selectedYear.toString());
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem("available_years", JSON.stringify(availableYears));
  }, [availableYears]);

  const addYear = (year: number) => {
    if (!availableYears.includes(year)) {
      setAvailableYears(prev => [...prev, year].sort((a, b) => b - a));
    }
  };

  const deleteYear = (year: number) => {
    if (availableYears.length <= 1) return; // Garder au moins une année
    setAvailableYears(prev => prev.filter(y => y !== year));
    if (selectedYear === year) {
      setSelectedYear(availableYears.find(y => y !== year) || new Date().getFullYear());
    }
  };

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, availableYears, addYear, deleteYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) throw new Error("useYear must be used within a YearProvider");
  return context;
};