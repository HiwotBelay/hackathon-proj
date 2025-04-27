"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Target, Puzzle, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MiniGamesProps {
  petType: string
  onGameComplete: (score: number, gameType: string) => void
}

export function MiniGames({ petType, onGameComplete }: MiniGamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Target className="h-4 w-4" />
        <span>Play Games</span>
      </Button>
      
      {isOpen && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pet Games</CardTitle>
              <CardDescription>Play fun games with your pet</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            {!activeGame ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GameCard
                  title="Memory Match"
                  description="Test your memory by matching pairs of cards"
                  icon={<Brain className="h-8 w-8" />}
                  onClick={() => setActiveGame("memory")}
                />
                
                <GameCard
                  title="Fetch"
                  description={`Play fetch with your ${petType}`}
                  icon={<Target className="h-8 w-8" />}
                  onClick={() => setActiveGame("fetch")}
                />
                
                <GameCard
                  title="Puzzle"
                  description="Solve puzzles together with your pet"
                  icon={<Puzzle className="h-8 w-8" />}
                  onClick={() => setActiveGame("puzzle")}
                />
              </div>
            ) : (
              <div>
                {activeGame === "memory" && (
                  <MemoryGame
                    onComplete={(score) => {
                      onGameComplete(score, "memory")
                      setActiveGame(null)
                    }}
                    onCancel={() => setActiveGame(null)}
                  />
                )}
                
                {activeGame === "fetch" && (
                  <FetchGame
                    petType={petType}
                    onComplete={(score) => {
                      onGameComplete(score, "fetch")
                      setActiveGame(null)
                    }}
                    onCancel={() => setActiveGame(null)}
                  />
                )}
                
                {activeGame === "puzzle" && (
                  <PuzzleGame
                    onComplete={(score) => {
                      onGameComplete(score, "puzzle")
                      setActiveGame(null)
                    }}
                    onCancel={() => setActiveGame(null)}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

interface GameCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}

function GameCard({ title, description, icon, onClick }: GameCardProps) {
  return (
    <div 
      className="cursor-pointer transition-all hover:scale-105 active:scale-95"
      onClick={onClick}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center pb-2">
          <div className="p-3 rounded-full bg-primary/10">{icon}</div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">{description}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Memory Match Game
interface MemoryGameProps {
  onComplete: (score: number) => void
  onCancel: () => void
}

function MemoryGame({ onComplete, onCancel }: MemoryGameProps) {
  const emojis = ["🦴", "🐾", "🎾", "🧸", "🦮", "🐶", "🐱", "🦜"]
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  
  // Initialize game
  useEffect(() => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }))
    
    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setGameComplete(false)
    setScore(0)
    setTimeLeft(60)
  }, [])
  
  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || gameComplete) return
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
      if (timeLeft === 1) {
        // Time's up
        calculateScore()
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [timeLeft, gameComplete])
  
  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setCards(cards.map((card, i) => 
          i === first || i === second ? { ...card, matched: true } : card
        ))
        setFlippedCards([])
      } else {
        // No match, flip back after delay
        const timer = setTimeout(() => {
          setCards(cards.map((card, i) => 
            i === first || i === second ? { ...card, flipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
        
        return () => clearTimeout(timer)
      }
      
      setMoves(moves + 1)
      
      // Check if all cards are matched
      const allMatched = cards.every(card => card.matched || flippedCards.includes(card.id))
      if (allMatched) {
        calculateScore()
      }
    }
  }, [flippedCards, cards])
  
  const calculateScore = () => {
    // Calculate score based on moves and time left
    const baseScore = 1000
    const movesPenalty = moves * 10
    const timeBonus = timeLeft * 5
    
    const finalScore = Math.max(0, baseScore - movesPenalty + timeBonus)
    setScore(finalScore)
    setGameComplete(true)
  }
  
  const handleCardClick = (id: number) => {
    if (
      gameComplete || 
      flippedCards.length >= 2 || 
      flippedCards.includes(id) || 
      cards[id].matched || 
      cards[id].flipped
    ) {
      return
    }
    
    // Flip the card
    setCards(cards.map((card, i) => 
      i === id ? { ...card, flipped: true } : card
    ))
    
    setFlippedCards([...flippedCards, id])
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium">Moves: {moves}</p>
          <p className="text-sm font-medium">Time: {timeLeft}s</p>
        </div>
        <Progress value={(timeLeft / 60) * 100} className="w-1/2" />
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              "aspect-square flex items-center justify-center text-2xl rounded-md cursor-pointer transition-all transform",
              card.flipped || card.matched
                ? "bg-primary/20 rotate-y-180"
                : "bg-primary hover:bg-primary/90",
              card.matched && "bg-green-100 text-green-800"
            )}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.flipped || card.matched) && card.emoji}
          </div>
        ))}
      </div>
      
      {gameComplete && (
        <div className="text-center space-y-4 mt-4">
          <h3 className="text-xl font-bold">Game Complete!</h3>
          <p>Your score: {score}</p>
          <Button onClick={() => onComplete(score)}>
            Collect Reward
          </Button>
        </div>
      )}
    </div>
  )
}

// Fetch Game
interface FetchGameProps {
  petType: string
  onComplete: (score: number) => void
  onCancel: () => void
}

function FetchGame({ petType, onComplete, onCancel }: FetchGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameComplete, setGameComplete] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  
  // Start game
  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(30)
    setGameComplete(false)
    moveTarget()
  }
  
  // Move target to random position
  const moveTarget = () => {
    if (!gameAreaRef.current) return
    
    const gameArea = gameAreaRef.current.getBoundingClientRect()
    const maxX = gameArea.width - 50
    const maxY = gameArea.height - 50
    
    setTargetPosition({
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    })
  }
  
  // Handle target click
  const handleTargetClick = () => {
    setScore(score + 1)
    moveTarget()
  }
  
  // Timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
      if (timeLeft === 1) {
        // Time's up
        setGameComplete(true)
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [timeLeft, gameStarted])
  
  return (
    <div className="space-y-4">
      {!gameStarted ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Fetch Game</h3>
          <p>Click on the ball as quickly as possible when it appears!</p>
          <div className="flex justify-center gap-2">
            <Button onClick={startGame}>Start Game</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Score: {score}</p>
              <p className="text-sm font-medium">Time: {timeLeft}s</p>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="w-1/2" />
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          
          <div 
            ref={gameAreaRef}
            className="relative bg-green-50 rounded-lg h-64 overflow-hidden"
          >
            {!gameComplete && (
              <div
                className="absolute w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                style={{ 
                  left: `${targetPosition.x}px`, 
                  top: `${targetPosition.y}px`,
                  backgroundImage: "radial-gradient(circle at 30% 30%, #FFC107 0%, #FF9800 100%)"
                }}
                onClick={handleTargetClick}
              >
                {petType === "dog" ? "🎾" : petType === "cat" ? "🧶" : "🧸"}
              </div>
            )}
            
            {gameComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
                  <h3 className="text-xl font-bold">Game Complete!</h3>
                  <p>Your score: {score}</p>
                  <Button onClick={() => onComplete(score)}>
                    Collect Reward
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Puzzle Game
interface PuzzleGameProps {
  onComplete: (score: number) => void
  onCancel: () => void
}

function PuzzleGame({ onComplete, onCancel }: PuzzleGameProps) {
  const puzzleSize = 3 // 3x3 puzzle
  const [tiles, setTiles] = useState<number[]>([])
  const [emptyIndex, setEmptyIndex] = useState(puzzleSize * puzzleSize - 1)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  
  // Initialize puzzle
  useEffect(() => {
    initializePuzzle()
  }, [])
  
  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || gameComplete) return
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
      if (timeLeft === 1 && !gameComplete) {
        // Time's up
        calculateScore()
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [timeLeft, gameComplete])
  
  const initializePuzzle = () => {
    // Create solved puzzle first
    const solved = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i)
    
    // Shuffle by making random valid moves
    let shuffled = [...solved]
    let currentEmptyIndex = puzzleSize * puzzleSize - 1
    
    // Make 100 random valid moves to shuffle
    for (let i = 0; i < 100; i++) {
      const possibleMoves = getValidMoves(currentEmptyIndex)
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      
      // Swap empty tile with random valid tile
      shuffled = swapTiles(shuffled, currentEmptyIndex, randomMove)
      currentEmptyIndex = randomMove
    }
    
    setTiles(shuffled)
    setEmptyIndex(currentEmptyIndex)
    setMoves(0)
    setGameComplete(false)
    setTimeLeft(60)
  }
  
  const getValidMoves = (emptyIdx: number) => {
    const validMoves = []
    
    // Check up
    if (emptyIdx >= puzzleSize) {
      validMoves.push(emptyIdx - puzzleSize)
    }
    
    // Check down
    if (emptyIdx < puzzleSize * (puzzleSize - 1)) {
      validMoves.push(emptyIdx + puzzleSize)
    }
    
    // Check left
    if (emptyIdx % puzzleSize !== 0) {
      validMoves.push(emptyIdx - 1)
    }
    
    // Check right
    if (emptyIdx % puzzleSize !== puzzleSize - 1) {
      validMoves.push(emptyIdx + 1)
    }
    
    return validMoves
  }
  
  const swapTiles = (currentTiles: number[], index1: number, index2: number) => {
    const newTiles = [...currentTiles]
    const temp = newTiles[index1]
    newTiles[index1] = newTiles[index2]
    newTiles[index2] = temp
    return newTiles
  }
  
  const handleTileClick = (index: number) => {
    if (gameComplete) return
    
    // Check if the clicked tile can move
    const validMoves = getValidMoves(emptyIndex)
    if (!validMoves.includes(index)) return
    
    // Move the tile
    const newTiles = swapTiles(tiles, emptyIndex, index)
    setTiles(newTiles)
    setEmptyIndex(index)
    setMoves(moves + 1)
    
    // Check if puzzle is solved
    const solved = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i)
    if (newTiles.every((tile, i) => tile === solved[i])) {
      calculateScore()
    }
  }
  
  const calculateScore = () => {
    // Calculate score based on moves and time left
    const baseScore = 1000
    const movesPenalty = moves * 5
    const timeBonus = timeLeft * 10
    
    const finalScore = Math.max(0, baseScore - movesPenalty + timeBonus)
    setScore(finalScore)
    setGameComplete(true)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium">Moves: {moves}</p>
          <p className="text-sm font-medium">Time: {timeLeft}s</p>
        </div>
        <Progress value={(timeLeft / 60) * 100} className="w-1/2" />
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${puzzleSize}, 1fr)`,
          aspectRatio: '1/1'
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center text-xl font-bold rounded cursor-pointer transition-all",
              tile === puzzleSize * puzzleSize - 1 ? "invisible" : "bg-primary/20 hover:bg-primary/30"
            )}
            onClick={() => handleTileClick(index)}
          >
            {tile !== puzzleSize * puzzleSize - 1 && tile + 1}
          </div>
        ))}
      </div>
      
      {gameComplete && (
        <div className="text-center space-y-4 mt-4">
          <h3 className="text-xl font-bold">Puzzle Solved!</h3>
          <p>Your score: {score}</p>
          <Button onClick={() => onComplete(score)}>
            Collect Reward
          </Button>
        </div>
      )}
    </div>
  )
}
