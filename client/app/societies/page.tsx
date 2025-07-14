"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Calendar, Crown } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

interface Society {
  id: string
  name: string
  code: string
  isCreator: boolean
  daysAgo: number
  memberCount: number
}

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<Society[]>([
    {
      id: "1",
      name: "College Friends",
      code: "CF2024",
      isCreator: true,
      daysAgo: 15,
      memberCount: 8,
    },
    {
      id: "2",
      name: "Weekend Warriors",
      code: "WW2024",
      isCreator: false,
      daysAgo: 7,
      memberCount: 5,
    },
    {
      id: "3",
      name: "Food Explorers",
      code: "FE2024",
      isCreator: true,
      daysAgo: 3,
      memberCount: 12,
    },
  ])

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [newSocietyName, setNewSocietyName] = useState("")
  const [newSocietyCode, setNewSocietyCode] = useState("")
  const [joinCode, setJoinCode] = useState("")

  const handleCreateSociety = () => {
    if (newSocietyName && newSocietyCode) {
      const newSociety: Society = {
        id: Date.now().toString(),
        name: newSocietyName,
        code: newSocietyCode,
        isCreator: true,
        daysAgo: 0,
        memberCount: 1,
      }
      setSocieties([newSociety, ...societies])
      setNewSocietyName("")
      setNewSocietyCode("")
      setCreateDialogOpen(false)
    }
  }

  const handleJoinSociety = () => {
    if (joinCode) {
      const newSociety: Society = {
        id: Date.now().toString(),
        name: `Society ${joinCode}`,
        code: joinCode,
        isCreator: false,
        daysAgo: 0,
        memberCount: Math.floor(Math.random() * 10) + 2,
      }
      setSocieties([...societies, newSociety])
      setJoinCode("")
      setJoinDialogOpen(false)
    }
  }

  const createdSocieties = societies.filter((s) => s.isCreator)
  const joinedSocieties = societies.filter((s) => !s.isCreator)

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Societies</h1>
          <div className="flex gap-4">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#e94560] hover:bg-[#d63851] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Society
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f3460] border-[#16213e] text-[#f9f9f9]">
                <DialogHeader>
                  <DialogTitle>Create New Society</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="society-name">Society Name</Label>
                    <Input
                      id="society-name"
                      value={newSocietyName}
                      onChange={(e) => setNewSocietyName(e.target.value)}
                      className="bg-[#1a1a2e] border-[#16213e] text-[#f9f9f9]"
                      placeholder="Enter society name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="society-code">Join Code</Label>
                    <Input
                      id="society-code"
                      value={newSocietyCode}
                      onChange={(e) => setNewSocietyCode(e.target.value)}
                      className="bg-[#1a1a2e] border-[#16213e] text-[#f9f9f9]"
                      placeholder="Enter unique code"
                    />
                  </div>
                  <Button onClick={handleCreateSociety} className="w-full bg-[#e94560] hover:bg-[#d63851]">
                    Create Society
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#0f3460] text-[#f9f9f9] hover:bg-[#16213e] bg-transparent">
                  Join Society
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f3460] border-[#16213e] text-[#f9f9f9]">
                <DialogHeader>
                  <DialogTitle>Join Society</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="join-code">Society Code</Label>
                    <Input
                      id="join-code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="bg-[#1a1a2e] border-[#16213e] text-[#f9f9f9]"
                      placeholder="Enter society code"
                    />
                  </div>
                  <Button onClick={handleJoinSociety} className="w-full bg-[#e94560] hover:bg-[#d63851]">
                    Join Society
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Created Societies */}
        {createdSocieties.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#e94560]" />
              Created Societies
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdSocieties.map((society) => (
                <Link key={society.id} href={`/societies/${society.id}`}>
                  <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-[#f9f9f9]">{society.name}</span>
                        <Badge variant="secondary" className="bg-[#e94560]/20 text-[#e94560]">
                          Creator
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#f9f9f9]/70">
                          <Users className="h-4 w-4" />
                          {society.memberCount} members
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#f9f9f9]/70">
                          <Calendar className="h-4 w-4" />
                          Created {society.daysAgo} days ago
                        </div>
                        <div className="text-sm text-[#f9f9f9]/50">Code: {society.code}</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Joined Societies */}
        {joinedSocieties.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Joined Societies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedSocieties.map((society) => (
                <Link key={society.id} href={`/societies/${society.id}`}>
                  <Card className="bg-[#0f3460]/20 border-[#0f3460] hover:bg-[#16213e]/30 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-[#f9f9f9]">{society.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#f9f9f9]/70">
                          <Users className="h-4 w-4" />
                          {society.memberCount} members
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#f9f9f9]/70">
                          <Calendar className="h-4 w-4" />
                          Joined {society.daysAgo} days ago
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {societies.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-[#f9f9f9]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No societies yet</h3>
            <p className="text-[#f9f9f9]/70 mb-6">Create your first society or join one using a code</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setCreateDialogOpen(true)} className="bg-[#e94560] hover:bg-[#d63851]">
                Create Society
              </Button>
              <Button
                onClick={() => setJoinDialogOpen(true)}
                variant="outline"
                className="border-[#0f3460] text-[#f9f9f9] hover:bg-[#16213e]"
              >
                Join Society
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
