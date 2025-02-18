import { useIsMobile } from "@/hooks/use-mobile";
import {
  SettingsTabs,
  SettingsTabsContent,
  SettingsTabsList,
  SettingsTabsTrigger,
} from "../../settings-tabs";
import { ProfileCard } from "./profile-card";

export function UserSettingsPage() {
  const isMobile = useIsMobile();
  return (
    <>
      <h2>Settings</h2>
      <SettingsTabs defaultValue="tab-1" isMobile={isMobile}>
        <SettingsTabsList>
          <SettingsTabsTrigger value="tab-1">Profile</SettingsTabsTrigger>
          <SettingsTabsTrigger value="tab-2">Projects</SettingsTabsTrigger>
          <SettingsTabsTrigger value="tab-3">Packages</SettingsTabsTrigger>
        </SettingsTabsList>
        <div className="flex max-w-lg mx-auto w-full">
          <SettingsTabsContent value="tab-1">
            <ProfileCard />
          </SettingsTabsContent>
          <SettingsTabsContent value="tab-2">
            <p className="px-4 py-1.5 text-xs text-muted-foreground">
              Content for Tab 2
            </p>
          </SettingsTabsContent>
          <SettingsTabsContent value="tab-3 ">
            <p className="px-4 py-1.5 text-xs text-muted-foreground">
              Content for Tab 3
            </p>
          </SettingsTabsContent>
        </div>
      </SettingsTabs>
    </>
  );
}
