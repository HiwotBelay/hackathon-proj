"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Brain, Zap, Utensils, Clock, Activity, Smile, Users, Lightbulb, Shield } from 'lucide-react'
import { motion } from "framer-motion"

interface PetStatsProps {
  petName: string
  petType: string
  petLevel: number
  petExperience: number
  petStats: {
    happiness: number
    energy: number
    hunger: number
    intelligence: number
  }
  petPersonality: {
    playfulness: number
    affection: number
    curiosity: number
    independence: number
  }
}

export function PetStats({
  petName,
  petType,
  petLevel,
  petExperience,
  petStats,
  petPersonality,
}: PetStatsProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [showTips, setShowTips] = useState(false)

  // Calculate XP needed for next level
  const xpForNextLevel = petLevel * 100
  const xpProgress = (petExperience / xpForNextLevel) * 100

  // Calculate overall health based on stats
  const overallHealth = Math.round((petStats.happiness + petStats.energy + petStats.hunger) / 3)

  // Calculate pet age in "pet years"
  const petAge = Math.max(1, Math.round(petLevel * 1.5))

  // Calculate dominant personality trait
  const dominantTrait = Object.entries(petPersonality).reduce(
    (max, [trait, value]) => (value > max.value ? { trait, value } : max),
    { trait: "", value: 0 }
  )

  // Tips based on current stats
  const getTips = () => {
    const tips = []

    if (petStats.happiness < 50) {
      tips.push("Your pet seems sad. Try playing games or giving compliments to boost happiness!")
    }

    if (petStats.energy < 40) {
      tips.push("Your pet is low on energy. Let them rest or take a nap to recover!")
    }

    if (petStats.hunger < 30) {
      tips.push("Your pet is hungry! Feed them to increase their hunger stat.")
    }

    if (petStats.intelligence < 60 && petLevel > 5) {
      tips.push("Try teaching your pet new tricks to boost their intelligence!")
    }

    if (tips.length === 0) {
      tips.push("Your pet is doing great! Keep up the good care.")
    }

    return tips
  }

  // Get personality description
  const getPersonalityDescription = () => {
    if (petPersonality.playfulness > 70) {
      return "Very playful and energetic"
    } else if (petPersonality.affection > 70) {
      return "Loving and affectionate"
    } else if (petPersonality.curiosity > 70) {
      return "Curious and inquisitive"
    } else if (petPersonality.independence > 70) {
      return "Independent and self-reliant"
    } else {
      return "Balanced and well-rounded"
    }
  }

  return (
    <div className="space-y-4">
      {/* Pet Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{petName}'s Stats</CardTitle>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 font-normal">
              Level {petLevel}
            </Badge>
          </div>
          <CardDescription>
            {petType} • Age: {petAge} {petType} years • Health: {overallHealth}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <Activity className="h-3.5 w-3.5 mr-1 text-blue-600 dark:text-blue-400" />
                Experience
              </span>
              <span>
                {petExperience}/{xpForNextLevel}
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Stats</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <StatItem
              icon={<Heart className="h-4 w-4 text-red-500" />}
              label="Happiness"
              value={petStats.happiness}
              color="bg-red-500"
            />
            <StatItem
              icon={<Zap className="h-4 w-4 text-yellow-500" />}
              label="Energy"
              value={petStats.energy}
              color="bg-yellow-500"
            />
            <StatItem
              icon={<Utensils className="h-4 w-4 text-green-500" />}
              label="Hunger"
              value={petStats.hunger}
              color="bg-green-500"
            />
            <StatItem
              icon={<Brain className="h-4 w-4 text-purple-500" />}
              label="Intelligence"
              value={petStats.intelligence}
              color="bg-purple-500"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? "Hide Tips" : "Show Care Tips"}
          </Button>

          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mt-2"
            >
              <h4 className="text-sm font-medium flex items-center mb-2">
                <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                Care Tips
              </h4>
              <ul className="text-xs space-y-1 list-disc pl-5">
                {getTips().map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="personality" className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-md mb-4">
            <h4 className="text-sm font-medium mb-1">Personality Profile</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{getPersonalityDescription()}</p>
            <Badge variant="outline" className="text-xs">
              Dominant Trait: {dominantTrait.trait} ({dominantTrait.value}%)
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <StatItem
              icon={<Smile className="h-4 w-4 text-amber-500" />}
              label="Playfulness"
              value={petPersonality.playfulness}
              color="bg-amber-500"
            />
            <StatItem
              icon={<Heart className="h-4 w-4 text-pink-500" />}
              label="Affection"
              value={petPersonality.affection}
              color="bg-pink-500"
            />
            <StatItem
              icon={<Lightbulb className="h-4 w-4 text-blue-500" />}
              label="Curiosity"
              value={petPersonality.curiosity}
              color="bg-blue-500"
            />
            <StatItem
              icon={<Shield className="h-4 w-4 text-indigo-500" />}
              label="Independence"
              value={petPersonality.independence}
              color="bg-indigo-500"
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">Pet History</h4>
            <div className="space-y-3">
              <HistoryItem
                icon={<Clock className="h-4 w-4 text-blue-500" />}
                title="First Met"
                description={`You met ${petName} ${petLevel} days ago`}
              />
              <HistoryItem
                icon={<Activity className="h-4 w-4 text-green-500" />}
                title="Growth"
                description={`${petName} has grown ${petLevel - 1} levels under your care`}
              />
              <HistoryItem
                icon={<Users className="h-4 w-4 text-purple-500" />}
                title="Friendship"
                description={`Your bond with ${petName} grows stronger every day`}
              />
              <HistoryItem
                icon={<Brain className="h-4 w-4 text-amber-500" />}
                title="Learning"
                description={`${petName} has learned ${Math.floor(petStats.intelligence / 10)} skills`}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-md">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

interface HistoryItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function HistoryItem({ icon, title, description }: HistoryItemProps) {
  return (
    <div className="flex items-start">
      <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mr-3">{icon}</div>
      <div>
        <h5 className="text-sm font-medium">{title}</h5>
        <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  )
}
