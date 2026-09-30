"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";

const pageInfo: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Manage your professional portfolio.",
  },
  "/dashboard/hero": {
    title: "Hero",
    description: "Manage the first impression of your portfolio.",
  },
  "/dashboard/about": {
    title: "About",
    description: "Manage your professional introduction.",
  },
  "/dashboard/experience": {
    title: "Experience",
    description: "Manage your professional experience.",
  },
  "/dashboard/education": {
    title: "Education",
    description: "Manage your academic background.",
  },
  "/dashboard/skills": {
    title: "Skills",
    description: "Manage your professional skills.",
  },
  "/dashboard/gallery": {
    title: "Gallery",
    description: "Manage your professional photos.",
  },
  "/dashboard/certificates": {
    title: "Certificates",
    description: "Manage your professional certificates.",
  },
  "/dashboard/messages": {
    title: "Messages",
    description: "View and manage visitor messages.",
  },
  "/dashboard/settings": {
    title: "Site Settings",
    description: "Manage your portfolio settings.",
  },
  "/dashboard/cv": {
    title: "CV",
    description: "Manage your downloadable CV.",
  },
};

export function DashboardTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const currentPage =
    pageInfo[pathname] ??
    Object.entries(pageInfo).find(
      ([path]) =>
        path !== "/dashboard" && pathname.startsWith(`${path}/`)
    )?.[1] ?? {
      title: "Dashboard",
      description: "Manage your professional portfolio.",
    };

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl md:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="size-9 rounded-lg" />

          <Separator
            orientation="vertical"
            className="hidden h-6 sm:block"
          />

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
              {currentPage.title}
            </h1>

            <p className="hidden truncate text-xs text-muted-foreground md:block">
              {currentPage.description}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Preview */}
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-lg sm:flex"
            onClick={() => window.open("/", "_blank")}
          >
            <ExternalLink className="size-4" />
            <span>Preview</span>
          </Button>

          {/* Theme */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-lg"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <Sun className="size-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
           <DropdownMenuTrigger
  className="flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-medium transition-colors hover:bg-accent sm:px-2.5"
>
  <Avatar className="size-8">
    <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
      LG
    </AvatarFallback>
  </Avatar>

  <div className="hidden text-left lg:block">
    <p className="text-xs font-semibold leading-none">
      Lami Gudisa
    </p>

    <p className="mt-1 text-[11px] text-muted-foreground">
      Owner
    </p>
  </div>
</DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl"
            >
              <div className="px-2 py-2">
                <p className="text-sm font-semibold">
                  Lami Gudisa
                </p>
                <p className="text-xs text-muted-foreground">
                  Portfolio Owner
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/")}
              >
                <User />
                View Portfolio
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}