"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, TrendingUp, User, MapPin } from "lucide-react"
import Navbar from "@/components/navbar"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "2024-01-01",
    avatar: "/placeholder.svg?height=80&width=80",
    societiesCount: 3,
  }

  const societies = [
    { name: "College Friends", color: "#e94560", outings: 5 },
    { name: "Weekend Warriors", color: "#0f3460", outings: 3 },
    { name: "Food Explorers", color: "#16213e", outings: 7 },
  ]

  const totalOutings = societies.reduce((sum, society) => sum + society.outings, 0)

  // Mock calendar data - days with outings from different societies
  const outingCalendar = [
    { date: 5, society: "College Friends" },
    { date: 8, society: "Weekend Warriors" },
    { date: 12, society: "Food Explorers" },
    { date: 15, society: "College Friends" },
    { date: 18, society: "Food Explorers" },
    { date: 22, society: "Weekend Warriors" },
    { date: 25, society: "Food Explorers" },
    { date: 28, society: "College Friends" },
  ]

  const getSocietyColor = (societyName: string) => {
    const society = societies.find((s) => s.name === societyName)
    return society?.color || "#e94560"
  }

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="bg-[#0f3460]/20 border-[#0f3460] mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-[#e94560]">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-[#0f3460] text-[#f9f9f9] text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-[#f9f9f9]/70">{user.email}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {user.societiesCount} societies
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Societies List */}
          <div>
            <Card className="bg-[#0f3460]/20 border-[#0f3460] mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#e94560]" />
                  My Societies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {societies.map((society) => (
                  <div key={society.name} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: society.color }} />
                      <span className="font-medium">{society.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-[#16213e] text-[#f9f9f9]/70">
                      {society.outings} outings
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-[#0f3460]/20 border-[#0f3460]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#e94560]" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Outings:</span>
                    <span className="font-semibold text-[#e94560]">{totalOutings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Societies:</span>
                    <span className="font-semibold">{societies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Outings/Society:</span>
                    <span className="font-semibold">{(totalOutings / societies.length).toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Calendar */}
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#e94560]" />
                Activity Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="p-2 font-semibold text-[#f9f9f9]/70">
                    {day}
                  </div>
                ))}
                {daysInMonth.map((day) => {
                  const outing = outingCalendar.find((o) => o.date === day)
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded ${
                        outing ? "text-white font-semibold" : "text-[#f9f9f9]/70 hover:bg-[#16213e]"
                      }`}
                      style={{
                        backgroundColor: outing ? getSocietyColor(outing.society) : "transparent",
                      }}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#f9f9f9]/70">Legend:</h4>
                {societies.map((society) => (
                  <div key={society.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: society.color }} />
                    <span>{society.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outings Distribution Chart */}
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#e94560]" />
                Outings Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={societies}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="outings"
                  >
                    {societies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    wrapperStyle={{ color: "#f9f9f9" }}
                    formatter={(value) => {
                      // Find the society by name to get outings
                      const society = societies.find(s => s.name === value);
                      return (
                        <span style={{ color: "#f9f9f9" }}>
                          {value}: {society?.outings || 0} outings
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
