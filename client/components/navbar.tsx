"use client"

import { Navigation, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-[#16213e] px-6 py-4 bg-[#1a1a2e]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/societies" className="flex items-center gap-2">
          <Navigation className="h-8 w-8 text-[#e94560]" />
          <span className="text-2xl font-bold text-[#f9f9f9]">Compass</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/societies"
            className={`text-lg font-medium transition-colors ${
              pathname === "/societies" ? "text-[#e94560]" : "text-[#f9f9f9] hover:text-[#e94560]"
            }`}
          >
            Societies
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-[#0f3460] hover:border-[#e94560] transition-colors">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-[#0f3460] text-[#f9f9f9]">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0f3460] border-[#16213e] text-[#f9f9f9]">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
