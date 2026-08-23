"use client";

import * as React from "react";

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ open: false, setOpen: () => {} });

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block w-full">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { open, setOpen } = React.useContext(PopoverContext);

  return (
    <div onClick={() => setOpen(!open)} className="w-full cursor-pointer">
      {children}
    </div>
  );
}

export function PopoverContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { open } = React.useContext(PopoverContext);

  if (!open) return null;

  return (
    <div className={`absolute z-50 mt-2 bg-white rounded-md border shadow-md p-2 ${className}`}>
      {children}
    </div>
  );
}