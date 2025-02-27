import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";

// Create a context to share the isMobile state
const SettingsTabsContext = createContext<{ isMobile: boolean }>({
  isMobile: false,
});

export const SettingsTabs = React.forwardRef<
  React.ComponentRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs> & {
    isMobile?: boolean;
  }
>(({ className, isMobile = false, children, ...props }, ref) => {
  return (
    <SettingsTabsContext.Provider value={{ isMobile }}>
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        ref={ref}
        className={cn(
          `flex ${isMobile ? "flex-col" : "flex-row"} h-auto gap-2 p-4`,
          className,
        )}
        {...props}
      >
        {children}
      </Tabs>
    </SettingsTabsContext.Provider>
  );
});

SettingsTabs.displayName = "SettingsTabs";

interface SettingsTabsListProps {
  children: ReactNode;
  className?: string;
}

export function SettingsTabsList({
  children,
  className,
}: SettingsTabsListProps) {
  const { isMobile } = useContext(SettingsTabsContext);

  return (
    <div
      className={cn(
        isMobile && "overflow-x-auto custom-scrollbar scroll-smooth",
      )}
    >
      <TabsList
        className={cn(
          "flex items-start self-start rounded-none",
          isMobile
            ? "flex-row border-b border-border bg-transparent py-0 min-w-max scroll-snap-x"
            : "flex-col border-l border-border bg-transparent p-0",
          className,
        )}
      >
        {children}
      </TabsList>
    </div>
  );
}

interface SettingsTabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function SettingsTabsTrigger({
  value,
  children,
  className,
}: SettingsTabsTriggerProps) {
  const { isMobile } = useContext(SettingsTabsContext);

  return (
    <TabsTrigger
      value={value}
      className={cn(
        "relative justify-start rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none shrink-0",
        isMobile
          ? "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:after:bg-primary px-4 py-2"
          : "after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:after:bg-primary w-full",
        className,
      )}
    >
      {children}
    </TabsTrigger>
  );
}

interface SettingsTabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function SettingsTabsContent({
  value,
  children,
  className,
}: SettingsTabsContentProps) {
  const { isMobile } = useContext(SettingsTabsContext);

  return (
    <TabsContent
      value={value}
      className={cn(
        "w-full",
        isMobile && "max-h-screen overflow-y-auto no-scrollbar",
        className,
      )}
    >
      {children}
    </TabsContent>
  );
}

export function createStyleSheet() {
  return `
    .no-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `;
}
