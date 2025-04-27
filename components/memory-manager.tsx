"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Clock, X } from "lucide-react"

interface MemoryManagerProps {
  conversation: Array<{ text: string; sender: string; timestamp: number }>
}

export function MemoryManager({ conversation }: MemoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract memories from conversation
  const memories = extractMemories(conversation)

  // Group conversations by day
  const conversationsByDay = groupConversationsByDay(conversation)

  return (
    <>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <Brain className="h-4 w-4" />
        <span>Memory Bank</span>
      </Button>

      {isOpen && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pet Memory Bank</CardTitle>
              <CardDescription>Your pet remembers these important details</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <Tabs defaultValue="memories">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="memories">
                <Brain className="h-4 w-4 mr-2" />
                Memories
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="memories">
              <CardContent className="space-y-4 pt-4">
                {memories.length > 0 ? (
                  <ul className="space-y-2">
                    {memories.map((memory, index) => (
                      <li key={index} className="bg-slate-50 p-3 rounded-md">
                        <div className="font-medium">{memory.type}</div>
                        <div className="text-sm text-slate-600">{memory.content}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-slate-500">No memories stored yet. Keep chatting!</p>
                )}
              </CardContent>
            </TabsContent>

            <TabsContent value="history">
              <CardContent className="space-y-4 pt-4">
                {Object.keys(conversationsByDay).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(conversationsByDay).map(([day, messages]) => (
                      <div key={day}>
                        <h3 className="font-medium mb-2">{day}</h3>
                        <ul className="space-y-2">
                          {messages.map((message, index) => (
                            <li
                              key={index}
                              className={`p-2 rounded-md ${message.sender === "user" ? "bg-blue-50" : "bg-slate-50"}`}
                            >
                              <div className="text-sm">{message.text}</div>
                              <div className="text-xs text-slate-500">{formatTime(message.timestamp)}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500">No conversation history yet.</p>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => clearMemories()}>
              Clear Memories
            </Button>
            <Button variant="outline" size="sm" onClick={() => clearHistory()}>
              Clear History
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

// Extract important memories from conversation
function extractMemories(conversation: Array<{ text: string; sender: string; timestamp: number }>) {
  const memories: Array<{ type: string; content: string }> = []

  // Look for patterns in user messages that might contain important information
  conversation.forEach((message) => {
    if (message.sender === "user") {
      // Check for personal information
      const nameMatch = message.text.match(/my name is (\w+)|i am called (\w+)|i'm (\w+)/i)
      if (nameMatch) {
        const name = nameMatch[1] || nameMatch[2] || nameMatch[3]
        memories.push({
          type: "Personal Information",
          content: `User's name is ${name}`,
        })
      }

      // Check for preferences
      const likeMatch = message.text.match(/i (?:like|love|enjoy) (.+?)(?:\.|!|\?|$)/i)
      if (likeMatch) {
        memories.push({
          type: "Preference",
          content: `User likes ${likeMatch[1]}`,
        })
      }

      // Check for dislikes
      const dislikeMatch = message.text.match(/i (?:dislike|hate|don't like) (.+?)(?:\.|!|\?|$)/i)
      if (dislikeMatch) {
        memories.push({
          type: "Preference",
          content: `User dislikes ${dislikeMatch[1]}`,
        })
      }

      // Check for important events
      const eventMatch = message.text.match(/(?:today|yesterday|tomorrow) (?:is|was|will be) (.+?)(?:\.|!|\?|$)/i)
      if (eventMatch) {
        memories.push({
          type: "Event",
          content: eventMatch[0],
        })
      }
    }
  })

  // Remove duplicates
  const uniqueMemories = memories.filter(
    (memory, index, self) => index === self.findIndex((m) => m.content === memory.content),
  )

  return uniqueMemories
}

// Group conversations by day
function groupConversationsByDay(conversation: Array<{ text: string; sender: string; timestamp: number }>) {
  const grouped: Record<string, Array<{ text: string; sender: string; timestamp: number }>> = {}

  conversation.forEach((message) => {
    const date = new Date(message.timestamp)
    const day = date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })

    if (!grouped[day]) {
      grouped[day] = []
    }

    grouped[day].push(message)
  })

  return grouped
}

// Format timestamp to readable time
function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Clear memories from localStorage
function clearMemories() {
  // This would need to be implemented with proper state management
  if (confirm("Are you sure you want to clear all memories? This cannot be undone.")) {
    console.log("Memories cleared")
    // Implementation would depend on how memories are stored
  }
}

// Clear conversation history from localStorage
function clearHistory() {
  if (confirm("Are you sure you want to clear conversation history? This cannot be undone.")) {
    localStorage.removeItem("petConversation")
    window.location.reload()
  }
}
