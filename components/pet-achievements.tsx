"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Trophy, Star, Medal, Crown, Gift, X, ChevronRight, Lock } from 'lucide-react'

interface PetAchievementsProps {
  achievements: string[]
}

export function PetAchievements({ achievements }: PetAchievementsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)

  // All possible achievements
  const allAchievements = [
    {
      id: "First Conversation",
      name: "First Conversation",
      description: "Had your first conversation with your pet",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      rarity: "common",
      xpReward: 50,
    },
    {
      id: "Chatty Friend",
      name: "Chatty Friend",
      description: "Had 20 conversation exchanges with your pet",
      icon: <Star className="h-5 w-5 text-blue-500" />,
      rarity: "common",
      xpReward: 100,
    },
    {
      id: "Best Friends",
      name: "Best Friends",
      description: "Reached a loving emotional state with your pet",
      icon: <Medal className="h-5 w-5 text-pink-500" />,
      rarity: "uncommon",
      xpReward: 150,
    },
    {
      id: "Excitement Master",
      name: "Excitement Master",
      description: "Got your pet super excited",
      icon: <Star className="h-5 w-5 text-orange-500" />,
      rarity: "common",
      xpReward: 75,
    },
    {
      id: "Game Starter",
      name: "Game Starter",
      description: "Played your first game with your pet",
      icon: <Trophy className="h-5 w-5 text-green-500" />,
      rarity: "common",
      xpReward: 100,
    },
    {
      id: "Game Master",
      name: "Game Master",
      description: "Achieved a high score in a pet game",
      icon: <Trophy className="h-5 w-5 text-purple-500" />,
      rarity: "rare",
      xpReward: 200,
    },
    {
      id: "Fashion Sense",
      name: "Fashion Sense",
      description: "Dressed up your pet with accessories",
      icon: <Crown className="h-5 w-5 text-amber-500" />,
      rarity: "uncommon",
      xpReward: 125,
    },
    {
      id: "Genius Pet",
      name: "Genius Pet",
      description: "Raised your pet's intelligence to 80+",
      icon: <Award className="h-5 w-5 text-indigo-500" />,
      rarity: "rare",
      xpReward: 250,
    },
    {
      id: "Level Up",
      name: "Level Up",
      description: "Your pet gained its first level",
      icon: <Star className="h-5 w-5 text-green-500" />,
      rarity: "common",
      xpReward: 50,
    },
    {
      id: "First Photo",
      name: "First Photo",
      description: "Took your first photo with your pet",
      icon: <Star className="h-5 w-5 text-blue-500" />,
      rarity: "common",
      xpReward: 75,
    },
    {
      id: "Daily Streak",
      name: "Daily Streak",
      description: "Interacted with your pet for 7 days in a row",
      icon: <Award className="h-5 w-5 text-red-500" />,
      rarity: "rare",
      xpReward: 300,
    },
    {
        id: "Emotional Range",
        name: "Emotional Range",
        description: "Experienced different emotions with your pet",
        icon: <Award className="h-5 w-5 text-purple-500" />,
        rarity: "rare",
        xpReward: 300,
      },
    {
      id: "Emotional Range",
      name: "Emotional Range",
      description: "Experienced 10 different emotions with your pet",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      rarity: "epic",
      xpReward: 350,
    },
    {
      id: "Master Trainer",
      name: "Master Trainer",
      description: "Reached level 20 with your pet",
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
      rarity: "legendary",
      xpReward: 500,
    },
  ]

  // Calculate achievement progress
  const achievementProgress = (achievements.length / allAchievements.length) * 100

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
      case "uncommon":
        return "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rare":
        return "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "epic":
        return "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "legendary":
        return "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      default:
        return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  return (
    <>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <Award className="h-4 w-4" />
        <span>Achievements</span>
      </Button>

      {isOpen && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pet Achievements</CardTitle>
              <CardDescription>Track your pet's accomplishments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                <span>{achievements.length}/{allAchievements.length}</span>
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Achievement Progress</span>
                <span>{Math.round(achievementProgress)}%</span>
              </div>
              <Progress value={achievementProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allAchievements.map((achievement) => {
                const isUnlocked = achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-lg p-3 cursor-pointer transition-all hover:scale-105 ${
                      isUnlocked
                        ? "bg-white dark:bg-slate-800 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-900 opacity-60"
                    }`}
                    onClick={() => setSelectedAchievement(achievement.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          isUnlocked ? "bg-blue-100 dark:bg-blue-900" : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      >
                        {isUnlocked ? achievement.icon : <Lock className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                          {achievement.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`absolute top-2 right-2 text-xs ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                )
              })}
            </div>

            <AnimatePresence>
              {selectedAchievement && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
                  >
                    {(() => {
                      const achievement = allAchievements.find((a) => a.id === selectedAchievement)
                      if (!achievement) return null

                      const isUnlocked = achievements.includes(achievement.id)

                      return (
                        <>
                          <div className="text-center mb-6">
                            <div
                              className={`mx-auto p-4 rounded-full mb-4 ${
                                isUnlocked
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : "bg-slate-200 dark:bg-slate-700 opacity-60"
                              }`}
                            >
                              <div className="w-12 h-12 flex items-center justify-center">
                                {isUnlocked ? achievement.icon : <Lock className="h-8 w-8 text-slate-400" />}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{achievement.name}</h3>
                            <Badge
                              variant="outline"
                              className={`mb-2 ${getRarityColor(achievement.rarity)}`}
                            >
                              {achievement.rarity}
                            </Badge>
                            <p className="text-slate-600 dark:text-slate-400">{achievement.description}</p>
                          </div>

                          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Reward</span>
                              <div className="flex items-center">
                                <Gift className="h-4 w-4 mr-1 text-purple-500" />
                                <span className="text-sm font-medium">{achievement.xpReward} XP</span>
                              </div>
                            </div>
                          </div>

                          {isUnlocked ? (
                            <div className="text-center text-green-600 dark:text-green-400 font-medium mb-4">
                              Achievement Unlocked!
                            </div>
                          ) : (
                            <div className="text-center text-slate-600 dark:text-slate-400 mb-4">
                              Keep interacting with your pet to unlock this achievement!
                            </div>
                          )}

                          <Button
                            className="w-full"
                            onClick={() => setSelectedAchievement(null)}
                          >
                            Close
                          </Button>
                        </>
                      )
                    })()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </>
  )
}
