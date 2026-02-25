import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Briefcase, ShoppingCart, LayoutDashboard, Search, Users, Building2, Banknote, ClipboardCheck, FileText, User, ShieldAlert, Activity } from "lucide-react";
import { useUser } from "@/context/UserContext";

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useUser();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  // Mock data pour la recherche
  const mockResults = {
    projects: [
      { id: 1, name: "Eclairage Avenue", ref: "PRJ-2026-001" },
      { id: 2, name: "Rénovation Pont", ref: "PRJ-2026-002" },
      { id: 3, name: "Audit STEG", ref: "PRJ-2026-003" },
    ],
    clients: [
      { id: 1, name: "Commune de Tunis" },
      { id: 2, name: "STEG" },
      { id: 3, name: "Ministère de l'Équipement" },
    ]
  };

  const filteredProjects = mockResults.projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.ref.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClients = mockResults.clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full md:w-96 flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200/70 border-transparent rounded-xl transition-all text-slate-400 text-sm group"
      >
        <Search size={16} className="group-hover:text-primary transition-colors" />
        <span>Rechercher un projet, client, employé...</span>
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Tapez pour rechercher..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          {search.length > 0 && (
            <>
              <CommandGroup heading="Projets">
                {filteredProjects.map(p => (
                  <CommandItem key={p.id} onSelect={() => runCommand(() => navigate(`/projects?search=${encodeURIComponent(p.name)}`))}>
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.ref}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Clients">
                {filteredClients.map(c => (
                  <CommandItem key={c.id} onSelect={() => runCommand(() => navigate(`/clients?search=${encodeURIComponent(c.name)}`))}>
                    <User className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>{c.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/technical-dashboard"))}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Dashboard Technique</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Projets & Ventes</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/project-tracking"))}>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              <span>Suivi Technique</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Clients</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/companies"))}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Entreprises</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/purchases"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Achats</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/salaries"))}>
              <Banknote className="mr-2 h-4 w-4" />
              <span>Salaires</span>
            </CommandItem>
            {currentUser.isSuperAdmin && (
              <CommandItem onSelect={() => runCommand(() => navigate("/super-admin"))}>
                <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
                <span>Super Admin</span>
              </CommandItem>
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions Rapides">
            <CommandItem onSelect={() => runCommand(() => navigate("/projects?new=true"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Nouveau Projet</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/salaries?new=true"))}>
              <Banknote className="mr-2 h-4 w-4" />
              <span>Nouvel Employé</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};