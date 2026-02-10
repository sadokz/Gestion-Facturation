import React, { useState, useRef, useEffect } from "react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

interface ResizableHeaderProps {
  children?: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  className?: string;
  sortKey?: string;
  currentSort?: { key: string; direction: 'asc' | 'desc' | null };
  onSort?: (key: string) => void;
  resizable?: boolean;
}

export const ResizableHeader: React.FC<ResizableHeaderProps> = ({
  children,
  initialWidth = 150,
  minWidth = 50,
  className,
  sortKey,
  currentSort,
  onSort,
  resizable = true,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    // Empêcher la sélection de texte pendant le redimensionnement
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(minWidth, startWidth.current + deltaX);
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  const SortIcon = () => {
    if (!sortKey || !currentSort || currentSort.key !== sortKey) return <ArrowUpDown size={12} className="ml-2 opacity-30" />;
    if (currentSort.direction === 'asc') return <ChevronUp size={14} className="ml-2 text-primary" />;
    if (currentSort.direction === 'desc') return <ChevronDown size={14} className="ml-2 text-primary" />;
    return <ArrowUpDown size={12} className="ml-2 opacity-30" />;
  };

  return (
    <TableHead
      style={{ 
        width: `${width}px`, 
        minWidth: resizable ? `${minWidth}px` : `${initialWidth}px`,
        maxWidth: !resizable ? `${initialWidth}px` : undefined
      }}
      className={cn(
        "relative h-12 px-3 text-left align-middle font-bold text-slate-700 bg-slate-50/50 border-r border-slate-200 last:border-r-0 transition-colors",
        sortKey && "cursor-pointer hover:bg-slate-100/80",
        className
      )}
      onClick={() => sortKey && onSort?.(sortKey)}
    >
      <div className="flex items-center justify-between overflow-hidden">
        <span className="truncate uppercase tracking-wider text-[10px]">{children}</span>
        {sortKey && <SortIcon />}
      </div>
      
      {resizable && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/40 transition-colors z-20"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </TableHead>
  );
};