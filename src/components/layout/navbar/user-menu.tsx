"use client";

import Link from "next/link";
import { LogOut, User, LayoutDashboard, Settings } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    image?: string | null;
    email: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const profileUrl = `/u/${user.name || user.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative h-9 w-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={profileUrl} className="w-full cursor-pointer" />}>
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashboard" className="w-full cursor-pointer" />}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashboard/profile" className="w-full cursor-pointer" />}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={() => {
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/";
                },
              },
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
