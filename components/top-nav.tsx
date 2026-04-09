"use client"
import { Notifications } from "./notifications"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSettings } from "@/contexts/settings-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import React from "react"
import { Store, User, LogOut, Palette, Bell } from "lucide-react"
import { GrSettingsOption } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri"
import { FaWallet } from 'react-icons/fa'


export function TopNav() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)
  const { settings } = useSettings()
  const { user, userData, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || 'user@example.com'

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="container flex h-14 items-center lg:justify-between justify-end px-4 md:px-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <span className="text-muted-foreground">/</span>
                <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`} className="text-sm font-medium">
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.photoURL || settings.avatar} alt={userDisplayName} />
                  <AvatarFallback>
                    {userDisplayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4 border-0" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/marketplace" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Marketplace
                </Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/wallet" className="flex items-center gap-2">
                  <FaWallet className="h-4 w-4" />
                  Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings" className="flex items-center gap-2">
                <RiAdminFill className="h-4 w-4" />
               Account Settings
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>  */}
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/gallery-settings" className="flex items-center gap-2">
                  <GrSettingsOption className="h-4 w-4" />
                 Gallery Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" 
              // onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
