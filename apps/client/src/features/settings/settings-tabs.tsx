import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface SettingsTabsProps {
  defaultValue: string;
  isMobile?: boolean;
  children: ReactNode;
}

export function SettingsTabs({
  defaultValue,
  isMobile,
  children,
}: SettingsTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      orientation={isMobile ? "horizontal" : "vertical"}
      className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full h-auto gap-2 p-4`}
    >
      {children}
    </Tabs>
  );
}

interface SettingsTabsListProps {
  isMobile?: boolean;
  children: ReactNode;
}

export function SettingsTabsList({
  isMobile,
  children,
}: SettingsTabsListProps) {
  return (
    <TabsList
      className={`flex ${isMobile ? "flex-row" : "flex-col"} items-start self-start rounded-none border-l border-border bg-transparent p-0`}
    >
      {children}
    </TabsList>
  );
}

interface SettingsTabsTriggerProps {
  value: string;
  children: ReactNode;
}

export function SettingsTabsTrigger({
  value,
  children,
}: SettingsTabsTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
    >
      {children}
    </TabsTrigger>
  );
}

interface SettingsTabsContentProps {
  value: string;
  children: ReactNode;
}

export function SettingsTabsContent({
  value,
  children,
}: SettingsTabsContentProps) {
  return (
    <TabsContent value={value} className="w-full">
      {children}
    </TabsContent>
  );
}
