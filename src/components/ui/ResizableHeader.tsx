import React, { useState, useCallback } from "react";
import { TableHead } from "./table";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface ResizableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  onResize?: (width: number) => void;
  initialWidth?: number;
  minWidth?: number;
  sortKey?: string;
  currentSort?: { key: string; direction: 'asc' | 'desc' | null };
  onSort?: (key: string) => void;
}

export const ResizableHeader: React.FC<ResizableHeaderProps> = ({ 
  children, 
  onResize, 
  initialWidth = 150, 
  minWidth = 50,
  className,
  style,
  sortKey,
  currentSort,
  onSort,
  ...props 
}) => {
  const [width, setWidth] = useState(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + (moveEvent.pageX - startX));
      setWidth(newWidth);
      if (onResize) onResize(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [width, minWidth, onResize]);

  const isSorted = currentSort?.key === sortKey;
  const direction = isSorted ? currentSort?.direction : null;

  return (
    <TableHead 
      className={cn(
        "relative group select-none overflow-hidden", 
        onSort && sortKey && "cursor-pointer hover:bg-slate-100/80 transition-colors",
        className
      )} 
      style={{ ...style, width: `${width}px`, minWidth: `${width}px` }}
      onClick={() => onSort && sortKey && onSort(sortKey)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 pr-2">
        <div className="truncate font-bold text-slate-700">
          {children}
        </div>
        {onSort && sortKey && (
          <div className="shrink-0 text-slate-400">
            {direction === 'asc' ? (
              <ArrowUp size={14} className="text-primary" />
            ) : direction === 'desc' ? (
              <ArrowDown size={14} className="text-primary" />
            ) : (
              <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>
      <div
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent group-hover:bg-primary/20 transition-colors z-10"
      />
    </TableHead>
  );
};