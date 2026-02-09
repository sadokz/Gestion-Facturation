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
import { Briefcase, ShoppingCart, LayoutDashboard, Search } from "lucide-react";

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full md:w-96 flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200/70 border-transparent rounded-xl transition-all text-slate-400 text-sm group"
      >
        <Search size={16} className="group-hover:text-primary transition-colors" />
        <span>Rechercher un projet, client...</span>
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez pour rechercher..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Projets & Ventes</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/purchases"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Achats</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions Rapides">
            <CommandItem onSelect={() => runCommand(() => navigate("/projects?new=true"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Nouveau Projet</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/purchases?new=true"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Nouvel Achat</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};