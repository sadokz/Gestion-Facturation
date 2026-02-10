import React, { createContext, useContext, useState, useEffect } from "react";

interface PrivacyContextType {
  isPrivate: boolean;
  togglePrivacy: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPrivate, setIsPrivate] = useState(() => {
    const saved = localStorage.getItem("app_privacy_mode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("app_privacy_mode", isPrivate.toString());
  }, [isPrivate]);

  const togglePrivacy = () => setIsPrivate(!isPrivate);

  return (
    <PrivacyContext.Provider value={{ isPrivate, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) throw new Error("usePrivacy must be used within a PrivacyProvider");
  return context;
};