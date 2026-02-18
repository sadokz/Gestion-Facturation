import React from "react";
import { User, MoreHorizontal, Edit, Trash2, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 overflow-hidden">
              {user.avatar ? (
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} 
                  alt={user.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={24} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-800">{user.nom}</h4>
                {user.poste === "Proprietaire" && (
                  <ShieldCheck size={14} className="text-amber-500" />
                )}
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                <Building2 size={12} />
                {user.allowedCompanies?.length || 0} Entité(s)
              </div>
              <Badge variant="outline" className={cn(
                "text-[9px] h-4 px-1.5",
                user.statut === "Actif" ? "text-emerald-600 border-emerald-100 bg-emerald-50" : "text-slate-400"
              )}>
                {user.statut}
              </Badge>
            </div>

            <div className="text-right hidden sm:block min-w-[100px]">
              <p className="text-xs font-bold text-slate-700">{user.poste}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onEdit(user)}>
                  <Edit size={14} /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => onDelete(user)}>
                  <Trash2 size={14} /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};