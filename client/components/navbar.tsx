"use client"

import { Navigation, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="border-b border-[#16213e] px-6 py-4 bg-[#1a1a2e]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Navigation className="h-8 w-8 text-[#e94560]" />
          <span className="text-2xl font-bold text-[#f9f9f9]">Clivis</span>
        </Link>

        <nav className="flex items-center gap-8">
          {session && (
          <Link
            href="/societies"
            className={`text-lg font-medium transition-colors ${
              pathname === "/societies" ? "text-[#e94560]" : "text-[#f9f9f9] hover:text-[#e94560]"
            }`}
          >
            Societies
          </Link>
          )}

          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-[#0f3460] animate-pulse" />
          ) : session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-[#0f3460] hover:border-[#e94560] transition-colors">
                  <AvatarImage src={session.user?.image || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback className="bg-[#0f3460] text-[#f9f9f9]">
                    {session.user?.name?.[0] || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0f3460] border-[#16213e] text-[#f9f9f9]">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button asChild className="bg-[#e94560] hover:bg-[#d63851]">
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
