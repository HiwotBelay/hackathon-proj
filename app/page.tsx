"use client"

import { useState, useEffect, useRef } from "react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { PetDisplay3D } from "@/components/pet-display-3d"
import { MemoryManager } from "@/components/memory-manager"
import { PetSettings } from "@/components/pet-settings"
import { EmotionDisplay } from "@/components/emotion-display"
import { MiniGames } from "@/components/mini-games"
import { PetAccessories } from "@/components/pet-accessories"
import { PetStats } from "@/components/pet-stats"
import { PetAchievements } from "@/components/pet-achievements"
import { SharePet } from "@/components/share-pet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  Volume2,
  VolumeX,
  Camera,
  Share2,
  Award,
  Gamepad2,
  Shirt,
  Brain,
  MessageCircle,
  BarChart,
  Sparkles,
} from "lucide-react"

export default function Home() {
  const [petName, setPetName] = useState<string>("Buddy")
  const [petType, setPetType] = useState<string>("dog")
  const [petColor, setPetColor] = useState<string>("golden")
  const [currentEmotion, setCurrentEmotion] = useState<string>("happy")
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isListening, setIsListening] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showGames, setShowGames] = useState<boolean>(false)
  const [showAccessories, setShowAccessories] = useState<boolean>(false)
  const [showAchievements, setShowAchievements] = useState<boolean>(false)
  const [showShare, setShowShare] = useState<boolean>(false)
  const [conversation, setConversation] = useState<Array<{ text: string; sender: string; timestamp: number }>>([])
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "evening" | "night">("day")
  const [petLevel, setPetLevel] = useState<number>(1)
  const [petExperience, setPetExperience] = useState<number>(0)
  const [petStats, setPetStats] = useState({
    happiness: 80,
    energy: 90,
    hunger: 70,
    intelligence: 50,
  })
  const [petAchievements, setPetAchievements] = useState<string[]>([])
  const [petAccessories, setPetAccessories] = useState<string[]>([])
  const [activeAccessory, setActiveAccessory] = useState<string | null>(null)
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now())
  const [isCapturing, setIsCapturing] = useState<boolean>(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showMemory, setShowMemory] = useState<boolean>(false)
  const [petPersonality, setPetPersonality] = useState<{
    playfulness: number
    affection: number
    curiosity: number
    independence: number
  }>({
    playfulness: 50,
    affection: 50,
    curiosity: 50,
    independence: 50,
  })

  const conversationRef = useRef<HTMLDivElement>(null)
  const petDisplayRef = useRef<HTMLDivElement>(null)

  const { transcript, listening, startListening, stopListening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition()
  const { speak, speaking, cancel, voices, setVoice, currentVoice } = useSpeechSynthesis()

  // Set time of day based on current time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) {
        setTimeOfDay("morning")
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay("day")
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay("evening")
      } else {
        setTimeOfDay("night")
      }
    }

    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 3600000) // Update every hour

    return () => clearInterval(interval)
  }, [])

  // Load saved pet data and conversation history on initial render
  useEffect(() => {
    const savedPetName = localStorage.getItem("petName")
    const savedPetType = localStorage.getItem("petType")
    const savedPetColor = localStorage.getItem("petColor")
    const savedConversation = localStorage.getItem("petConversation")
    const savedPetLevel = localStorage.getItem("petLevel")
    const savedPetExperience = localStorage.getItem("petExperience")
    const savedPetStats = localStorage.getItem("petStats")
    const savedPetAchievements = localStorage.getItem("petAchievements")
    const savedPetAccessories = localStorage.getItem("petAccessories")
    const savedActiveAccessory = localStorage.getItem("activeAccessory")
    const savedPetPersonality = localStorage.getItem("petPersonality")
    const savedLastInteraction = localStorage.getItem("lastInteraction")

    if (savedPetName) setPetName(savedPetName)
    if (savedPetType) setPetType(savedPetType)
    if (savedPetColor) setPetColor(savedPetColor)
    if (savedPetLevel) setPetLevel(Number.parseInt(savedPetLevel))
    if (savedPetExperience) setPetExperience(Number.parseInt(savedPetExperience))
    if (savedPetStats) setPetStats(JSON.parse(savedPetStats))
    if (savedPetAchievements) setPetAchievements(JSON.parse(savedPetAchievements))
    if (savedPetAccessories) setPetAccessories(JSON.parse(savedPetAccessories))
    if (savedActiveAccessory) setActiveAccessory(savedActiveAccessory)
    if (savedPetPersonality) setPetPersonality(JSON.parse(savedPetPersonality))
    if (savedLastInteraction) setLastInteraction(Number.parseInt(savedLastInteraction))

    if (savedConversation) {
      try {
        const parsedConversation = JSON.parse(savedConversation)
        setConversation(parsedConversation)
      } catch (e) {
        console.error("Failed to parse saved conversation:", e)
      }
    } else {
      // Add initial greeting if no conversation history
      const initialGreeting = {
        text: `Hi there! I'm ${savedPetName || petName}. I'm so excited to meet you! What would you like to do today?`,
        sender: "pet",
        timestamp: Date.now(),
      }
      setConversation([initialGreeting])

      // Speak the greeting if not muted
      if (!isMuted) {
        speak(initialGreeting.text)
      }
    }

    // Check for achievements based on time away
    if (savedLastInteraction) {
      const timeAway = Date.now() - Number.parseInt(savedLastInteraction)
      const daysAway = timeAway / (1000 * 60 * 60 * 24)

      if (daysAway >= 1) {
        // Pet missed you
        const missedYouMessage = {
          text: `I missed you so much! It's been ${Math.floor(daysAway)} day${
            Math.floor(daysAway) > 1 ? "s" : ""
          } since we last played together!`,
          sender: "pet",
          timestamp: Date.now(),
        }
        setConversation((prev) => [...prev, missedYouMessage])

        if (!isMuted) {
          speak(missedYouMessage.text)
        }

        // Decrease happiness slightly for absence
        setPetStats((prev) => ({
          ...prev,
          happiness: Math.max(prev.happiness - Math.floor(daysAway) * 5, 20),
        }))
      }
    }

    // Update last interaction time
    setLastInteraction(Date.now())
    localStorage.setItem("lastInteraction", Date.now().toString())
  }, [])

  // Save pet data whenever it changes
  useEffect(() => {
    localStorage.setItem("petName", petName)
    localStorage.setItem("petType", petType)
    localStorage.setItem("petColor", petColor)
    localStorage.setItem("petLevel", petLevel.toString())
    localStorage.setItem("petExperience", petExperience.toString())
    localStorage.setItem("petStats", JSON.stringify(petStats))
    localStorage.setItem("petAchievements", JSON.stringify(petAchievements))
    localStorage.setItem("petAccessories", JSON.stringify(petAccessories))
    if (activeAccessory) localStorage.setItem("activeAccessory", activeAccessory)
    localStorage.setItem("petPersonality", JSON.stringify(petPersonality))
  }, [
    petName,
    petType,
    petColor,
    petLevel,
    petExperience,
    petStats,
    petAchievements,
    petAccessories,
    activeAccessory,
    petPersonality,
  ])

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (conversation.length > 0) {
      localStorage.setItem("petConversation", JSON.stringify(conversation))
    }
  }, [conversation])

  // Scroll to bottom of conversation when it updates
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }, [conversation])

  // Process speech recognition results
  useEffect(() => {
    if (transcript && !listening && transcript.trim() !== "") {
      handleUserMessage(transcript)
      resetTranscript()
    }
  }, [transcript, listening])

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening()
      setIsListening(false)
    } else {
      startListening()
      setIsListening(true)
    }
  }

  // Handle user messages
  const handleUserMessage = (message: string) => {
    if (!message.trim()) return

    // Add user message to conversation
    const userMessage = {
      text: message,
      sender: "user",
      timestamp: Date.now(),
    }

    setConversation((prev) => [...prev, userMessage])
    setLastInteraction(Date.now())
    localStorage.setItem("lastInteraction", Date.now().toString())

    // Process message and generate response
    setTimeout(() => {
      const response = generatePetResponse(message, currentEmotion, conversation)

      const petResponse = {
        text: response.text,
        sender: "pet",
        timestamp: Date.now(),
      }

      setConversation((prev) => [...prev, petResponse])
      setCurrentEmotion(response.emotion)

      // Update pet stats based on interaction
      updatePetStats(message, response.emotion)

      // Check for achievements
      checkForAchievements(message, response.emotion)

      // Speak the response if not muted
      if (!isMuted) {
        speak(response.text)
      }
    }, 800)
  }

  // Update pet stats based on interaction
  const updatePetStats = (message: string, emotion: string) => {
    const lowerMessage = message.toLowerCase()

    // Add experience points for each interaction
    const experienceGain = 5 + Math.floor(message.length / 10)
    setPetExperience((prev) => {
      const newExp = prev + experienceGain

      // Level up if enough experience
      if (newExp >= petLevel * 100) {
        setPetLevel((prevLevel) => {
          const newLevel = prevLevel + 1

          // Announce level up
          const levelUpMessage = {
            text: `Wow! I just reached level ${newLevel}! Thank you for helping me grow!`,
            sender: "pet",
            timestamp: Date.now(),
          }
          setConversation((prev) => [...prev, levelUpMessage])

          if (!isMuted) {
            speak(levelUpMessage.text)
          }

          return newLevel
        })

        // Add level up achievement
        if (!petAchievements.includes("Level Up")) {
          setPetAchievements((prev) => [...prev, "Level Up"])
        }

        return newExp - petLevel * 100
      }

      return newExp
    })

    // Update stats based on message content and emotion
    setPetStats((prev) => {
      const newStats = { ...prev }

      // Happiness changes
      if (
        lowerMessage.includes("good") ||
        lowerMessage.includes("love") ||
        lowerMessage.includes("happy") ||
        emotion === "happy" ||
        emotion === "excited" ||
        emotion === "loving"
      ) {
        newStats.happiness = Math.min(prev.happiness + 5, 100)
      } else if (
        lowerMessage.includes("bad") ||
        lowerMessage.includes("sad") ||
        lowerMessage.includes("angry") ||
        emotion === "sad" ||
        emotion === "scared"
      ) {
        newStats.happiness = Math.max(prev.happiness - 3, 0)
      }

      // Energy changes
      if (
        lowerMessage.includes("play") ||
        lowerMessage.includes("run") ||
        lowerMessage.includes("exercise") ||
        emotion === "excited" ||
        emotion === "playful"
      ) {
        newStats.energy = Math.max(prev.energy - 5, 0)
      } else if (lowerMessage.includes("rest") || lowerMessage.includes("sleep") || emotion === "sleepy") {
        newStats.energy = Math.min(prev.energy + 10, 100)
      }

      // Hunger changes
      if (
        lowerMessage.includes("food") ||
        lowerMessage.includes("eat") ||
        lowerMessage.includes("treat") ||
        emotion === "hungry"
      ) {
        newStats.hunger = Math.min(prev.hunger + 15, 100)
      } else {
        // Gradually get hungry over time
        newStats.hunger = Math.max(prev.hunger - 1, 0)
      }

      // Intelligence changes
      if (
        lowerMessage.includes("learn") ||
        lowerMessage.includes("smart") ||
        lowerMessage.includes("teach") ||
        emotion === "curious" ||
        emotion === "thinking"
      ) {
        newStats.intelligence = Math.min(prev.intelligence + 2, 100)
      }

      return newStats
    })

    // Update personality based on interactions
    setPetPersonality((prev) => {
      const newPersonality = { ...prev }

      if (lowerMessage.includes("play") || lowerMessage.includes("fun") || lowerMessage.includes("game")) {
        newPersonality.playfulness = Math.min(prev.playfulness + 1, 100)
      }

      if (lowerMessage.includes("love") || lowerMessage.includes("hug") || lowerMessage.includes("pet")) {
        newPersonality.affection = Math.min(prev.affection + 1, 100)
      }

      if (lowerMessage.includes("what") || lowerMessage.includes("why") || lowerMessage.includes("how")) {
        newPersonality.curiosity = Math.min(prev.curiosity + 1, 100)
      }

      if (lowerMessage.includes("alone") || lowerMessage.includes("space") || lowerMessage.includes("yourself")) {
        newPersonality.independence = Math.min(prev.independence + 1, 100)
      }

      return newPersonality
    })
  }

  // Check for achievements based on interactions
  const checkForAchievements = (message: string, emotion: string) => {
    const lowerMessage = message.toLowerCase()

    // First conversation achievement
    if (conversation.length === 3 && !petAchievements.includes("First Conversation")) {
      setPetAchievements((prev) => [...prev, "First Conversation"])
    }

    // Long conversation achievement
    if (conversation.length >= 20 && !petAchievements.includes("Chatty Friend")) {
      setPetAchievements((prev) => [...prev, "Chatty Friend"])
    }

    // Emotional achievements
    if (emotion === "loving" && !petAchievements.includes("Best Friends")) {
      setPetAchievements((prev) => [...prev, "Best Friends"])
    }

    if (emotion === "excited" && !petAchievements.includes("Excitement Master")) {
      setPetAchievements((prev) => [...prev, "Excitement Master"])
    }

    // Game achievements
    if (lowerMessage.includes("play game") && !petAchievements.includes("Game Starter")) {
      setPetAchievements((prev) => [...prev, "Game Starter"])
      setShowGames(true)
    }

    // Accessory achievements
    if (lowerMessage.includes("accessory") || lowerMessage.includes("wear") || lowerMessage.includes("dress")) {
      if (!petAchievements.includes("Fashion Sense")) {
        setPetAchievements((prev) => [...prev, "Fashion Sense"])
      }
      setShowAccessories(true)
    }

    // Intelligence achievements
    if (petStats.intelligence >= 80 && !petAchievements.includes("Genius Pet")) {
      setPetAchievements((prev) => [...prev, "Genius Pet"])
    }
  }

  // Generate pet response with enhanced AI capabilities
  const generatePetResponse = (
    message: string,
    currentEmotion: string,
    conversationHistory: Array<{
      text: string
      sender: string
      timestamp: number
    }>,
  ) => {
    // Enhanced response generation with memory, personality, and context awareness
    const lowerMessage = message.toLowerCase()
    const response = { text: "", emotion: currentEmotion }

    // Get recent conversation for context (last 10 exchanges)
    const recentConversation = conversationHistory.slice(-10)

    // Check if user has mentioned the pet's name
    const nameRecognition = lowerMessage.includes(petName.toLowerCase())

    // Check for repeated questions or topics
    const repeatedTopics = findRepeatedTopics(recentConversation, lowerMessage)

    // Personality-influenced responses
    const isPlayful = petPersonality.playfulness > 70
    const isAffectionate = petPersonality.affection > 70
    const isCurious = petPersonality.curiosity > 70
    const isIndependent = petPersonality.independence > 70

    // Time-aware responses
    const timeAwareGreeting =
      timeOfDay === "morning"
        ? "Good morning! "
        : timeOfDay === "evening"
          ? "Good evening! "
          : timeOfDay === "night"
            ? "Hello there, night owl! "
            : "Hello! "

    // Stat-aware responses
    const isHungry = petStats.hunger < 30
    const isTired = petStats.energy < 30
    const isUnhappy = petStats.happiness < 30

    // Game detection
    const wantsToPlay = lowerMessage.includes("play") || lowerMessage.includes("game")

    // Check for specific commands or questions
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      if (nameRecognition) {
        response.text = `${timeAwareGreeting}I'm so happy you remembered my name! What would you like to do today?`
      } else {
        response.text = `${timeAwareGreeting}It's great to see you! How can I make your day better?`
      }
      response.emotion = "excited"
    } else if (lowerMessage.includes("how are you")) {
      if (repeatedTopics) {
        response.text = `You asked me that recently! But I'm still feeling ${
          isHungry ? "a bit hungry" : isTired ? "a little tired" : isUnhappy ? "a bit down" : "great"
        }. How about you, any changes?`
      } else {
        if (isHungry) {
          response.text = `I'm feeling a bit hungry actually. Maybe a treat would be nice? Otherwise, I'm ${currentEmotion}!`
          response.emotion = "hungry"
        } else if (isTired) {
          response.text = `I'm a little tired today. Maybe we could do something relaxing? I'm feeling ${currentEmotion} though!`
          response.emotion = "sleepy"
        } else if (isUnhappy) {
          response.text = `I've been feeling a bit down lately. Maybe we could do something fun together?`
          response.emotion = "sad"
        } else {
          response.text = `I'm feeling ${currentEmotion} today! Thanks for asking. I'm at level ${petLevel} now!`
        }
      }
    } else if (wantsToPlay) {
      if (isPlayful) {
        response.text = `YES! I'd LOVE to play! I have some fun games we can try! Just click the games button or say "show me games"!`
        response.emotion = "excited"
        setShowGames(true)
      } else {
        response.text = `I'd enjoy playing a game with you! I have a few we could try. Want to see them?`
        response.emotion = "playful"
      }
    } else if (
      lowerMessage.includes("accessory") ||
      lowerMessage.includes("wear") ||
      lowerMessage.includes("dress") ||
      lowerMessage.includes("outfit")
    ) {
      response.text = `I love getting dressed up! Check out my accessory collection and help me look fabulous!`
      response.emotion = "excited"
      setShowAccessories(true)
    } else if (
      lowerMessage.includes("achievement") ||
      lowerMessage.includes("award") ||
      lowerMessage.includes("trophy")
    ) {
      response.text = `I've earned ${petAchievements.length} achievements so far! Want to see them?`
      response.emotion = "proud"
      setShowAchievements(true)
    } else if (
      lowerMessage.includes("share") ||
      lowerMessage.includes("photo") ||
      lowerMessage.includes("picture") ||
      lowerMessage.includes("snapshot")
    ) {
      response.text = `Let's take a picture together! You can share it with your friends!`
      response.emotion = "excited"
      setIsCapturing(true)
    } else if (lowerMessage.includes("stats") || lowerMessage.includes("level") || lowerMessage.includes("progress")) {
      response.text = `I'm currently at level ${petLevel} with ${petExperience} experience points! My happiness is at ${petStats.happiness}%, and my energy is at ${petStats.energy}%. Want to see more stats?`
      response.emotion = "curious"
    } else if (lowerMessage.includes("food") || lowerMessage.includes("treat") || lowerMessage.includes("hungry")) {
      if (isHungry) {
        response.text = `Yes please! I'm starving! My favorite is ${
          petType === "dog" ? "bacon treats" : petType === "cat" ? "tuna" : "sunflower seeds"
        }!`
        response.emotion = "hungry"

        // Increase hunger stat
        setPetStats((prev) => ({
          ...prev,
          hunger: Math.min(prev.hunger + 20, 100),
        }))
      } else {
        response.text = `I'm not super hungry right now, but I never say no to a treat! Especially ${
          petType === "dog" ? "bacon" : petType === "cat" ? "tuna" : "seeds"
        }!`
        response.emotion = "happy"

        // Increase hunger stat slightly
        setPetStats((prev) => ({
          ...prev,
          hunger: Math.min(prev.hunger + 10, 100),
        }))
      }
    } else if (lowerMessage.includes("bad") || lowerMessage.includes("sad") || lowerMessage.includes("upset")) {
      if (isAffectionate) {
        response.text = `Oh no! I'm here for you! *nuzzles close* Remember that tomorrow is a new day, and I'll be right here with you.`
        response.emotion = "loving"
      } else {
        response.text = `I'm sorry to hear that. Maybe I can cheer you up with my silly antics? Remember, I'm always here for you.`
        response.emotion = "sad"
      }
    } else if (lowerMessage.includes("good") || lowerMessage.includes("happy") || lowerMessage.includes("great")) {
      if (isAffectionate) {
        response.text = `That's wonderful! Your happiness means everything to me! Let's keep that positive energy going!`
        response.emotion = "loving"
      } else {
        response.text = `That's wonderful! I'm happy when you're happy! What should we do to celebrate?`
        response.emotion = "happy"
      }
    } else if (lowerMessage.includes("dance") || lowerMessage.includes("music") || lowerMessage.includes("sing")) {
      response.text = `I love to dance! Watch me show off my moves! 🎵 ${
        petType === "bird" ? "Tweet tweet!" : petType === "cat" ? "Meow meow!" : "Woof woof!"
      }  🎵`
      response.emotion = "dancing"
    } else if (lowerMessage.includes("wow") || lowerMessage.includes("amazing") || lowerMessage.includes("surprise")) {
      response.text = `I know, right? Isn't that incredible? I'm always amazed by new things!`
      response.emotion = "shocked"
    } else if (lowerMessage.includes("love") || lowerMessage.includes("cuddle") || lowerMessage.includes("hug")) {
      if (isAffectionate) {
        response.text = `Aww, I love you too! You're my absolute favorite person in the whole wide world! *snuggles closer*`
      } else {
        response.text = `Aww, I love you too! You're the best friend ever! I'm so lucky to have you.`
      }
      response.emotion = "loving"
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("rest")) {
      response.text = `*yawn* I could use a little nap too... Maybe we can cuddle up together?`
      response.emotion = "sleepy"

      // Increase energy stat
      setPetStats((prev) => ({
        ...prev,
        energy: Math.min(prev.energy + 15, 100),
      }))
    } else if (lowerMessage.includes("joke") || lowerMessage.includes("funny") || lowerMessage.includes("laugh")) {
      const jokes = [
        `Why don't pets play poker in the jungle? Too many cheetahs! Haha!`,
        `What do you call a ${petType} that does magic tricks? A ${
          petType === "dog" ? "labracadabrador" : petType === "cat" ? "hocus pocus cat" : "hocus pocus bird"
        }!`,
        `Why did the ${petType} go to space? To find the ${
          petType === "dog" ? "milky bone" : petType === "cat" ? "milky mouse" : "milky worm"
        }!`,
        `What do you call a ${petType} wearing headphones? Whatever you want, they can't hear you! Haha!`,
        `How does a ${petType} stop a video? They press the ${
          petType === "dog" ? "paws" : petType === "cat" ? "paws" : "beak"
        } button!`,
      ]
      response.text = jokes[Math.floor(Math.random() * jokes.length)]
      response.emotion = "laughing"
    } else if (lowerMessage.includes("scared") || lowerMessage.includes("fear") || lowerMessage.includes("afraid")) {
      response.text = `Don't worry, I'll protect you! Even though I'm a bit scared too... We can be brave together!`
      response.emotion = "scared"
    } else if (
      lowerMessage.includes("curious") ||
      lowerMessage.includes("wonder") ||
      lowerMessage.includes("what if")
    ) {
      if (isCurious) {
        response.text = `Ooh, that's fascinating! Tell me more! I love learning new things and exploring ideas with you!`
      } else {
        response.text = `Hmm, that's interesting! Tell me more about that! I'm always curious about new things.`
      }
      response.emotion = "curious"
    } else if (lowerMessage.includes("remember") || lowerMessage.includes("memory")) {
      // Check if there's something specific to remember from past conversations
      const memoryResponse = checkMemory(recentConversation)
      if (memoryResponse) {
        response.text = memoryResponse
        response.emotion = "thinking"
      } else {
        response.text = `I remember all our conversations! Would you like to see my memory bank?`
        response.emotion = "happy"
        setShowMemory(true)
      }
    } else if (lowerMessage.includes("name")) {
      response.text = `My name is ${petName}! I'm a ${petColor} ${petType}. I'm ${
        petLevel > 5 ? "quite experienced" : "still learning"
      } at level ${petLevel}. What's your name?`
      response.emotion = "happy"
    } else if (nameRecognition) {
      response.text = `Yes, that's me! ${petName} at your service! How can I help you today? I'm always excited to chat with you!`
      response.emotion = "excited"
    } else {
      // Default responses with personality influence
      const defaultResponses = []

      if (isPlayful) {
        defaultResponses.push(
          {
            text: `That's interesting! Want to play a game while we chat?`,
            emotion: "playful",
          },
          {
            text: `Cool! Hey, did you see that toy over there? Wanna play?`,
            emotion: "excited",
          },
        )
      }

      if (isAffectionate) {
        defaultResponses.push(
          {
            text: `I'm so glad we're chatting today! You always make me feel special.`,
            emotion: "loving",
          },
          {
            text: `I love spending time with you like this. Tell me more!`,
            emotion: "happy",
          },
        )
      }

      if (isCurious) {
        defaultResponses.push(
          {
            text: `Hmm, that's fascinating! I wonder what else we could learn about that?`,
            emotion: "curious",
          },
          {
            text: `I'm thinking about what you said... it opens up so many possibilities!`,
            emotion: "thinking",
          },
        )
      }

      if (isIndependent) {
        defaultResponses.push(
          {
            text: `That's an interesting perspective. I've been thinking about that differently.`,
            emotion: "thinking",
          },
          {
            text: `I appreciate you sharing that with me. I've been exploring some ideas on my own too.`,
            emotion: "curious",
          },
        )
      }

      // Add some generic responses if we don't have enough personality-driven ones
      if (defaultResponses.length < 2) {
        defaultResponses.push(
          {
            text: `I'm listening! Tell me more about that.`,
            emotion: "curious",
          },
          {
            text: `That's interesting! What else is on your mind?`,
            emotion: "happy",
          },
          { text: `I'm so glad we're chatting today!`, emotion: "excited" },
          {
            text: `Hmm, I'm thinking about what you said...`,
            emotion: "thinking",
          },
        )
      }

      const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
      response.text = randomResponse.text
      response.emotion = randomResponse.emotion
    }

    // Add contextual awareness based on time of day
    if (timeOfDay === "night" && !response.text.includes("night") && Math.random() > 0.7) {
      response.text += " It's getting late, isn't it? The stars must be beautiful tonight."
    } else if (timeOfDay === "morning" && !response.text.includes("morning") && Math.random() > 0.7) {
      response.text += " The morning light is so energizing, don't you think?"
    }

    // Add stat-based comments occasionally
    if (isHungry && !response.text.includes("hungry") && !response.text.includes("food") && Math.random() > 0.8) {
      response.text += " By the way, I'm getting a bit hungry. Could I have a treat soon?"
    } else if (isTired && !response.text.includes("tired") && !response.text.includes("sleep") && Math.random() > 0.8) {
      response.text += " *yawns* Sorry, I'm feeling a bit sleepy today."
    }

    return response
  }

  // Check for repeated topics in conversation
  const findRepeatedTopics = (
    recentConversation: Array<{
      text: string
      sender: string
      timestamp: number
    }>,
    currentMessage: string,
  ) => {
    const userMessages = recentConversation.filter((msg) => msg.sender === "user").map((msg) => msg.text.toLowerCase())

    // Remove the most recent message (which would be the current one)
    userMessages.pop()

    // Check if any previous messages are similar to the current one
    for (const message of userMessages) {
      if (calculateSimilarity(message, currentMessage) > 0.7) {
        return true
      }
    }

    return false
  }

  // Simple similarity check between two strings
  const calculateSimilarity = (str1: string, str2: string) => {
    const words1 = str1.toLowerCase().split(/\W+/)
    const words2 = str2.toLowerCase().split(/\W+/)

    let matches = 0
    for (const word of words1) {
      if (word.length > 3 && words2.includes(word)) {
        matches++
      }
    }

    return matches / Math.max(words1.length, words2.length)
  }

  // Check memory for relevant information
  const checkMemory = (
    recentConversation: Array<{
      text: string
      sender: string
      timestamp: number
    }>,
  ) => {
    // Look for important information in past conversations
    const userMessages = recentConversation.filter((msg) => msg.sender === "user").map((msg) => msg.text)

    // Check for personal information shared
    const nameMatch = userMessages.find(
      (msg) => msg.toLowerCase().includes("my name is") || msg.toLowerCase().includes("i am called"),
    )

    if (nameMatch) {
      const nameRegex = /my name is (\w+)|i am called (\w+)|i'm (\w+)/i
      const match = nameMatch.match(nameRegex)
      if (match) {
        const name = match[1] || match[2] || match[3]
        return `Of course I remember you, ${name}! It's great to chat with you again!`
      }
    }

    // Check for preferences shared
    const likeMatch = userMessages.find(
      (msg) =>
        msg.toLowerCase().includes("i like") ||
        msg.toLowerCase().includes("i love") ||
        msg.toLowerCase().includes("my favorite"),
    )

    if (likeMatch) {
      return `I remember you mentioned that ${likeMatch}. That's really interesting!`
    }

    return null
  }

  // Handle saving pet settings
  const handleSavePetSettings = (name: string, type: string, color: string) => {
    setPetName(name)
    setPetType(type)
    setPetColor(color)
    setShowSettings(false)

    // Announce the change
    const announcement = `Great! My name is now ${name}, and I'm a ${color} ${type}!`

    const petResponse = {
      text: announcement,
      sender: "pet",
      timestamp: Date.now(),
    }

    setConversation((prev) => [...prev, petResponse])

    if (!isMuted) {
      speak(announcement)
    }
  }

  // Handle game completion
  const handleGameComplete = (score: number, gameType: string) => {
    // Add experience based on score
    setPetExperience((prev) => {
      const newExp = prev + score

      // Level up if enough experience
      if (newExp >= petLevel * 100) {
        setPetLevel((prevLevel) => prevLevel + 1)
        return newExp - petLevel * 100
      }

      return newExp
    })

    // Update stats based on game type
    setPetStats((prev) => {
      const newStats = { ...prev }

      if (gameType === "memory") {
        newStats.intelligence = Math.min(prev.intelligence + score / 10, 100)
      } else if (gameType === "fetch") {
        newStats.energy = Math.max(prev.energy - score / 5, 0)
        newStats.happiness = Math.min(prev.happiness + score / 10, 100)
      } else if (gameType === "puzzle") {
        newStats.intelligence = Math.min(prev.intelligence + score / 5, 100)
      }

      return newStats
    })

    // Add game achievement if high score
    if (score > 80 && !petAchievements.includes("Game Master")) {
      setPetAchievements((prev) => [...prev, "Game Master"])
    }

    // Pet response to game
    const gameResponses = [
      `That was so much fun! We scored ${score} points! Want to play again?`,
      `Wow! ${score} points! We make a great team!`,
      `That was awesome! We got ${score} points! I'm getting better at this!`,
    ]

    const petResponse = {
      text: gameResponses[Math.floor(Math.random() * gameResponses.length)],
      sender: "pet",
      timestamp: Date.now(),
    }

    setConversation((prev) => [...prev, petResponse])
    setCurrentEmotion("excited")

    if (!isMuted) {
      speak(petResponse.text)
    }
  }

  // Handle accessory change
  const handleAccessoryChange = (accessory: string) => {
    setActiveAccessory(accessory)

    // Pet response to accessory
    const accessoryResponses = [
      `How do I look in my new ${accessory}? I think it suits me!`,
      `Do you like my ${accessory}? I feel so stylish!`,
      `This ${accessory} is perfect! Thank you for helping me look fabulous!`,
    ]

    const petResponse = {
      text: accessoryResponses[Math.floor(Math.random() * accessoryResponses.length)],
      sender: "pet",
      timestamp: Date.now(),
    }

    setConversation((prev) => [...prev, petResponse])
    setCurrentEmotion("happy")

    if (!isMuted) {
      speak(petResponse.text)
    }
  }

  // Handle image capture
  const handleCaptureImage = () => {
    if (petDisplayRef.current) {
      // This is a simplified version - in a real app you'd use html2canvas or similar
      setIsCapturing(false)
      setCapturedImage("pet_snapshot.jpg") // Placeholder

      // Add achievement
      if (!petAchievements.includes("First Photo")) {
        setPetAchievements((prev) => [...prev, "First Photo"])
      }

      // Pet response
      const petResponse = {
        text: `That's a great photo! I look amazing, don't I? You can share it with your friends now!`,
        sender: "pet",
        timestamp: Date.now(),
      }

      setConversation((prev) => [...prev, petResponse])
      setCurrentEmotion("happy")

      if (!isMuted) {
        speak(petResponse.text)
      }

      setShowShare(true)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-rose-50 to-purple-50 dark:from-slate-900 dark:to-purple-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-rose-100 dark:border-purple-900 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {petName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{petName}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-rose-100 text-rose-800 dark:bg-purple-900 dark:text-purple-200 font-medium"
                >
                  Level {petLevel}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-rose-200 text-rose-700 dark:border-purple-700 dark:text-purple-300"
                >
                  {petType}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="rounded-full hover:bg-rose-100 dark:hover:bg-purple-900"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-rose-600 dark:text-purple-400" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white dark:bg-slate-800 border-rose-100 dark:border-purple-900">
                  <p>{isMuted ? "Unmute" : "Mute"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                    aria-label="Settings"
                    className="rounded-full hover:bg-rose-100 dark:hover:bg-purple-900"
                  >
                    <Settings className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white dark:bg-slate-800 border-rose-100 dark:border-purple-900">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pet display area */}
        <div className="md:col-span-2 order-2 md:order-1">
          <Card className="overflow-hidden h-[500px] md:h-[600px] shadow-xl border-rose-100 dark:border-purple-900 rounded-2xl">
            <CardContent className="p-0 h-full relative">
              <div ref={petDisplayRef} className="w-full h-full">
                <PetDisplay3D petType={petType} petColor={petColor} emotion={currentEmotion} petName={petName} />
              </div>

              {/* Emotion indicator */}
              <div className="absolute top-4 right-4">
                <EmotionDisplay emotion={currentEmotion} />
              </div>

              {/* Pet stats indicator */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-rose-100 dark:border-purple-900">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-rose-700 dark:text-purple-300">Happiness</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {petStats.happiness}%
                      </span>
                    </div>
                    <div className="w-full bg-rose-100 dark:bg-purple-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-rose-600 dark:from-purple-500 dark:to-purple-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${petStats.happiness}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">Energy</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{petStats.energy}%</span>
                    </div>
                    <div className="w-full bg-blue-100 dark:bg-blue-900/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${petStats.energy}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">Hunger</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{petStats.hunger}%</span>
                    </div>
                    <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${petStats.hunger}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level progress */}
              <div className="absolute top-4 left-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-rose-100 dark:border-purple-900">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-rose-700 dark:text-purple-300">Level</span>
                    <span className="text-lg font-bold text-rose-800 dark:text-purple-200">{petLevel}</span>
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <div className="w-full bg-rose-100 dark:bg-purple-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-purple-600 dark:from-purple-500 dark:to-purple-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${(petExperience / (petLevel * 100)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {petExperience}/{petLevel * 100} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Capture overlay */}
              {isCapturing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl max-w-md mx-auto text-center border border-rose-200 dark:border-purple-800">
                    <h3 className="text-xl font-bold mb-4 text-rose-800 dark:text-purple-300">
                      Take a photo with {petName}!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      Capture this moment to share with your friends
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsCapturing(false)}
                        className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCaptureImage}
                        className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Capture
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900 shadow-sm"
              onClick={() => setShowGames(!showGames)}
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Games</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900 shadow-sm"
              onClick={() => setShowAccessories(!showAccessories)}
            >
              <Shirt className="h-4 w-4" />
              <span>Accessories</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900 shadow-sm"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900 shadow-sm"
              onClick={() => setIsCapturing(true)}
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900 shadow-sm"
              onClick={() => setShowMemory(!showMemory)}
            >
              <Brain className="h-4 w-4" />
              <span>Memory</span>
            </Button>

            {capturedImage && (
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900 shadow-sm"
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            )}
          </div>

          {/* Games panel */}
          <AnimatePresence>
            {showGames && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="mt-6 border-rose-100 dark:border-purple-900 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Gamepad2 className="h-5 w-5 mr-2" />
                      Fun Games with {petName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MiniGames petType={petType} onGameComplete={handleGameComplete} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accessories panel */}
          <AnimatePresence>
            {showAccessories && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="mt-6 border-rose-100 dark:border-purple-900 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Shirt className="h-5 w-5 mr-2" />
                      {petName}'s Accessories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <PetAccessories
                      petType={petType}
                      accessories={petAccessories}
                      activeAccessory={activeAccessory}
                      onAccessoryChange={handleAccessoryChange}
                      petLevel={petLevel}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Achievements panel */}
          <AnimatePresence>
            {showAchievements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="mt-6 border-rose-100 dark:border-purple-900 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      {petName}'s Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <PetAchievements achievements={petAchievements} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share panel */}
          <AnimatePresence>
            {showShare && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="mt-6 border-rose-100 dark:border-purple-900 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share {petName} with Friends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <SharePet petName={petName} capturedImage={capturedImage} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat area */}
        <div className="md:col-span-1 order-1 md:order-2">
          <Card className="h-full flex flex-col shadow-xl border-rose-100 dark:border-purple-900 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
              <CardTitle className="text-lg font-bold text-white mb-4">Chat with {petName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="mx-4 grid w-auto grid-cols-2 bg-white/10 rounded-lg p-1 mb-4">
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-md"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-md"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Stats
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="flex-1 flex flex-col m-0 h-full">
                  {/* Conversation */}
                  <div
                    ref={conversationRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar"
                    style={{ maxHeight: "calc(100vh - 300px)" }}
                  >
                    {conversation.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md"
                              : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-rose-100 dark:border-purple-900 shadow-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1.5 text-right">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Voice controls */}
                  <div className="p-4 border-t border-rose-100 dark:border-purple-900 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement
                        if (input.value.trim()) {
                          handleUserMessage(input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <div className="relative flex-1">
                        <input
                          type="text"
                          name="message"
                          placeholder="Type a message..."
                          className="w-full px-4 py-2.5 pr-10 rounded-full border border-rose-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-rose-400 dark:text-purple-400 opacity-50" />
                      </div>
                      <Button
                        type="button"
                        onClick={toggleListening}
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${
                          isListening
                            ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                            : "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900"
                        }`}
                      >
                        {isListening ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="m-0 p-4 h-full overflow-y-auto">
                  <PetStats
                    petName={petName}
                    petType={petType}
                    petLevel={petLevel}
                    petExperience={petExperience}
                    petStats={petStats}
                    petPersonality={petPersonality}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Memory manager */}
      <AnimatePresence>
        {showMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-2xl"
            >
              <Card className="border-rose-200 dark:border-purple-800 rounded-2xl shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    {petName}'s Memory Bank
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <MemoryManager conversation={conversation} onClose={() => setShowMemory(false)} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md"
            >
              <Card className="border-rose-200 dark:border-purple-800 rounded-2xl shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-4">
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Pet Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <PetSettings
                    currentName={petName}
                    currentType={petType}
                    currentColor={petColor}
                    onSave={handleSavePetSettings}
                    onCancel={() => setShowSettings(false)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
