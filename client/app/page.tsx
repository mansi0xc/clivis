"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, Users, Calculator, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if user is authenticated
    if (status === "authenticated" && session) {
    router.push("/societies")
  }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e94560] mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show loading state while redirecting
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e94560] mx-auto mb-4"></div>
          <p className="text-lg">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9]">
      {/* Header */}
      <header className="border-b border-[#16213e] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Navigation className="h-8 w-8 text-[#e94560]" />
            <span className="text-2xl font-bold">Clivis</span>
          </div>
          <Button asChild className="bg-[#e94560] hover:bg-[#d63851] text-white">
            <Link href="/auth/signin">
            Sign in with Google
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#f9f9f9] to-[#e94560] bg-clip-text text-transparent">
            Navigate Group Expenses
          </h1>
          <p className="text-xl md:text-2xl text-[#f9f9f9]/80 mb-8 max-w-3xl mx-auto">
            Create societies, plan outings, and effortlessly track shared expenses with your friends. No more confusion
            about who owes what.
          </p>
          <Button asChild size="lg" className="bg-[#e94560] hover:bg-[#d63851] text-white text-lg px-8 py-6">
            <Link href="/auth/signin">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-[#0f3460]/20 border-[#0f3460] p-6">
            <CardContent className="text-center space-y-4">
              <Users className="h-12 w-12 text-[#e94560] mx-auto" />
              <h3 className="text-xl font-bold">Create Societies</h3>
              <p className="text-[#f9f9f9]/70">
                Build groups with your friends, colleagues, or roommates. Organize your social circles effortlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f3460]/20 border-[#0f3460] p-6">
            <CardContent className="text-center space-y-4">
              <Calculator className="h-12 w-12 text-[#e94560] mx-auto" />
              <h3 className="text-xl font-bold">Track Expenses</h3>
              <p className="text-[#f9f9f9]/70">
                Split bills, track who paid what, and never lose track of shared expenses again.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f3460]/20 border-[#0f3460] p-6">
            <CardContent className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-[#e94560] mx-auto" />
              <h3 className="text-xl font-bold">Settle Up</h3>
              <p className="text-[#f9f9f9]/70">
                Get clear settlement suggestions and make sure everyone gets paid back fairly.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-[#f9f9f9]/80 mb-8">
            Join thousands of users who trust Clivis to manage their group expenses.
              </p>
          <Button asChild size="lg" className="bg-[#e94560] hover:bg-[#d63851] text-white text-lg px-8 py-6">
            <Link href="/auth/signin">
              Sign Up Now
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#16213e] px-6 py-8 mt-20">
        <div className="max-w-7xl mx-auto text-center text-[#f9f9f9]/60">
          <p>&copy; 2024 Clivis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
