import React, { useContext, createContext } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <div className="w-full pb-4 mb-4 border-b flex items-center justify-between min-h-[64px]">
      {children}
    </div>
  );
}

export interface DefaultHeaderTitleProps {
  children: React.ReactNode;
}

export function DefaultHeaderTitle({ children }: DefaultHeaderTitleProps) {
  return (
    <h1 className="text-xl font-semibold flex items-center space-x-2">
      <SidebarTrigger />
      {children}
    </h1>
  );
}

const HeaderActionContext = createContext({ isInDropdown: false });

export interface HeaderActionProps {
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function HeaderAction({
  type,
  children,
  icon,
  onClick,
  className,
  disabled,
  variant,
}: HeaderActionProps) {
  const { isInDropdown } = useContext(HeaderActionContext);

  if (isInDropdown) {
    return (
      <DropdownMenuItem
        onClick={onClick}
        disabled={disabled}
        className={cn(
          className,
          variant === "destructive" && "text-destructive",
        )}
        onSelect={(e) => {
          e.preventDefault();
        }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      type={type}
      className={className}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
}

export function HeaderActions({ children }: { children: React.ReactNode }) {
  const actions = React.Children.toArray(children);

  if (!actions.length) return null;

  return (
    <div className="flex items-center space-x-2">
      {/* Always show first action */}
      <div className="flex">{actions[0]}</div>

      {/* Show second action on desktop only */}
      {actions.length > 1 && <div className="hidden md:flex">{actions[1]}</div>}

      {/* Show dropdown if there are additional actions */}
      {actions.length > 1 && (
        <div className={`md:${actions.length > 2 ? "flex" : "hidden"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <HeaderActionContext.Provider value={{ isInDropdown: true }}>
                {actions.slice(1).map((action, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={index} className={index === 0 ? "md:hidden" : ""}>
                    {action}
                  </div>
                ))}
              </HeaderActionContext.Provider>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
