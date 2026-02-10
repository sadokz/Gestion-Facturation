import React, { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ResizableHeaderProps {
  children?: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  resizable?: boolean;
  className?: string;
  sortKey?: string;
  currentSort?: { key: string; direction: 'asc' | 'desc' | null };
  onSort?: (key: string) => void;
}

export const ResizableHeader: React.FC<ResizableHeaderProps> = ({
  children,
  initialWidth = 150,
  minWidth = 50,
  resizable = true,
  className,
  sortKey,
  currentSort,
  onSort,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    
    const startX = e.pageX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = Math.max(minWidth, startWidth + (moveEvent.pageX - startX));
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [width, minWidth]);

  return (
    <th
      className={cn(
        "relative border-r border-slate-200 bg-slate-50/50 p-0 text-left align-middle font-bold text-slate-500 transition-colors hover:bg-slate-100/80",
        className
      )}
      style={{ 
        width: `${width}px`, 
        minWidth: `${width}px`, 
        maxWidth: `${width}px`,
        boxSizing: 'border-box'
      }}
    >
      <div 
        className={cn(
          "flex items-center gap-2 px-4 py-3 h-full w-full",
          sortKey && "cursor-pointer select-none"
        )}
        onClick={() => sortKey && onSort?.(sortKey)}
      >
        <span className="truncate flex-1">{children}</span>
        {sortKey && currentSort?.key === sortKey && (
          <span className="text-primary shrink-0">
            {currentSort.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        )}
      </div>
      
      {resizable && (
        <div
          onMouseDown={startResizing}
          className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-primary/30 active:bg-primary transition-colors z-10"
        />
      )}
    </th>
  );
};