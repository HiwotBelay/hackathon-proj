"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Share2, Copy, Download, Twitter, Facebook, Instagram, Link, Check } from 'lucide-react'

interface SharePetProps {
  petName: string
  capturedImage: string | null
}

export function SharePet({ petName, capturedImage }: SharePetProps) {
  const [caption, setCaption] = useState(`Check out my virtual pet ${petName}! #PetTwin`)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("social")
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  // Handle social media sharing
  const handleShare = (platform: string) => {
    setIsSharing(true)
    
    // Simulate API call to share
    setTimeout(() => {
      setIsSharing(false)
      
      toast({
        title: "Shared Successfully!",
        description: `Your pet has been shared on ${platform}.`,
      })
    }, 1500)
  }

  // Handle copy link
  const handleCopyLink = () => {
    // In a real app, this would be a shareable link
    navigator.clipboard.writeText(`https://pet-twin.vercel.app/share/${petName.toLowerCase().replace(/\s+/g, "-")}`)
    setCopied(true)
    
    toast({
      title: "Link Copied!",
      description: "Share link has been copied to clipboard.",
    })
    
    setTimeout(() => setCopied(false), 3000)
  }

  // Handle download image
  const handleDownload = () => {
    // In a real app, this would download the actual image
    toast({
      title: "Image Downloaded!",
      description: "Your pet image has been saved to your device.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Pet</CardTitle>
        <CardDescription>Show off your amazing pet to friends</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {capturedImage ? (
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
            <img 
              src="/placeholder.svg?height=300&width=500" 
              alt={`${petName} snapshot`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white text-sm font-medium">{petName}</p>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">No image captured yet</p>
          </div>
        )}
        
        <Textarea
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="resize-none"
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleShare("Twitter")}
                disabled={isSharing || !capturedImage}
              >
                <Twitter className="h-6 w-6 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleShare("Facebook")}
                disabled={isSharing || !capturedImage}
              >
                <Facebook className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleShare("Instagram")}
                disabled={isSharing || !capturedImage}
              >
                <Instagram className="h-6 w-6 text-pink-600" />
                <span className="text-xs">Instagram</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                readOnly 
                value={`https://pet-twin.vercel.app/share/${petName.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
                disabled={copied}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2 h-12"
                onClick={handleDownload}
                disabled={!capturedImage}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download Image</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2 h-12"
                onClick={() => {
                  toast({
                    title: "QR Code Generated!",
                    description: "QR code has been generated for your pet.",
                  })
                }}
                disabled={!capturedImage}
              >
                <Link className="h-4 w-4 mr-2" />
                <span>Generate QR Code</span>
              </Button>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Share Statistics</h4>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <p>Views: 0</p>
                <p>Likes: 0</p>
                <p>Comments: 0</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
