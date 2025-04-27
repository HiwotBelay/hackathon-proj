"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechRecognitionHook {
  transcript: string
  listening: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  browserSupportsSpeechRecognition: boolean
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== "undefined" && 
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      
      setBrowserSupportsSpeechRecognition(true)
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"
      
      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex
        const transcriptResult = event.results[current][0].transcript
        setTranscript(transcriptResult)
      }
      
      recognitionInstance.onend = () => {
        setListening(false)
      }
      
      setRecognition(recognitionInstance)
    }
    
    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !listening) {
      try {
        recognition.start()
        setListening(true)
        setTranscript("")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }, [recognition, listening])

  const stopListening = useCallback(() => {
    if (recognition && listening) {
      recognition.stop()
      setListening(false)
    }
  }, [recognition, listening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  }
}
