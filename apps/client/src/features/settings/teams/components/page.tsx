import {
  SettingsTabs,
  SettingsTabsContent,
  SettingsTabsList,
  SettingsTabsTrigger,
} from "../../settings-tabs";
import { Title } from "@/components/header";
import { useTRPC } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { MemberManagement } from "../../member-management";
import { useNavigate } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";

export interface TeamSettingsPageProps {
  initialTab?: string;
  team: {
    id: string;
    name: string;
    slug: string;
  };
  organization: {
    id: string;
  };
}

export function TeamSettingsPage({
  initialTab,
  team,
  organization,
}: TeamSettingsPageProps) {
  const trpc = useTRPC();
  const teamMembersQuery = useQuery(
    trpc.team.getById.queryOptions(
      {
        id: team.id,
      },
      {
        select: (data) => ({
          users: data.members.map((member) => ({
            id: member.id,
            name: member.user.name,
            email: member.user.email,
            role: member.role,
          })),
        }),
      },
    ),
  );

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <>
      <Title>{`${team.name} Settings`}</Title>
      <SettingsTabs
        value={initialTab ?? "general"}
        isMobile={isMobile}
        onValueChange={(value) =>
          navigate({
            to: "/organizations/$organizationId/teams/$teamId/settings",
            params: { organizationId: organization.id, teamId: team.id },
            search: {
              tab: value,
            },
          })
        }
      >
        <SettingsTabsList>
          <SettingsTabsTrigger value="general">General</SettingsTabsTrigger>
          <SettingsTabsTrigger value="members">Members</SettingsTabsTrigger>
        </SettingsTabsList>
        <div className="flex max-w-lg mx-auto w-full">
          <SettingsTabsContent value="general">General</SettingsTabsContent>
          <SettingsTabsContent value="members">
            <MemberManagement
              query={teamMembersQuery}
              addMemberParams={{
                organizationId: organization.id,
                teamId: team.id,
              }}
            />
          </SettingsTabsContent>
        </div>
      </SettingsTabs>
    </>
  );
}
