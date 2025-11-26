"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionContextType {
    activeItem: string | undefined;
    setActiveItem: (value: string | undefined) => void;
}

const AccordionContext = React.createContext<AccordionContextType>({
    activeItem: undefined,
    setActiveItem: () => { },
});

interface AccordionProps {
    type?: "single" | "multiple";
    collapsible?: boolean;
    defaultValue?: string;
    children: React.ReactNode;
    className?: string;
}

export function Accordion({
    type = "single",
    collapsible = false,
    defaultValue,
    children,
    className = "",
}: AccordionProps) {
    const [activeItem, setActiveItem] = React.useState<string | undefined>(defaultValue);

    const handleSetActiveItem = (value: string | undefined) => {
        if (activeItem === value && collapsible) {
            setActiveItem(undefined);
        } else {
            setActiveItem(value);
        }
    };

    return (
        <AccordionContext.Provider value={{ activeItem, setActiveItem: handleSetActiveItem }}>
            <div className={className}>{children}</div>
        </AccordionContext.Provider>
    );
}

interface AccordionItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function AccordionItem({ value, children, className = "" }: AccordionItemProps) {
    return (
        <div className={`border-b border-gray-200 dark:border-gray-800 ${className}`}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { value });
                }
                return child;
            })}
        </div>
    );
}

interface AccordionTriggerProps {
    children: React.ReactNode;
    className?: string;
    value?: string; // Injected by AccordionItem
}

export function AccordionTrigger({ children, className = "", value }: AccordionTriggerProps) {
    const { activeItem, setActiveItem } = React.useContext(AccordionContext);
    const isOpen = activeItem === value;

    return (
        <button
            onClick={() => setActiveItem(value)}
            className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-left w-full ${className}`}
        >
            {children}
            <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
            />
        </button>
    );
}

interface AccordionContentProps {
    children: React.ReactNode;
    className?: string;
    value?: string; // Injected by AccordionItem
}

export function AccordionContent({ children, className = "", value }: AccordionContentProps) {
    const { activeItem } = React.useContext(AccordionContext);
    const isOpen = activeItem === value;

    if (!isOpen) return null;

    return (
        <div className={`overflow-hidden text-sm transition-all animate-in slide-in-from-top-1 duration-200 ${className}`}>
            <div className="pb-4 pt-0 text-gray-600 dark:text-gray-400">{children}</div>
        </div>
    );
}
