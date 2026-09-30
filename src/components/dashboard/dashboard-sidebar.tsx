"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FileText,
  GalleryVerticalEnd,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  Settings,
  Share2,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    label: "Main",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Portfolio",
    items: [
      {
        title: "Hero",
        href: "/dashboard/hero",
        icon: Home,
      },
      {
        title: "About",
        href: "/dashboard/about",
        icon: UserRound,
      },
      {
        title: "Experience",
        href: "/dashboard/experience",
        icon: BriefcaseBusiness,
      },
      {
        title: "Education",
        href: "/dashboard/education",
        icon: GraduationCap,
      },
      {
        title: "Skills",
        href: "/dashboard/skills",
        icon: Wrench,
      },
      {
        title: "Gallery",
        href: "/dashboard/gallery",
        icon: GalleryVerticalEnd,
      },
      {
        title: "Certificates",
        href: "/dashboard/certificates",
        icon: Award,
      },
    ],
  },
{
  label: "Communication",
  items: [
    {
      title: "Contact",
      href: "/dashboard/contact",
      icon: Phone,
    },
    {
      title: "Social Links",
      href: "/dashboard/social-links",
      icon: Share2,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: Mail,
    },
  ],
},
  {
    label: "Settings",
    items: [
      {
        title: "Site Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "CV",
        href: "/dashboard/cv",
        icon: FileText,
      },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/60 bg-background"
    >
      {/* Brand */}
      <SidebarHeader className="border-b border-border/60 p-3">
        <div
          className={`flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-3 shadow-sm ${
            state === "collapsed" ? "justify-center px-2" : ""
          }`}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            LG
          </div>

          {state === "expanded" && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Lami Gudisa
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Portfolio CMS
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        {navigation.map((group) => (
          <SidebarGroup key={group.label} className="px-1 py-1">
            <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(`${item.href}/`));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        onClick={() => router.push(item.href)}
                        className={`
                          h-10 rounded-xl px-3
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }
                        `}
                      >
                        <Icon className="size-[18px] shrink-0" />

                        <span className="font-medium">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/60 p-2">
        <SidebarMenu className="gap-1">
          {/* Sign out */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sign out"
              className="h-10 rounded-xl px-3 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-[18px]" />
              <span className="font-medium">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Collapse */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={
                state === "expanded"
                  ? "Collapse sidebar"
                  : "Expand sidebar"
              }
              className="h-10 rounded-xl px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {state === "expanded" ? (
                <ChevronLeft className="size-[18px]" />
              ) : (
                <ChevronRight className="size-[18px]" />
              )}

              <span className="font-medium">
                {state === "expanded"
                  ? "Collapse sidebar"
                  : "Expand sidebar"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}