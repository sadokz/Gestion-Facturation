import React, { useState, useCallback } from "react";
import { TableHead } from "./table";
import { cn } from "@/lib/utils";

interface ResizableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  onResize?: (width: number) => void;
  initialWidth?: number;
  minWidth?: number;
}

export const ResizableHeader: React.FC<ResizableHeaderProps> = ({ 
  children, 
  onResize, 
  initialWidth = 150, 
  minWidth = 50,
  className,
  style,
  ...props 
}) => {
  const [width, setWidth] = useState(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <TableHead 
      className={cn("relative group select-none overflow-hidden", className)} 
      style={{ ...style, width: `${width}px`, minWidth: `${width}px` }}
      {...props}
    >
      <div className="truncate pr-2">
        {children}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent group-hover:bg-primary/20 transition-colors z-10"
      />
    </TableHead>
  );
};