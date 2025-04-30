"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  MessageCircle,
  Gamepad2,
  Shirt,
  Award,
  Brain,
  Settings,
  Bell,
  Gift,
  Crown,
  Heart,
  Zap,
  Utensils,
  Activity,
  User,
} from "lucide-react";

// Modern UI components for the pet app

export function ModernHeader({
  coins,
  notifications,
  showNotification,
  setShowNotification,
  clearNotifications,
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 border-b">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Crown className="mr-2 h-6 w-6 text-yellow-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pet Twin
          </span>
        </div>

        {/* User Info and Controls */}
        <div className="flex items-center space-x-4">
          {/* Coins Display */}
          <div className="flex items-center rounded-full border bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1">
            <Gift className="mr-2 h-4 w-4" />
            <span className="font-bold">{coins}</span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotification(!showNotification)}
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Notification Badge */}
            {notifications.filter((notification) => !notification.read).length >
              0 && (
              <Badge
                variant="destructive"
                className="absolute top-0 right-0 rounded-full px-2 py-0.5 text-xs"
              >
                {
                  notifications.filter((notification) => !notification.read)
                    .length
                }
              </Badge>
            )}
          </div>

          {/* User Avatar */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function ModernNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-2 sm:hidden">
      <div className="flex justify-around">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("home")}
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "chat" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("chat")}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "games" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("games")}
        >
          <Gamepad2 className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "accessories" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("accessories")}
        >
          <Shirt className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "achievements" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("achievements")}
        >
          <Award className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export function ModernStatsCard({
  petName,
  petLevel,
  petExperience,
  petStats,
}) {
  // Calculate XP needed for next level
  const xpForNextLevel = petLevel * 100;
  const xpProgress = (petExperience / xpForNextLevel) * 100;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{petName}'s Stats</CardTitle>
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Level {petLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <Activity className="h-3.5 w-3.5 mr-1 text-blue-600" />
                Experience
              </span>
              <span>
                {petExperience}/{xpForNextLevel}
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 p-2 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Heart className="h-3.5 w-3.5 mr-1 text-red-500" />
                  <span className="text-xs font-medium">Happiness</span>
                </div>
                <span className="text-xs font-medium">
                  {petStats.happiness}%
                </span>
              </div>
              <Progress
                value={petStats.happiness}
                className="h-1.5"
                indicatorColor="bg-red-500"
              />
            </div>

            <div className="bg-white/60 p-2 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Zap className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                  <span className="text-xs font-medium">Energy</span>
                </div>
                <span className="text-xs font-medium">{petStats.energy}%</span>
              </div>
              <Progress
                value={petStats.energy}
                className="h-1.5"
                indicatorColor="bg-yellow-500"
              />
            </div>

            <div className="bg-white/60 p-2 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Utensils className="h-3.5 w-3.5 mr-1 text-green-500" />
                  <span className="text-xs font-medium">Hunger</span>
                </div>
                <span className="text-xs font-medium">{petStats.hunger}%</span>
              </div>
              <Progress
                value={petStats.hunger}
                className="h-1.5"
                indicatorColor="bg-green-500"
              />
            </div>

            <div className="bg-white/60 p-2 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Brain className="h-3.5 w-3.5 mr-1 text-purple-500" />
                  <span className="text-xs font-medium">Intelligence</span>
                </div>
                <span className="text-xs font-medium">
                  {petStats.intelligence}%
                </span>
              </div>
              <Progress
                value={petStats.intelligence}
                className="h-1.5"
                indicatorColor="bg-purple-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModernTabsNavigation({ activeTab, setActiveTab }) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-7 h-14 p-1">
        <TabsTrigger
          value="home"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <Home className="h-4 w-4" />
          <span className="text-xs mt-1">Home</span>
        </TabsTrigger>
        <TabsTrigger
          value="chat"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs mt-1">Chat</span>
        </TabsTrigger>
        <TabsTrigger
          value="games"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <Gamepad2 className="h-4 w-4" />
          <span className="text-xs mt-1">Games</span>
        </TabsTrigger>
        <TabsTrigger
          value="accessories"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <Shirt className="h-4 w-4" />
          <span className="text-xs mt-1">Dress</span>
        </TabsTrigger>
        <TabsTrigger
          value="achievements"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <Award className="h-4 w-4" />
          <span className="text-xs mt-1">Awards</span>
        </TabsTrigger>
        <TabsTrigger
          value="memory"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <Brain className="h-4 w-4" />
          <span className="text-xs mt-1">Memory</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="data-[state=active]:bg-blue-100 flex flex-col items-center justify-center"
        >
          <Settings className="h-4 w-4" />
          <span className="text-xs mt-1">Settings</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
