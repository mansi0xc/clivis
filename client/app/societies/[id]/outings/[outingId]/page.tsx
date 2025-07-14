"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, DollarSign, Calendar, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useParams } from "next/navigation"

interface Instance {
  id: string
  name: string
  creator: string
  amount: number
  participants: string[]
  status: "active" | "ended"
}

interface Participant {
  name: string
  avatar: string
  totalOwed: number
  totalPaid: number
}

export default function OutingPage() {
  const params = useParams()
  const societyId = params.id as string
  const outingId = params.outingId as string

  const [instances, setInstances] = useState<Instance[]>([
    {
      id: "1",
      name: "Dinner at Restaurant",
      creator: "John",
      amount: 120.5,
      participants: ["John", "Alice", "Bob"],
      status: "ended",
    },
    {
      id: "2",
      name: "Uber Ride",
      creator: "Alice",
      amount: 25.0,
      participants: ["John", "Alice", "Bob"],
      status: "ended",
    },
    {
      id: "3",
      name: "Dessert",
      creator: "Bob",
      amount: 18.75,
      participants: ["Alice", "Bob"],
      status: "active",
    },
  ])

  const [createInstanceOpen, setCreateInstanceOpen] = useState(false)
  const [newInstanceName, setNewInstanceName] = useState("")
  const [newInstanceAmount, setNewInstanceAmount] = useState("")

  const outing = {
    name: "Pizza Night",
    date: "2024-01-10",
    participants: ["John", "Alice", "Bob"],
    status: "ongoing" as const,
  }

  const currentUser = "John"

  const handleCreateInstance = () => {
    if (newInstanceName && newInstanceAmount) {
      const newInstance: Instance = {
        id: Date.now().toString(),
        name: newInstanceName,
        creator: currentUser,
        amount: Number.parseFloat(newInstanceAmount),
        participants: [currentUser],
        status: "active",
      }
      setInstances([...instances, newInstance])
      setNewInstanceName("")
      setNewInstanceAmount("")
      setCreateInstanceOpen(false)
    }
  }

  const handleJoinInstance = (instanceId: string) => {
    setInstances(
      instances.map((instance) =>
        instance.id === instanceId && !instance.participants.includes(currentUser)
          ? { ...instance, participants: [...instance.participants, currentUser] }
          : instance,
      ),
    )
  }

  const handleEndInstance = (instanceId: string) => {
    setInstances(
      instances.map((instance) => (instance.id === instanceId ? { ...instance, status: "ended" as const } : instance)),
    )
  }

  // Calculate summary for current user
  const calculateSummary = () => {
    let totalOwed = 0
    let totalPaid = 0

    instances.forEach((instance) => {
      if (instance.status === "ended" && instance.participants.includes(currentUser)) {
        const splitAmount = instance.amount / instance.participants.length
        if (instance.creator === currentUser) {
          totalPaid += instance.amount
          totalOwed -= instance.amount - splitAmount // Others owe this user
        } else {
          totalOwed += splitAmount // This user owes the creator
        }
      }
    })

    return { totalOwed, totalPaid }
  }

  const summary = calculateSummary()

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f9f9f9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/societies/${societyId}`}>
            <Button variant="ghost" size="icon" className="text-[#f9f9f9] hover:bg-[#16213e]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{outing.name}</h1>
            <div className="flex items-center gap-4 text-[#f9f9f9]/70">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {outing.date}
              </span>
              <Badge
                className={
                  outing.status === "ongoing" ? "bg-[#e94560]/20 text-[#e94560]" : "bg-[#16213e] text-[#f9f9f9]/70"
                }
              >
                {outing.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Participants */}
        <Card className="bg-[#0f3460]/20 border-[#0f3460] mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#e94560]" />
              Participants ({outing.participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {outing.participants.map((participant) => (
                <div key={participant} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback className="bg-[#0f3460] text-[#f9f9f9]">{participant[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{participant}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Instances */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Instances</h2>
              <Dialog open={createInstanceOpen} onOpenChange={setCreateInstanceOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#e94560] hover:bg-[#d63851]">
                    <Plus className="h-4 w-4 mr-2" />
                    Launch Instance
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f3460] border-[#16213e] text-[#f9f9f9]">
                  <DialogHeader>
                    <DialogTitle>Launch New Instance</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      value={newInstanceName}
                      onChange={(e) => setNewInstanceName(e.target.value)}
                      className="bg-[#1a1a2e] border-[#16213e] text-[#f9f9f9]"
                      placeholder="Instance name (e.g., Dinner, Uber)"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={newInstanceAmount}
                      onChange={(e) => setNewInstanceAmount(e.target.value)}
                      className="bg-[#1a1a2e] border-[#16213e] text-[#f9f9f9]"
                      placeholder="Amount spent"
                    />
                    <Button onClick={handleCreateInstance} className="w-full bg-[#e94560] hover:bg-[#d63851]">
                      Launch Instance
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {instances.map((instance) => (
                <Card key={instance.id} className="bg-[#0f3460]/20 border-[#0f3460]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{instance.name}</h3>
                        <p className="text-sm text-[#f9f9f9]/70">Created by {instance.creator}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#e94560]">${instance.amount.toFixed(2)}</div>
                        <Badge
                          className={
                            instance.status === "active"
                              ? "bg-[#e94560]/20 text-[#e94560]"
                              : "bg-[#16213e] text-[#f9f9f9]/70"
                          }
                        >
                          {instance.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-[#f9f9f9]/70">Participants:</span>
                      <div className="flex gap-1">
                        {instance.participants.map((participant) => (
                          <Avatar key={participant} className="h-6 w-6">
                            <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                            <AvatarFallback className="bg-[#0f3460] text-[#f9f9f9] text-xs">
                              {participant[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-[#f9f9f9]/70">({instance.participants.length})</span>
                    </div>

                    <div className="flex gap-2">
                      {instance.status === "active" && (
                        <>
                          {!instance.participants.includes(currentUser) && (
                            <Button
                              size="sm"
                              onClick={() => handleJoinInstance(instance.id)}
                              className="bg-[#0f3460] hover:bg-[#16213e] text-[#f9f9f9]"
                            >
                              Join Instance
                            </Button>
                          )}
                          {instance.creator === currentUser && (
                            <Button
                              size="sm"
                              onClick={() => handleEndInstance(instance.id)}
                              className="bg-[#e94560] hover:bg-[#d63851]"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              End Instance
                            </Button>
                          )}
                        </>
                      )}
                      {instance.status === "ended" && (
                        <div className="text-sm text-[#f9f9f9]/70">
                          Split: ${(instance.amount / instance.participants.length).toFixed(2)} per person
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <Card className="bg-[#0f3460]/20 border-[#0f3460]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#e94560]" />
                  Your Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Paid:</span>
                  <span className="font-semibold text-[#e94560]">${summary.totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Owed:</span>
                  <span className="font-semibold text-[#f9f9f9]">${Math.abs(summary.totalOwed).toFixed(2)}</span>
                </div>
                <hr className="border-[#16213e]" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Net Balance:</span>
                  <span className={summary.totalOwed < 0 ? "text-green-400" : "text-[#e94560]"}>
                    {summary.totalOwed < 0 ? "+" : "-"}${Math.abs(summary.totalOwed).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#f9f9f9]/70">
                  {summary.totalOwed < 0 ? "Others owe you money" : "You owe money to others"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
