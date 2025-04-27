"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechSynthesisHook {
  speak: (text: string) => void
  cancel: () => void
  speaking: boolean
  voices: SpeechSynthesisVoice[]
  setVoice: (voice: SpeechSynthesisVoice) => void
  currentVoice: SpeechSynthesisVoice | null
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Get available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length > 0) {
          setVoices(availableVoices)

          // Set a default voice (preferably a friendly sounding one)
          const defaultVoice =
            availableVoices.find(
              (voice) =>
                voice.name.includes("Female") || voice.name.includes("Google") || voice.name.includes("Samantha"),
            ) || availableVoices[0]

          setCurrentVoice(defaultVoice)
        }
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }

      // Handle speaking state changes
      const handleSpeakingChange = () => {
        setSpeaking(window.speechSynthesis.speaking)
      }

      // Poll for speaking state changes
      const interval = setInterval(handleSpeakingChange, 100)

      return () => {
        clearInterval(interval)
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        if (currentVoice) {
          utterance.voice = currentVoice
        }

        // Adjust speech parameters based on emotion (could be enhanced)
        utterance.rate = 1.0 // Speed of speech (0.1 to 10)
        utterance.pitch = 1.0 // Pitch of speech (0 to 2)
        utterance.volume = 1.0 // Volume (0 to 1)

        utterance.onstart = () => setSpeaking(true)
        utterance.onend = () => setSpeaking(false)
        utterance.onerror = () => setSpeaking(false)

        window.speechSynthesis.speak(utterance)
      }
    },
    [currentVoice],
  )

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [])

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice)
  }, [])

  return {
    speak,
    cancel,
    speaking,
    voices,
    setVoice,
    currentVoice,
  }
}
