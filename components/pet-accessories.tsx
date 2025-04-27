"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, X, Star } from "lucide-react"

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

  // Define accessories by category and pet type
  const accessoriesData = {
    hats: [
      { id: "party_hat", name: "Party Hat", cost: 50, emoji: "🎩", petTypes: ["dog", "cat", "bird"], minLevel: 1 },
      { id: "crown", name: "Royal Crown", cost: 200, emoji: "👑", petTypes: ["dog", "cat", "bird"], minLevel: 5 },
      { id: "wizard_hat", name: "Wizard Hat", cost: 150, emoji: "🧙", petTypes: ["dog", "cat", "bird"], minLevel: 3 },
      { id: "cowboy_hat", name: "Cowboy Hat", cost: 100, emoji: "🤠", petTypes: ["dog", "cat"], minLevel: 2 },
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
    ],
    toys: [
      { id: "ball", name: "Bouncy Ball", cost: 30, emoji: "🎾", petTypes: ["dog"], minLevel: 1 },
      { id: "mouse", name: "Toy Mouse", cost: 25, emoji: "🐭", petTypes: ["cat"], minLevel: 1 },
      { id: "frisbee", name: "Frisbee", cost: 40, emoji: "🥏", petTypes: ["dog"], minLevel: 2 },
      { id: "yarn", name: "Ball of Yarn", cost: 20, emoji: "🧶", petTypes: ["cat"], minLevel: 1 },
      { id: "perch", name: "Fancy Perch", cost: 60, emoji: "🪵", petTypes: ["bird"], minLevel: 1 },
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
    ],
  }

  // Filter accessories by pet type
  const filterByPetType = (items: any[]) => {
    return items.filter((item) => item.petTypes.includes(petType))
  }

  return (
    <>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <ShoppingBag className="h-4 w-4" />
        <span>Accessories</span>
      </Button>

      {isOpen && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pet Accessories</CardTitle>
              <CardDescription>Customize your pet with fun items</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>Level {petLevel}</span>
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="equipped">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="equipped">Equipped</TabsTrigger>
                <TabsTrigger value="hats">Hats</TabsTrigger>
                <TabsTrigger value="outfits">Outfits</TabsTrigger>
                <TabsTrigger value="toys">Toys</TabsTrigger>
                <TabsTrigger value="special">Special</TabsTrigger>
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
                          onAction={() => onAccessoryChange("")}
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
                  onAccessoryChange={onAccessoryChange}
                />
              </TabsContent>

              <TabsContent value="outfits">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.outfits)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={onAccessoryChange}
                />
              </TabsContent>

              <TabsContent value="toys">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.toys)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={onAccessoryChange}
                />
              </TabsContent>

              <TabsContent value="special">
                <AccessoryGrid
                  accessories={filterByPetType(accessoriesData.special)}
                  petLevel={petLevel}
                  activeAccessory={activeAccessory}
                  onAccessoryChange={onAccessoryChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  )
}

interface AccessoryGridProps {
  accessories: any[]
  petLevel: number
  activeAccessory: string | null
  onAccessoryChange: (accessory: string) => void
}

function AccessoryGrid({ accessories, petLevel, activeAccessory, onAccessoryChange }: AccessoryGridProps) {
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
  actionLabel?: string
}

function AccessoryCard({
  accessory,
  isEquipped,
  canAfford,
  isOwned = false,
  isLocked = false,
  onAction,
  actionLabel,
}: AccessoryCardProps) {
  return (
    <Card className={isLocked ? "opacity-60" : ""}>
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
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0">
        <Button
          variant={isEquipped ? "default" : "secondary"}
          size="sm"
          className="w-full"
          disabled={!onAction || isLocked}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
