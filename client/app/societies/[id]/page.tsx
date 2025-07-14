"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Plus, MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useParams } from "next/navigation"

interface Outing {
  id: string
  name: string
  date: string
  participants: string[]
  instanceCount: number
  totalAmount: number
  status: "ongoing" | "completed"
}

export default function SocietyPage() {
  const params = useParams()
  const societyId = params.id as string

  const [outings, setOutings] = useState<Outing[]>([
    {
      id: "1",
      name: "Pizza Night",
      date: "2024-01-10",
      participants: ["John", "Alice", "Bob"],
      instanceCount: 3,
      totalAmount: 45.5,
      status: "completed",
    },
    {
      id: "2",
      name: "Movie Marathon",
      date: "2024-01-08",
      participants: ["John", "Alice", "Charlie", "Diana"],
      instanceCount: 5,
      totalAmount: 78.2,
      status: "completed",
    },
    {
      id: "3",
      name: "Beach Day",
      date: "2024-01-15",
      participants: ["John", "Bob"],
      instanceCount: 2,
      totalAmount: 32.0,
      status: "ongoing",
    },
  ])

  const [createOutingOpen, setCreateOutingOpen] = useState(false)
  const [newOutingName, setNewOutingName] = useState("")

  const society = {
    name: "College Friends",
    daysAgo: 15,
    memberCount: 8,
    totalOutings: outings.length,
    totalInstances: outings.reduce((sum, outing) => sum + outing.instanceCount, 0),
  }

  const handleCreateOuting = () => {
    if (newOutingName) {
      const newOuting: Outing = {
        id: Date.now().toString(),
        name: newOutingName,
        date: new Date().toISOString().split("T")[0],
        participants: ["John"],
        instanceCount: 0,
        totalAmount: 0,
        status: "ongoing",
      }
      setOutings([newOuting, ...outings])
      setNewOutingName("")
      setCreateOutingOpen(false)
    }
  }

  const ongoingOutings = outings.filter((o) => o.status === "ongoing")
  const completedOutings = outings.filter((o) => o.status === "completed")

  // Mock calendar data - days with outings
  const outingDates = outings.map((o) => new Date(o.date).getDate())

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Society Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{society.name}</h1>
          <p className="text-[#f9f9f9]/70">Created {society.daysAgo} days ago</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-[#e94560] mx-auto mb-2" />
              <div className="text-2xl font-bold">{society.memberCount}</div>
              <div className="text-sm text-[#f9f9f9]/70">Members</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-[#e94560] mx-auto mb-2" />
              <div className="text-2xl font-bold">{society.totalOutings}</div>
              <div className="text-sm text-[#f9f9f9]/70">Outings</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-[#e94560] mx-auto mb-2" />
              <div className="text-2xl font-bold">{society.totalInstances}</div>
              <div className="text-sm text-[#f9f9f9]/70">Instances</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-[#e94560] mx-auto mb-2" />
              <div className="text-2xl font-bold">${outings.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</div>
              <div className="text-sm text-[#f9f9f9]/70">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="bg-[#0f3460]/20 border-[#0f3460]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#e94560]" />
                Activity Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="p-2 font-semibold text-[#f9f9f9]/70">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`p-2 rounded ${
                      outingDates.includes(day) ? "bg-[#e94560] text-white" : "text-[#f9f9f9]/70 hover:bg-[#16213e]"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Outings</h2>
              <Dialog open={createOutingOpen} onOpenChange={setCreateOutingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#e94560] hover:bg-[#d63851]">
                    <Plus className="h-4 w-4 mr-2" />
                    New Outing
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f3460] border-[#16213e] text-[#f9f9f9]">
                  <DialogHeader>
                    <DialogTitle>Create New Outing</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      value={newOutingName}
                      onChange={(e) => setNewOutingName(e.target.value)}
                      className="bg-[#1a1a2e] border-[#16213e] text-[#f9f9f9]"
                      placeholder="Enter outing name"
                    />
                    <Button onClick={handleCreateOuting} className="w-full bg-[#e94560] hover:bg-[#d63851]">
                      Create Outing
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Ongoing Outings */}
            {ongoingOutings.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-[#e94560]">Ongoing Outings</h3>
                <div className="space-y-4">
                  {ongoingOutings.map((outing) => (
                    <Link key={outing.id} href={`/societies/${societyId}/outings/${outing.id}`}>
                      <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">{outing.name}</h4>
                            <Badge className="bg-[#e94560]/20 text-[#e94560]">{outing.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#f9f9f9]/70">
                            <span>{outing.date}</span>
                            <span>{outing.participants.length} participants</span>
                            <span>{outing.instanceCount} instances</span>
                            <span>${outing.totalAmount.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Outings */}
            {completedOutings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Past Outings</h3>
                <div className="space-y-4">
                  {completedOutings.map((outing) => (
                    <Link key={outing.id} href={`/societies/${societyId}/outings/${outing.id}`}>
                      <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">{outing.name}</h4>
                            <Badge variant="secondary" className="bg-[#16213e] text-[#f9f9f9]/70">
                              {outing.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#f9f9f9]/70">
                            <span>{outing.date}</span>
                            <span>{outing.participants.length} participants</span>
                            <span>{outing.instanceCount} instances</span>
                            <span>${outing.totalAmount.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
