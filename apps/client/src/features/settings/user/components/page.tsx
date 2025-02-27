import { useIsMobile } from "@/hooks/use-mobile";
import {
  SettingsTabs,
  SettingsTabsContent,
  SettingsTabsList,
  SettingsTabsTrigger,
} from "../../settings-tabs";
import { ProfileCard } from "./profile-card";
import { Title } from "@/components/header";
import { useNavigate } from "@tanstack/react-router";

export interface UserSettingsPageProps {
  initialTab?: string;
}

export function UserSettingsPage({ initialTab }: UserSettingsPageProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  return (
    <>
      <Title>User Settings</Title>
      <SettingsTabs
        value={initialTab ?? "profile"}
        isMobile={isMobile}
        onValueChange={(value) =>
          navigate({
            to: "/user/settings",
            search: {
              tab: value,
            },
          })
        }
      >
        <SettingsTabsList>
          <SettingsTabsTrigger value="profile">Profile</SettingsTabsTrigger>
          <SettingsTabsTrigger value="projects">Projects</SettingsTabsTrigger>
          <SettingsTabsTrigger value="package">Packages</SettingsTabsTrigger>
        </SettingsTabsList>
        <div className="flex max-w-lg mx-auto w-full">
          <SettingsTabsContent value="profile">
            <ProfileCard />
          </SettingsTabsContent>
          <SettingsTabsContent value="projects">
            <p className="px-4 py-1.5 text-xs text-muted-foreground">
              Content for Tab 2
            </p>
          </SettingsTabsContent>
          <SettingsTabsContent value="package">
            <p className="px-4 py-1.5 text-xs text-muted-foreground">
              Content for Tab 3
            </p>
          </SettingsTabsContent>
        </div>
      </SettingsTabs>
    </>
  );
}
