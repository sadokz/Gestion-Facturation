import React, { createContext, useContext, useState, useEffect } from "react";

export interface Role {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
}

interface RoleContextType {
  roles: Role[];
  addRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (id: string) => void;
}

const DEFAULT_ROLES: Role[] = [
  {
    id: "gerant",
    name: "Gérant",
    permissions: {
      dashboard: true, technicalDashboard: true, projects: true, projectTracking: true, clients: true,
      companies: true, purchases: true, salaries: true, hr: true,
      cnss: true, accounting: true, settings: true
    }
  },
  {
    id: "resp_technique",
    name: "Responsable Technique",
    permissions: {
      dashboard: true, technicalDashboard: true, projects: true, projectTracking: true, clients: true,
      companies: true, purchases: false, salaries: false, hr: false,
      cnss: false, accounting: false, settings: false
    }
  },
  {
    id: "resp_direction",
    name: "Responsable Direction",
    permissions: {
      dashboard: true, technicalDashboard: false, projects: false, projectTracking: false, clients: true,
      companies: true, purchases: true, salaries: false, hr: true,
      cnss: false, accounting: false, settings: false
    }
  }
];

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem("app_roles");
    return saved ? JSON.parse(saved) : DEFAULT_ROLES;
  });

  useEffect(() => {
    localStorage.setItem("app_roles", JSON.stringify(roles));
  }, [roles]);

  const addRole = (role: Role) => setRoles(prev => [...prev, role]);
  const updateRole = (updated: Role) => setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
  const deleteRole = (id: string) => setRoles(prev => prev.filter(r => r.id !== id));

  return (
    <RoleContext.Provider value={{ roles, addRole, updateRole, deleteRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRoles must be used within a RoleProvider");
  return context;
};