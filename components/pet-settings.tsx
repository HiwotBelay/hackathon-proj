"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PetSettingsProps {
  currentName: string
  currentType: string
  currentColor: string
  onSave: (name: string, type: string, color: string) => void
  onCancel: () => void
}

export function PetSettings({ currentName, currentType, currentColor, onSave, onCancel }: PetSettingsProps) {
  const [name, setName] = useState(currentName)
  const [type, setType] = useState(currentType)
  const [color, setColor] = useState(currentColor)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(name, type, color)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pet Settings</CardTitle>
        <CardDescription>Customize your digital pet twin</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pet-name">Pet Name</Label>
            <Input
              id="pet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your pet's name"
              required
            />
          </div>

          <Tabs defaultValue="type" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="type">Pet Type</TabsTrigger>
              <TabsTrigger value="color">Pet Color</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="pt-4">
              <RadioGroup value={type} onValueChange={setType} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="dog" id="dog" className="peer sr-only" />
                  <Label
                    htmlFor="dog"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-2xl mb-2">🐕</span>
                    <span className="text-sm font-medium">Dog</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="cat" id="cat" className="peer sr-only" />
                  <Label
                    htmlFor="cat"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-2xl mb-2">🐈</span>
                    <span className="text-sm font-medium">Cat</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="bird" id="bird" className="peer sr-only" />
                  <Label
                    htmlFor="bird"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-2xl mb-2">🐦</span>
                    <span className="text-sm font-medium">Bird</span>
                  </Label>
                </div>
              </RadioGroup>
            </TabsContent>

            <TabsContent value="color" className="pt-4">
              <div className="grid grid-cols-4 gap-4">
                {type === "dog" && (
                  <>
                    <ColorOption id="golden" label="Golden" color="#D4A464" currentColor={color} onChange={setColor} />
                    <ColorOption id="brown" label="Brown" color="#8B4513" currentColor={color} onChange={setColor} />
                    <ColorOption id="black" label="Black" color="#2D2D2D" currentColor={color} onChange={setColor} />
                    <ColorOption id="white" label="White" color="#F5F5F5" currentColor={color} onChange={setColor} />
                  </>
                )}

                {type === "cat" && (
                  <>
                    <ColorOption id="orange" label="Orange" color="#F7A23B" currentColor={color} onChange={setColor} />
                    <ColorOption id="gray" label="Gray" color="#808080" currentColor={color} onChange={setColor} />
                    <ColorOption id="black" label="Black" color="#2D2D2D" currentColor={color} onChange={setColor} />
                    <ColorOption id="white" label="White" color="#F5F5F5" currentColor={color} onChange={setColor} />
                  </>
                )}

                {type === "bird" && (
                  <>
                    <ColorOption id="blue" label="Blue" color="#4F86F7" currentColor={color} onChange={setColor} />
                    <ColorOption id="red" label="Red" color="#FF6B6B" currentColor={color} onChange={setColor} />
                    <ColorOption id="green" label="Green" color="#4CAF50" currentColor={color} onChange={setColor} />
                    <ColorOption id="yellow" label="Yellow" color="#FFEB3B" currentColor={color} onChange={setColor} />
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

interface ColorOptionProps {
  id: string
  label: string
  color: string
  currentColor: string
  onChange: (color: string) => void
}

function ColorOption({ id, label, color, currentColor, onChange }: ColorOptionProps) {
  return (
    <div>
      <input
        type="radio"
        id={id}
        name="color"
        value={id}
        checked={currentColor === id}
        onChange={() => onChange(id)}
        className="sr-only peer"
      />
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary"
      >
        <span className="w-6 h-6 rounded-full mb-2" style={{ backgroundColor: color }}></span>
        <span className="text-sm font-medium">{label}</span>
      </label>
    </div>
  )
}
