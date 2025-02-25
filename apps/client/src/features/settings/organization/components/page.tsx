import { useIsMobile } from "@/hooks/use-mobile";
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

export interface OrganizationSettingsPageProps {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function OrganizationSettingsPage({
  organization,
}: OrganizationSettingsPageProps) {
  const isMobile = useIsMobile();
  const trpc = useTRPC();
  const orgMembersQuery = useQuery(
    trpc.organization.getMembers.queryOptions({
      organizationId: organization.id,
    }),
  );

  return (
    <>
      <Title>{`${organization.name} Settings`}</Title>
      <SettingsTabs defaultValue="tab-1" isMobile={isMobile}>
        <SettingsTabsList>
          <SettingsTabsTrigger value="tab-1">General</SettingsTabsTrigger>
          <SettingsTabsTrigger value="tab-2">Members</SettingsTabsTrigger>
          <SettingsTabsTrigger value="tab-3">Teams</SettingsTabsTrigger>
        </SettingsTabsList>
        <div className="flex max-w-lg mx-auto w-full">
          <SettingsTabsContent value="tab-1">
            <div className="flex flex-col gap-4">
              <OrganizationManage organization={organization} />
              <OrganizationDelete organization={organization} />
            </div>
          </SettingsTabsContent>
          <SettingsTabsContent value="tab-2">
            <MemberManagement query={orgMembersQuery} />
          </SettingsTabsContent>
          <SettingsTabsContent value="tab-3">
            <div className="flex flex-col gap-4">
              <TeamList />
            </div>
          </SettingsTabsContent>
        </div>
      </SettingsTabs>
    </>
  );
}
