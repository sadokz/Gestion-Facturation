import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string | number;
  nom: string;
  email: string;
  poste: string;
  avatar: string;
  isSuperAdmin?: boolean;
  allowedCompanies: string[];
  permissions: Record<string, boolean>;
  statut: string;
}

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
  suspendUsersForCompany: (companyId: string) => void;
}

const DEFAULT_USERS: User[] = [
  { 
    id: "super-admin", 
    nom: "Super Admin", 
    email: "superadmin@system.tn", 
    poste: "Super Administrateur", 
    avatar: "Jack",
    isSuperAdmin: true,
    allowedCompanies: ["1"],
    statut: "Actif",
    permissions: { 
      dashboard: true, projects: true, projectTracking: true, clients: true, 
      companies: true, purchases: true, salaries: true, hr: true, 
      cnss: true, accounting: true, settings: true 
    }
  },
  { 
    id: 1, 
    nom: "Ahmed Ingénieur", 
    email: "ahmed@bureau.tn", 
    poste: "Ingénieur Principal", 
    avatar: "Felix",
    allowedCompanies: ["1"],
    statut: "Actif",
    permissions: { 
      dashboard: true, projects: true, projectTracking: true, clients: true, 
      companies: true, purchases: false, salaries: false, hr: false, 
      cnss: false, accounting: false, settings: false 
    }
  },
  { 
    id: 2, 
    nom: "Sarra Secrétaire", 
    email: "sarra@bureau.tn", 
    poste: "Secrétaire", 
    avatar: "Sophie",
    allowedCompanies: ["1"],
    statut: "Actif",
    permissions: { 
      dashboard: true, projects: false, projectTracking: false, clients: true, 
      companies: true, purchases: true, salaries: false, hr: true, 
      cnss: false, accounting: false, settings: false 
    }
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("app_users");
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem("current_user_id");
    return allUsers.find(u => u.id.toString() === savedId) || allUsers[0];
  });

  useEffect(() => {
    localStorage.setItem("app_users", JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem("current_user_id", currentUser.id.toString());
  }, [currentUser]);

  const suspendUsersForCompany = (companyId: string) => {
    setAllUsers(prev => prev.map(user => {
      // On ne suspend jamais un Super Admin
      if (user.isSuperAdmin) return user;
      
      // Si l'utilisateur n'a accès qu'à CETTE entité (longueur 1 et ID correspondant)
      if (user.allowedCompanies.length === 1 && user.allowedCompanies[0] === companyId) {
        return { ...user, statut: "Suspendu" };
      }
      return user;
    }));
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, allUsers, setAllUsers, suspendUsersForCompany }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};