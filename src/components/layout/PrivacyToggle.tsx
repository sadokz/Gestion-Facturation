import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrivacy } from "@/context/PrivacyContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const PrivacyToggle = () => {
  const { isPrivate, togglePrivacy } = usePrivacy();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={togglePrivacy}
        >
          {isPrivate ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{isPrivate ? "Afficher les données" : "Masquer les données"}</p>
      </TooltipContent>
    </Tooltip>
  );
};