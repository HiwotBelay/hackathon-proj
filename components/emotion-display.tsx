"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Smile,
  Frown,
  Zap,
  PlayCircle,
  Coffee,
  AlertCircle,
  Music,
  Moon,
  Laugh,
  AlertTriangle,
  Search,
} from "lucide-react"

interface EmotionDisplayProps {
  emotion: string
}

export function EmotionDisplay({ emotion }: EmotionDisplayProps) {
  // Map emotions to icons and colors
  const emotionMap: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    happy: {
      icon: <Smile className="h-4 w-4 mr-1" />,
      color: "bg-green-100 text-green-800 hover:bg-green-100",
      label: "Happy",
    },
    sad: {
      icon: <Frown className="h-4 w-4 mr-1" />,
      color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      label: "Sad",
    },
    excited: {
      icon: <Zap className="h-4 w-4 mr-1" />,
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      label: "Excited",
    },
    playful: {
      icon: <PlayCircle className="h-4 w-4 mr-1" />,
      color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      label: "Playful",
    },
    hungry: {
      icon: <Coffee className="h-4 w-4 mr-1" />,
      color: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      label: "Hungry",
    },
    shocked: {
      icon: <AlertCircle className="h-4 w-4 mr-1" />,
      color: "bg-red-100 text-red-800 hover:bg-red-100",
      label: "Shocked",
    },
    dancing: {
      icon: <Music className="h-4 w-4 mr-1" />,
      color: "bg-pink-100 text-pink-800 hover:bg-pink-100",
      label: "Dancing",
    },
    loving: {
      icon: <Heart className="h-4 w-4 mr-1" />,
      color: "bg-red-100 text-red-800 hover:bg-red-100",
      label: "Loving",
    },
    sleepy: {
      icon: <Moon className="h-4 w-4 mr-1" />,
      color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
      label: "Sleepy",
    },
    laughing: {
      icon: <Laugh className="h-4 w-4 mr-1" />,
      color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      label: "Laughing",
    },
    scared: {
      icon: <AlertTriangle className="h-4 w-4 mr-1" />,
      color: "bg-slate-100 text-slate-800 hover:bg-slate-100",
      label: "Scared",
    },
    curious: {
      icon: <Search className="h-4 w-4 mr-1" />,
      color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
      label: "Curious",
    },
    thinking: {
      icon: <Search className="h-4 w-4 mr-1" />,
      color: "bg-teal-100 text-teal-800 hover:bg-teal-100",
      label: "Thinking",
    },
  }

  // Default emotion if not found
  const defaultEmotion = {
    icon: <Smile className="h-4 w-4 mr-1" />,
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    label: emotion,
  }

  const emotionData = emotionMap[emotion] || defaultEmotion

  return (
    <div className="flex items-center justify-center">
      <Badge variant="outline" className={`flex items-center ${emotionData.color}`}>
        {emotionData.icon}
        <span className="capitalize">{emotionData.label}</span>
      </Badge>
    </div>
  )
}
