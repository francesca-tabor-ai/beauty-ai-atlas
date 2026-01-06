"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  children: React.ReactNode;
  className?: string;
}

const AccordionContext = React.createContext<{
  type: "single" | "multiple";
  openItems: Set<string>;
  toggleItem: (value: string) => void;
}>({
  type: "single",
  openItems: new Set(),
  toggleItem: () => {},
});

export function Accordion({
  type = "single",
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    if (type === "single") {
      return new Set([defaultValue as string]);
    }
    return new Set(defaultValue as string[]);
  });

  const toggleItem = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (type === "single") {
          if (next.has(value)) {
            return new Set();
          }
          return new Set([value]);
        } else {
          if (next.has(value)) {
            next.delete(value);
          } else {
            next.add(value);
          }
          return next;
        }
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ type, openItems, toggleItem }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const isOpen = openItems.has(value);

  React.useEffect(() => {
    if (defaultOpen && !isOpen) {
      toggleItem(value);
    }
  }, [defaultOpen, value, isOpen, toggleItem]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => toggleItem(value)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t bg-muted/30">
          {children}
        </div>
      )}
    </div>
  );
}

