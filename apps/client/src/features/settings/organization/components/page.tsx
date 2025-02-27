import {
  SettingsTabs,
  SettingsTabsContent,
  SettingsTabsList,
  SettingsTabsTrigger,
} from "../../settings-tabs";
import { OrganizationDelete } from "./organization-delete";
import { OrganizationManage } from "./organization-management";
import { Title } from "@/components/header";
import { useTRPC } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { MemberManagement } from "../../member-management";
import { TeamList } from "./team-list";
import { useNavigate } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";

export interface OrganizationSettingsPageProps {
  initialTab?: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function OrganizationSettingsPage({
  initialTab,
  organization,
}: OrganizationSettingsPageProps) {
  const trpc = useTRPC();
  const orgMembersQuery = useQuery(
    trpc.organization.getMembers.queryOptions({
      organizationId: organization.id,
    }),
  );
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <>
      <Title>{`${organization.name} Settings`}</Title>
      <SettingsTabs
        value={initialTab ?? "general"}
        isMobile={isMobile}
        onValueChange={(value) =>
          navigate({
            to: "/organizations/$organizationId/settings",
            params: { organizationId: organization.id },
            search: {
              tab: value,
            },
          })
        }
      >
        <SettingsTabsList>
          <SettingsTabsTrigger value="general">General</SettingsTabsTrigger>
          <SettingsTabsTrigger value="members">Members</SettingsTabsTrigger>
          <SettingsTabsTrigger value="teams">Teams</SettingsTabsTrigger>
        </SettingsTabsList>
        <div className="flex max-w-lg mx-auto w-full">
          <SettingsTabsContent value="general">
            <div className="flex flex-col gap-4">
              <OrganizationManage organization={organization} />
              <OrganizationDelete organization={organization} />
            </div>
          </SettingsTabsContent>
          <SettingsTabsContent value="members">
            <MemberManagement query={orgMembersQuery} />
          </SettingsTabsContent>
          <SettingsTabsContent value="teams">
            <div className="flex flex-col gap-4">
              <TeamList />
            </div>
          </SettingsTabsContent>
        </div>
      </SettingsTabs>
    </>
  );
}
