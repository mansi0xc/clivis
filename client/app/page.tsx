"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, Users, Calculator, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const handleGoogleAuth = () => {
    // Simulate Google authentication
    setIsAuthenticated(true)
    router.push("/societies")
  }

  if (isAuthenticated) {
    router.push("/societies")
    return null
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9]">
      {/* Header */}
      <header className="border-b border-[#16213e] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Navigation className="h-8 w-8 text-[#e94560]" />
            <span className="text-2xl font-bold">Compass</span>
          </div>
          <Button onClick={handleGoogleAuth} className="bg-[#e94560] hover:bg-[#d63851] text-white">
            Sign in with Google
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
          <Button
            onClick={handleGoogleAuth}
            size="lg"
            className="bg-[#e94560] hover:bg-[#d63851] text-white text-lg px-8 py-4"
          >
            Get Started with Google
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-[#e94560] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Create Societies</h3>
              <p className="text-[#f9f9f9]/70">
                Form groups with your friends and manage multiple societies for different activities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors">
            <CardContent className="p-8 text-center">
              <Calculator className="h-12 w-12 text-[#e94560] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Track Expenses</h3>
              <p className="text-[#f9f9f9]/70">
                Record instances of spending during outings and automatically calculate who owes what.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-[#e94560] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
              <p className="text-[#f9f9f9]/70">
                View detailed statistics and insights about your group spending patterns.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How Compass Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#e94560] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold">Join Societies</h3>
              <p className="text-[#f9f9f9]/70 text-sm">
                Create or join societies with your friend groups using simple codes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#e94560] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold">Plan Outings</h3>
              <p className="text-[#f9f9f9]/70 text-sm">
                Any member can create outings that others can join and participate in.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#e94560] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold">Record Expenses</h3>
              <p className="text-[#f9f9f9]/70 text-sm">
                Launch instances to track individual expenses during your outings.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#e94560] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold">Settle Up</h3>
              <p className="text-[#f9f9f9]/70 text-sm">Automatically calculate and settle who owes what to whom.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#16213e] py-8 text-center text-[#f9f9f9]/60">
        <p>&copy; 2024 Compass. Navigate your group expenses with ease.</p>
      </footer>
    </div>
  )
}
