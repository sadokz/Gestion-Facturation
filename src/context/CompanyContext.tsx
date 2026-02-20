import React, { createContext, useContext, useState, useEffect } from "react";

interface MyCompany {
  id: string;
  nom: string;
  matricule_fiscale?: string;
  rne?: string;
  gerant?: string;
  comptable?: string;
  adresse?: string;
  tel?: string;
  fax?: string;
  email?: string;
  website?: string;
  logo?: string;
  active: boolean; // Nouvel état
}

interface CompanyContextType {
  selectedCompany: MyCompany | null;
  setSelectedCompany: (company: MyCompany) => void;
  myCompanies: MyCompany[];
  addMyCompany: (company: MyCompany) => void;
  updateMyCompany: (company: MyCompany) => void;
  deleteMyCompany: (id: string) => void;
  toggleCompanyStatus: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myCompanies, setMyCompanies] = useState<MyCompany[]>(() => {
    const saved = localStorage.getItem("my_companies");
    if (saved) return JSON.parse(saved);
    return [{ 
      id: "1", 
      nom: "Bureau d'Études Principal", 
      matricule_fiscale: "1234567/A/M/000",
      rne: "1234567X",
      gerant: "M. Foulen Ben Foulen",
      comptable: "Cabinet Audit Plus",
      adresse: "Avenue Habib Bourguiba, Tunis",
      tel: "71 000 000",
      email: "contact@bureau-etudes.tn",
      website: "www.bureau-etudes.tn",
      active: true
    }];
  });

  const [selectedCompany, setSelectedCompanyState] = useState<MyCompany | null>(() => {
    const savedId = localStorage.getItem("selected_company_id");
    const found = myCompanies.find(c => c.id === savedId);
    return found || myCompanies[0] || null;
  });

  useEffect(() => {
    localStorage.setItem("my_companies", JSON.stringify(myCompanies));
  }, [myCompanies]);

  const setSelectedCompany = (company: MyCompany) => {
    setSelectedCompanyState(company);
    localStorage.setItem("selected_company_id", company.id);
  };

  const addMyCompany = (company: MyCompany) => {
    setMyCompanies(prev => [...prev, { ...company, active: true }]);
  };

  const updateMyCompany = (updated: MyCompany) => {
    setMyCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedCompany?.id === updated.id) {
      setSelectedCompanyState(updated);
    }
  };

  const deleteMyCompany = (id: string) => {
    if (myCompanies.length <= 1) return;
    const newCompanies = myCompanies.filter(c => c.id !== id);
    setMyCompanies(newCompanies);
    if (selectedCompany?.id === id) {
      setSelectedCompany(newCompanies[0]);
    }
  };

  const toggleCompanyStatus = (id: string) => {
    setMyCompanies(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, myCompanies, addMyCompany, updateMyCompany, deleteMyCompany, toggleCompanyStatus }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useMyCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useMyCompany must be used within a CompanyProvider");
  return context;
};