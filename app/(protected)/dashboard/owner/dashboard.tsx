import { AdminRestaurantData } from "@/lib/api_beta";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/acertenity UI/sidebar";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DoorOpen, HomeIcon, Settings, ShieldUser, Square, SquareUser, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/reusable/theme";
import { Avatar } from "@/components/ui/avatar";
import Dashboard from "./screen/dasboard";

export function OwnerDashboardContent({ restaurant, onLogout }: { restaurant: AdminRestaurantData; onLogout: () => void }) {
  const { user, logout } = useAuth();

  const links = [
    {
      label: "Inicio",
      href: "#",
      icon: (
        <HomeIcon className="h-8 w-8 shrink-0 text-white p-1.5 bg-black rounded-sm" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-9xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
                <SidebarLink
                  link={{
                    label: "Manu Arora",
                    href: "#",
                    icon: (
                      <img
                        src="https://assets.aceternity.com/manu.png"
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuItem>
                  <UserRound />
                  Perfil
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Configuración
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ThemeToggle />
                  <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={logout}>
                  <DoorOpen />
                  Cerrar sesión
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard restaurant={restaurant} />
    </div>
  );
}

export const Logo = () => {
  return (
      <div className="h-5 w-6 shrink-0 dark:bg-white">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Owner panel
      </motion.span>
      </div>
  );
};
export const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center rounded-sm bg-gray-200 p-2">
      <SquareUser className="h-6 w-6 text-black" />
    </div>
  );
};
 
