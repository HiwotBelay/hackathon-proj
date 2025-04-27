"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Star, Trophy, ArrowUpCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Evolution stages for different pet types
const EVOLUTION_STAGES = {
  dog: [
    { name: "Puppy", level: 1, image: "/placeholder.svg?height=100&width=100", abilities: ["Basic fetch"] },
    {
      name: "Young Dog",
      level: 5,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Basic fetch", "Sit command"],
    },
    {
      name: "Adult Dog",
      level: 10,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Basic fetch", "Sit command", "Advanced tricks"],
    },
    {
      name: "Super Dog",
      level: 20,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Basic fetch", "Sit command", "Advanced tricks", "Special powers"],
    },
  ],
  cat: [
    { name: "Kitten", level: 1, image: "/placeholder.svg?height=100&width=100", abilities: ["Purring"] },
    { name: "Young Cat", level: 5, image: "/placeholder.svg?height=100&width=100", abilities: ["Purring", "Pouncing"] },
    {
      name: "Adult Cat",
      level: 10,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Purring", "Pouncing", "Hunting"],
    },
    {
      name: "Super Cat",
      level: 20,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Purring", "Pouncing", "Hunting", "Special powers"],
    },
  ],
  bird: [
    { name: "Hatchling", level: 1, image: "/placeholder.svg?height=100&width=100", abilities: ["Chirping"] },
    {
      name: "Fledgling",
      level: 5,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Chirping", "Short flight"],
    },
    {
      name: "Adult Bird",
      level: 10,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Chirping", "Short flight", "Singing"],
    },
    {
      name: "Majestic Bird",
      level: 20,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Chirping", "Short flight", "Singing", "Special powers"],
    },
  ],
  dragon: [
    { name: "Hatchling", level: 1, image: "/placeholder.svg?height=100&width=100", abilities: ["Tiny flame"] },
    {
      name: "Young Drake",
      level: 5,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Tiny flame", "Short flight"],
    },
    {
      name: "Adult Dragon",
      level: 10,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Tiny flame", "Short flight", "Fire breath"],
    },
    {
      name: "Elder Dragon",
      level: 20,
      image: "/placeholder.svg?height=100&width=100",
      abilities: ["Tiny flame", "Short flight", "Fire breath", "Ancient magic"],
    },
  ],
}

// Achievements that can be unlocked
const ACHIEVEMENTS = [
  {
    id: "first_interaction",
    name: "First Contact",
    description: "Interact with your pet for the first time",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "play_10_games",
    name: "Game Master",
    description: "Play 10 games with your pet",
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    id: "reach_level_10",
    name: "Growing Up",
    description: "Reach level 10 with your pet",
    icon: <ArrowUpCircle className="h-4 w-4" />,
  },
  {
    id: "daily_streak_7",
    name: "Loyal Friend",
    description: "Interact with your pet for 7 days in a row",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "all_emotions",
    name: "Emotional Bond",
    description: "Experience all emotions with your pet",
    icon: <Sparkles className="h-4 w-4" />,
  },
]

interface PetEvolutionProps {
  petType: string
  currentLevel: number
  currentXP: number
  onEvolve?: (stage: any) => void
  unlockedAchievements?: string[]
}

export function PetEvolution({
  petType = "dog",
  currentLevel = 1,
  currentXP = 0,
  onEvolve,
  unlockedAchievements = [],
}: PetEvolutionProps) {
  const [level, setLevel] = useState(currentLevel)
  const [xp, setXp] = useState(currentXP)
  const [currentStage, setCurrentStage] = useState(0)
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const stages = EVOLUTION_STAGES[petType] || EVOLUTION_STAGES.dog

  // Initialize current stage based on level
  useEffect(() => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (level >= stages[i].level) {
        setCurrentStage(i)
        break
      }
    }
  }, [level, stages])

  // Calculate XP needed for next level (increases with each level)
  const xpForNextLevel = level * 100
  const xpProgress = (xp / xpForNextLevel) * 100

  // Check for level up and evolution
  useEffect(() => {
    if (xp >= xpForNextLevel) {
      // Level up
      const newLevel = level + 1
      setLevel(newLevel)
      setXp(xp - xpForNextLevel)

      toast({
        title: "Level Up!",
        description: `Your pet is now level ${newLevel}!`,
      })

      // Check for evolution
      const nextStageIndex = stages.findIndex((stage) => stage.level === newLevel)
      if (nextStageIndex > currentStage && nextStageIndex !== -1) {
        setShowEvolutionAnimation(true)
        setTimeout(() => {
          setCurrentStage(nextStageIndex)
          setShowEvolutionAnimation(false)

          if (onEvolve) {
            onEvolve(stages[nextStageIndex])
          }

          toast({
            title: "Evolution!",
            description: `Your pet evolved into ${stages[nextStageIndex].name}!`,
          })
        }, 3000)
      }
    }
  }, [xp, level, xpForNextLevel, currentStage, stages, onEvolve, toast])

  // Current stage info
  const currentStageInfo = stages[currentStage]

  // Next stage info (if available)
  const nextStageInfo = stages[currentStage + 1]
  const levelsToNextEvolution = nextStageInfo ? nextStageInfo.level - level : null

  return (
    <>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <Sparkles className="h-4 w-4" />
        <span>Evolution</span>
      </Button>

      {isOpen && (
        <Card className="w-full mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 dark:from-indigo-950 dark:to-purple-950 dark:border-indigo-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pet Evolution</CardTitle>
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Level {level}
              </Badge>
            </div>
            <CardDescription>Train and evolve your pet to unlock new abilities</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current stage display */}
            <div className="flex items-center space-x-4">
              {showEvolutionAnimation ? (
                <motion.div
                  className="relative w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    rotate: [0, 10, -10, 5, 0],
                    opacity: [1, 0.8, 0.9, 0.7, 1],
                  }}
                  transition={{ duration: 3 }}
                >
                  <Sparkles className="w-12 h-12 text-yellow-500" />
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      boxShadow: [
                        "0 0 10px 5px rgba(79, 70, 229, 0.2)",
                        "0 0 20px 10px rgba(79, 70, 229, 0.4)",
                        "0 0 30px 15px rgba(79, 70, 229, 0.6)",
                        "0 0 20px 10px rgba(79, 70, 229, 0.4)",
                        "0 0 10px 5px rgba(79, 70, 229, 0.2)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              ) : (
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <img
                    src={currentStageInfo.image || "/placeholder.svg"}
                    alt={currentStageInfo.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-bold text-lg">{currentStageInfo.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentStageInfo.abilities.join(", ")}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>XP: {xp}/{xpForNextLevel}</span>
                    <span>{Math.round(xpProgress)}%</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
              </div>
            </div>

            {/* Next evolution info */}
            {nextStageInfo && (
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <ArrowUpCircle className="h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                  Next Evolution: {nextStageInfo.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {levelsToNextEvolution} more levels until evolution
                </p>
                <p className="text-xs">New abilities: {nextStageInfo.abilities.slice(-1)}</p>
              </div>
            )}

            {/* Achievements */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-amber-600 dark:text-amber-400" />
                Evolution Achievements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ACHIEVEMENTS.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-2 rounded-md ${
                      unlockedAchievements.includes(achievement.id)
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-slate-100 dark:bg-slate-800/50 opacity-60"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full mr-2 ${
                        unlockedAchievements.includes(achievement.id)
                          ? "bg-green-200 dark:bg-green-800"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{achievement.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
