import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserManagementMutations } from "@/features/auth/api/mutations";
import { authClient, useTRPC } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRightIcon,
  AudioWaveform,
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  FileStackIcon,
  GalleryVerticalEnd,
  InboxIcon,
  LogOut,
  ToyBrickIcon,
} from "lucide-react";
import { RiHome6Line, RiSettings3Line } from "@remixicon/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useNotifications } from "@/features/notifications/hooks/notification-provider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const trpc = useTRPC();
  const teamsQuery = useQuery(
    trpc.team.getAll.queryOptions(
      {
        filter: {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          organizationId: authClient.useActiveOrganization().data?.id!,
        },
      },
      {
        enabled: !!authClient.useActiveOrganization().data?.id,
      },
    ),
  );

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: RiHome6Line,
      },
      {
        title: "Resources",
        url: "/resources",
        icon: FileStackIcon,
        items: [
          {
            title: "All",
            url: "/resources",
          },
          ...(teamsQuery.data?.flatMap((data) => ({
            title: data.name,
            url: `/resources?team=${data.slug}`,
          })) ?? []), // Ensure it's an array even if data is undefined
        ],
      },
      {
        title: "Playground",
        url: "/playground",
        icon: ToyBrickIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgPopout />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const currentPath = useLocation().pathname;
  const { unreadCount, isLoading } = useNotifications();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.items) {
            return (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={currentPath === item.url}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link to={subItem.url}>
                            <SidebarMenuSubButton asChild>
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <Link to={item.url} key={item.url}>
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton isActive={currentPath === item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        })}

        <Link to="/inbox">
          <SidebarMenuItem>
            <SidebarMenuButton>
              <InboxIcon />
              <span>Inbox</span>

              <SidebarMenuBadge>
                {isLoading ? (
                  <span className="h-2 w-2 animate-pulse bg-white rounded-full" />
                ) : (
                  unreadCount && unreadCount
                )}
              </SidebarMenuBadge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function OrgPopout() {
  const { isMobile } = useSidebar();
  const activeOrganization = authClient.useActiveOrganization();
  const [activeTeam] = useState({
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex gap-2 items-center">
                <div className="flex -space-x-4 *:ring *:ring-background">
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt={activeOrganization.data?.name} />
                    <AvatarFallback className="rounded-lg">
                      {activeOrganization.data?.slug}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt={activeTeam.name} />
                    <AvatarFallback className="rounded-lg">
                      {activeTeam.name}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {activeOrganization.data?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activeTeam.name}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <Link
              to="/organizations/$organizationSlug/settings"
              params={{ organizationSlug: activeOrganization.data?.slug ?? "" }}
            >
              <DropdownMenuItem className="gap-2 p-2 w-full">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <RiSettings3Line className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Organization Settings
                </div>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link to="/auth/orgs">
              <DropdownMenuItem className="gap-2 p-2 w-full">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <ArrowLeftRightIcon className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Change organization
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const activeSession = authClient.useSession();
  const navigate = useNavigate();
  const logOutMutation = useMutation({
    mutationKey: ["auth", "signOut"],
    mutationFn: useUserManagementMutations().signOut,
    onSuccess: () => {
      toast.success("You have been logged out successfully");
      navigate({ to: "/" });
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-6 w-6 rounded-lg">
                <AvatarImage
                  src={user.avatar}
                  alt={activeSession.data?.user.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeSession.data?.user.name}
                </span>
                <span className="truncate text-xs">
                  {activeSession.data?.user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar}
                    alt={activeSession.data?.user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeSession.data?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeSession.data?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/user/settings" className="flex items-center gap-2">
                <DropdownMenuItem className="gap-2 p-2 w-full">
                  <RiSettings3Line className="size-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logOutMutation.mutate()}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
