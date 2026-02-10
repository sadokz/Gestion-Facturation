import React, { useState, useEffect, useRef } from "react";
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
}

export const ResizableHeader: React.FC<ResizableHeaderProps> = ({
  children,
  initialWidth = 150,
  minWidth = 50,
  className,
  sortKey,
  currentSort,
  onSort,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = Math.max(minWidth, e.clientX - (e.target as HTMLElement).getBoundingClientRect().left);
    // Note: This is a simplified resize logic for the demo
    // In a real table, we'd need the starting X and current width
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const SortIcon = () => {
    if (!sortKey || !currentSort || currentSort.key !== sortKey) return <ArrowUpDown size={12} className="ml-2 opacity-30" />;
    if (currentSort.direction === 'asc') return <ChevronUp size={14} className="ml-2 text-primary" />;
    if (currentSort.direction === 'desc') return <ChevronDown size={14} className="ml-2 text-primary" />;
    return <ArrowUpDown size={12} className="ml-2 opacity-30" />;
  };

  return (
    <TableHead
      style={{ width: `${width}px` }}
      className={cn(
        "relative h-12 px-4 text-left align-middle font-bold text-slate-700 bg-slate-50/50 border-r border-slate-200 last:border-r-0 transition-colors",
        sortKey && "cursor-pointer hover:bg-slate-100/80",
        className
      )}
      onClick={() => sortKey && onSort?.(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span className="truncate uppercase tracking-wider text-[10px]">{children}</span>
        {sortKey && <SortIcon />}
      </div>
      
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-10"
      />
    </TableHead>
  );
};