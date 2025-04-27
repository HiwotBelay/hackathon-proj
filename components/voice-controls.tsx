"use client"

import { useState, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, MicOff } from 'lucide-react'
import { motion } from "framer-motion"

interface VoiceControlsProps {
  onUserMessage: (message: string) => void
  isMuted: boolean
  isListening: boolean
  toggleListening: () => void
}

export function VoiceControls({ onUserMessage, isMuted, isListening, toggleListening }: VoiceControlsProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (message.trim()) {
      onUserMessage(message)
      setMessage("")

      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder={isListening ? "Listening..." : "Type your message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`shadow-sm ${
            isListening
              ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
              : "border-slate-200 focus-visible:ring-slate-400"
          }`}
        />

        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={toggleListening}
          aria-label={isListening ? "Stop Listening" : "Start Listening"}
          className={`shadow-sm transition-all duration-300 ${
            isListening ? "animate-pulse" : ""
          }`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          type="submit"
          size="icon"
          disabled={!message.trim()}
          className="shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-12 left-0 right-0 bg-red-100 text-red-800 text-sm py-2 px-4 rounded-md text-center"
        >
          Listening... Speak now!
        </motion.div>
      )}
    </motion.div>
  )
}
