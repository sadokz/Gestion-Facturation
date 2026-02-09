import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface Column {
  id: string;
  label: string;
}

interface ColumnToggleProps {
  columns: Column[];
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({ columns, visibleColumns, onToggle }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-200">
          <MoreVertical size={16} className="text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-200">
        <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Colonnes à afficher
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize cursor-pointer"
            checked={visibleColumns.includes(column.id)}
            onCheckedChange={() => onToggle(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};