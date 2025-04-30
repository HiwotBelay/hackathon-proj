"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, X, Star, Sparkles } from "lucide-react"

interface PetAccessoriesProps {
  petType: string
  accessories?: string[]
  activeAccessory?: string | null
  onAccessoryChange: (accessory: string) => void
  petLevel: number
}

export function PetAccessories({
  petType,
  accessories = [],
  activeAccessory = null,
  onAccessoryChange,
  petLevel = 1,
}: PetAccessoriesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewAccessory, setPreviewAccessory] = useState<string | null>(null)

  // Reset preview when component unmounts or when active accessory changes
  useEffect(() => {
    setPreviewAccessory(null)

    return () => {
      setPreviewAccessory(null)
    }
  }, [activeAccessory])

  // Define accessories by category and pet type
  const accessoriesData = {
    hats: [
      { id: "party_hat", name: "Party Hat", cost: 50, emoji: "🎩", petTypes: ["dog", "cat", "bird"], minLevel: 1 },
      { id: "crown", name: "Royal Crown", cost: 200, emoji: "👑", petTypes: ["dog", "cat", "bird"], minLevel: 5 },
      { id: "wizard_hat", name: "Wizard Hat", cost: 150, emoji: "🧙", petTypes: ["dog", "cat", "bird"], minLevel: 3 },
      { id: "cowboy_hat", name: "Cowboy Hat", cost: 100, emoji: "🤠", petTypes: ["dog", "cat"], minLevel: 2 },
      { id: "beanie", name: "Cozy Beanie", cost: 60, emoji: "🧢", petTypes: ["dog", "cat", "bird"], minLevel: 1 },
      {
        id: "flower_crown",
        name: "Flower Crown",
        cost: 120,
        emoji: "🌸",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 2,
      },
      { id: "pirate_hat", name: "Pirate Hat", cost: 180, emoji: "☠️", petTypes: ["dog", "cat", "bird"], minLevel: 4 },
    ],
    outfits: [
      { id: "sweater", name: "Cozy Sweater", cost: 75, emoji: "🧶", petTypes: ["dog", "cat"], minLevel: 1 },
      { id: "raincoat", name: "Raincoat", cost: 80, emoji: "☔", petTypes: ["dog"], minLevel: 2 },
      { id: "tuxedo", name: "Formal Tuxedo", cost: 150, emoji: "🤵", petTypes: ["dog", "cat", "bird"], minLevel: 4 },
      {
        id: "superhero",
        name: "Superhero Cape",
        cost: 120,
        emoji: "🦸",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 3,
      },
      { id: "space_suit", name: "Space Suit", cost: 250, emoji: "👨‍🚀", petTypes: ["dog", "cat", "bird"], minLevel: 6 },
      { id: "hawaiian_shirt", name: "Hawaiian Shirt", cost: 90, emoji: "🌺", petTypes: ["dog", "cat"], minLevel: 2 },
      { id: "winter_coat", name: "Winter Coat", cost: 110, emoji: "❄️", petTypes: ["dog", "cat"], minLevel: 3 },
      { id: "ballet_tutu", name: "Ballet Tutu", cost: 130, emoji: "💃", petTypes: ["dog", "cat", "bird"], minLevel: 3 },
    ],
    toys: [
      { id: "ball", name: "Bouncy Ball", cost: 30, emoji: "🎾", petTypes: ["dog"], minLevel: 1 },
      { id: "mouse", name: "Toy Mouse", cost: 25, emoji: "🐭", petTypes: ["cat"], minLevel: 1 },
      { id: "frisbee", name: "Frisbee", cost: 40, emoji: "🥏", petTypes: ["dog"], minLevel: 2 },
      { id: "yarn", name: "Ball of Yarn", cost: 20, emoji: "🧶", petTypes: ["cat"], minLevel: 1 },
      { id: "perch", name: "Fancy Perch", cost: 60, emoji: "🪵", petTypes: ["bird"], minLevel: 1 },
      { id: "squeaky_toy", name: "Squeaky Toy", cost: 35, emoji: "🦴", petTypes: ["dog"], minLevel: 1 },
      { id: "laser_pointer", name: "Laser Pointer", cost: 45, emoji: "🔴", petTypes: ["cat"], minLevel: 2 },
      { id: "mirror", name: "Shiny Mirror", cost: 50, emoji: "🪞", petTypes: ["bird"], minLevel: 2 },
      { id: "tunnel", name: "Play Tunnel", cost: 70, emoji: "🚇", petTypes: ["cat", "dog"], minLevel: 3 },
    ],
    special: [
      { id: "jetpack", name: "Jetpack", cost: 500, emoji: "🚀", petTypes: ["dog", "cat", "bird"], minLevel: 10 },
      {
        id: "sunglasses",
        name: "Cool Sunglasses",
        cost: 100,
        emoji: "😎",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 3,
      },
      { id: "wings", name: "Angel Wings", cost: 300, emoji: "👼", petTypes: ["dog", "cat", "bird"], minLevel: 7 },
      { id: "guitar", name: "Tiny Guitar", cost: 250, emoji: "🎸", petTypes: ["dog", "cat", "bird"], minLevel: 5 },
      { id: "magic_wand", name: "Magic Wand", cost: 280, emoji: "✨", petTypes: ["dog", "cat", "bird"], minLevel: 6 },
      { id: "hoverboard", name: "Hoverboard", cost: 450, emoji: "🛹", petTypes: ["dog", "cat"], minLevel: 9 },
      {
        id: "glowing_aura",
        name: "Glowing Aura",
        cost: 350,
        emoji: "🌟",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 8,
      },
      {
        id: "rainbow_trail",
        name: "Rainbow Trail",
        cost: 320,
        emoji: "🌈",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 7,
      },
      { id: "time_watch", name: "Time Watch", cost: 400, emoji: "⌚", petTypes: ["dog", "cat", "bird"], minLevel: 8 },
    ],
    seasonal: [
      {
        id: "santa_hat",
        name: "Santa Hat",
        cost: 150,
        emoji: "🎅",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 2,
        season: "winter",
      },
      {
        id: "bunny_ears",
        name: "Bunny Ears",
        cost: 120,
        emoji: "🐰",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 2,
        season: "spring",
      },
      {
        id: "witch_hat",
        name: "Witch Hat",
        cost: 130,
        emoji: "🧙‍♀️",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 2,
        season: "fall",
      },
      {
        id: "beach_umbrella",
        name: "Beach Umbrella",
        cost: 140,
        emoji: "🏖️",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 2,
        season: "summer",
      },
      {
        id: "pumpkin_costume",
        name: "Pumpkin Costume",
        cost: 160,
        emoji: "🎃",
        petTypes: ["dog", "cat"],
        minLevel: 3,
        season: "fall",
      },
      {
        id: "reindeer_antlers",
        name: "Reindeer Antlers",
        cost: 170,
        emoji: "🦌",
        petTypes: ["dog", "cat"],
        minLevel: 3,
        season: "winter",
      },
      {
        id: "flower_lei",
        name: "Flower Lei",
        cost: 110,
        emoji: "🌺",
        petTypes: ["dog", "cat", "bird"],
        minLevel: 2,
        season: "summer",
      },
      {
        id: "easter_basket",
        name: "Easter Basket",
        cost: 130,
        emoji: "🧺",
        petTypes: ["dog", "cat"],
        minLevel: 3,
        season: "spring",
      },
    ],
  }

  // Filter accessories by pet type
  const filterByPetType = (items: any[]) => {
    return items.filter((item) => item.petTypes.includes(petType))
  }

  // Handle preview hover
  const handlePreview = (accessoryId: string | null) => {
    setPreviewAccessory(accessoryId)

    // If accessory is null, we're removing the preview
    if (accessoryId === null) {
      // Send a temporary event to update the 3D model
      const event = new CustomEvent("accessoryPreviewChange", {
        detail: { accessory: activeAccessory },
      })
      window.dispatchEvent(event)
    } else {
      // Send a temporary event to update the 3D model
      const event = new CustomEvent("accessoryPreviewChange", {
        detail: { accessory: accessoryId },
      })
      window.dispatchEvent(event)
    }
  }

  // Handle equip/unequip
  const handleAccessoryChange = (accessoryId: string) => {
    // Clear preview first
    setPreviewAccessory(null)

    // Then change the actual accessory
    onAccessoryChange(accessoryId)

    // Dispatch event for immediate 3D model update
    const event = new CustomEvent("accessoryChange", {
      detail: { accessory: accessoryId },
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="space-y-4">
      {!isOpen && (
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-rose-100 to-purple-100 hover:from-rose-200 hover:to-purple-200 dark:from-rose-900/30 dark:to-purple-900/30 dark:hover:from-rose-900/50 dark:hover:to-purple-900/50 border-rose-200 dark:border-purple-700 text-rose-700 dark:text-purple-300"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Accessories</span>
          {activeAccessory && <Sparkles className="h-3 w-3 ml-1 text-amber-500" />}
        </Button>
      )}

      {isOpen && (
        <Card className="w-full border-rose-100 dark:border-purple-900 rounded-xl shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-900/20 dark:to-purple-900/20 border-b border-rose-100 dark:border-purple-900 p-4">
            <div className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-rose-800 dark:text-purple-300">Pet Accessories</CardTitle>
                <CardDescription>Customize your pet with fun items</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-rose-100 text-rose-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  <Star className="h-3 w-3" />
                  <span>Level {petLevel}</span>
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <Tabs defaultValue="equipped">
              <TabsList className="grid grid-cols-6 mb-4 bg-rose-50 dark:bg-purple-900/30">
                <TabsTrigger value="equipped">Equipped</TabsTrigger>
                <TabsTrigger value="hats">Hats</TabsTrigger>
                <TabsTrigger value="outfits">Outfits</TabsTrigger>
                <TabsTrigger value="toys">Toys</TabsTrigger>
                <TabsTrigger value="special">Special</TabsTrigger>
                <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
              </TabsList>

              <TabsContent value="equipped">
                {activeAccessory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(() => {
                      // Find the accessory details from all categories
                      const accessory = Object.values(accessoriesData)
                        .flat()
                        .find((a) => a.id === activeAccessory)

                      if (!accessory) return null

                      return (
                        <AccessoryCard
                          key={accessory.id}
                          accessory={accessory}
                          isEquipped={true}
                          canAfford={true}
                          isOwned={true}
                          onAction={() => handleAccessoryChange("")}
                          onMouseEnter={() => handlePreview(accessory.id)}
                          onMouseLeave={() => handlePreview(null)}
                          actionLabel="Remove"
                        />
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No accessories equipped yet.</p>
                    <p className="text-sm">Browse the tabs to find and equip accessories!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hats">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.hats)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={handleAccessoryChange}
                  onPreview={handlePreview}
                />
              </TabsContent>

              <TabsContent value="outfits">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.outfits)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={handleAccessoryChange}
                  onPreview={handlePreview}
                />
              </TabsContent>

              <TabsContent value="toys">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.toys)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={handleAccessoryChange}
                  onPreview={handlePreview}
                />
              </TabsContent>

              <TabsContent value="special">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.special)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={handleAccessoryChange}
                  onPreview={handlePreview}
                />
              </TabsContent>

              <TabsContent value="seasonal">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.seasonal)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={handleAccessoryChange}
                  onPreview={handlePreview}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface AccessoryGridProps {
  accessories: any[]
  petLevel: number
  activeAccessory: string | null
  onAccessoryChange: (accessory: string) => void
  onPreview: (accessory: string | null) => void
}

function AccessoryGrid({ accessories, petLevel, activeAccessory, onAccessoryChange, onPreview }: AccessoryGridProps) {
  // In a real app, this would come from a database or state
  const ownedAccessories = accessories.filter((acc) => acc.minLevel <= petLevel).map((acc) => acc.id)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {accessories.map((accessory) => {
        const isOwned = ownedAccessories.includes(accessory.id)
        const isEquipped = accessory.id === activeAccessory
        const canAfford = true // In a real app, this would check against user's points/currency
        const isLocked = accessory.minLevel > petLevel

        return (
          <AccessoryCard
            key={accessory.id}
            accessory={accessory}
            isEquipped={isEquipped}
            canAfford={canAfford}
            isOwned={isOwned}
            isLocked={isLocked}
            onAction={
              isEquipped ? () => onAccessoryChange("") : isOwned ? () => onAccessoryChange(accessory.id) : undefined
            }
            onMouseEnter={() => (isOwned && !isLocked ? onPreview(accessory.id) : null)}
            onMouseLeave={() => (isOwned && !isLocked ? onPreview(null) : null)}
            actionLabel={
              isEquipped
                ? "Unequip"
                : isOwned
                  ? "Equip"
                  : isLocked
                    ? `Unlocks at Level ${accessory.minLevel}`
                    : "Purchase"
            }
          />
        )
      })}
    </div>
  )
}

interface AccessoryCardProps {
  accessory: any
  isEquipped: boolean
  canAfford: boolean
  isOwned?: boolean
  isLocked?: boolean
  onAction?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  actionLabel?: string
}

function AccessoryCard({
  accessory,
  isEquipped,
  canAfford,
  isOwned = false,
  isLocked = false,
  onAction,
  onMouseEnter,
  onMouseLeave,
  actionLabel,
}: AccessoryCardProps) {
  return (
    <Card
      className={`${isLocked ? "opacity-60" : ""} ${isEquipped ? "border-rose-300 dark:border-purple-600" : ""} transition-all duration-200 hover:shadow-md`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="text-base">{accessory.name}</span>
          <span className="text-2xl">{accessory.emoji}</span>
        </CardTitle>
        <CardDescription>
          {isOwned ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Owned
            </Badge>
          ) : isLocked ? (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              Level {accessory.minLevel}+
            </Badge>
          ) : (
            <span>Cost: {accessory.cost}</span>
          )}
          {accessory.season && (
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {accessory.season.charAt(0).toUpperCase() + accessory.season.slice(1)}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0">
        <Button
          variant={isEquipped ? "default" : "secondary"}
          size="sm"
          className={`w-full ${isEquipped ? "bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700" : ""}`}
          disabled={!onAction || isLocked}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
