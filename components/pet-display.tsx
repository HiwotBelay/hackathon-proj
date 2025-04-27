"use client"

import { useState, useEffect, useRef } from "react"

interface PetDisplayProps {
  petType: string
  petColor: string
  emotion: string
  petName: string
}

export function PetDisplay({ petType, petColor, emotion, petName }: PetDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animation, setAnimation] = useState<string>("")
  const animationFrameRef = useRef<number>(0)
  const animationCounterRef = useRef<number>(0)

  // Apply different animations based on emotion
  useEffect(() => {
    switch (emotion) {
      case "happy":
        setAnimation("animate-bounce-slow")
        break
      case "excited":
        setAnimation("animate-wiggle")
        break
      case "playful":
        setAnimation("animate-spin-slow")
        break
      case "hungry":
        setAnimation("animate-pulse")
        break
      case "sad":
      case "concerned":
        setAnimation("animate-sway")
        break
      case "dancing":
        setAnimation("animate-dance")
        break
      case "shocked":
        setAnimation("animate-shake")
        break
      case "loving":
        setAnimation("animate-heartbeat")
        break
      case "sleepy":
        setAnimation("animate-yawn")
        break
      case "laughing":
        setAnimation("animate-laugh")
        break
      case "scared":
        setAnimation("animate-tremble")
        break
      case "curious":
        setAnimation("animate-tilt")
        break
      case "thinking":
        setAnimation("animate-thinking")
        break
      default:
        setAnimation("")
    }
  }, [emotion])

  // Draw the pet on the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 400
    canvas.height = 400

    // For animations that need frame-by-frame rendering
    if (emotion === "dancing" || emotion === "laughing") {
      let frameCount = 0
      const frameLimit = 60 // Animation cycle length

      const animate = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw pet with animation frame
        if (petType === "dog") {
          drawDog(ctx, petColor, emotion, canvas.width, canvas.height, frameCount)
        } else if (petType === "cat") {
          drawCat(ctx, petColor, emotion, canvas.width, canvas.height, frameCount)
        } else if (petType === "bird") {
          drawBird(ctx, petColor, emotion, canvas.width, canvas.height, frameCount)
        } else {
          // Default to dog
          drawDog(ctx, petColor, emotion, canvas.width, canvas.height, frameCount)
        }

        frameCount = (frameCount + 1) % frameLimit
        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        cancelAnimationFrame(animationFrameRef.current)
      }
    } else {
      // For static emotions, just draw once
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw pet based on type
      if (petType === "dog") {
        drawDog(ctx, petColor, emotion, canvas.width, canvas.height)
      } else if (petType === "cat") {
        drawCat(ctx, petColor, emotion, canvas.width, canvas.height)
      } else if (petType === "bird") {
        drawBird(ctx, petColor, emotion, canvas.width, canvas.height)
      } else {
        // Default to dog
        drawDog(ctx, petColor, emotion, canvas.width, canvas.height)
      }
    }
  }, [petType, petColor, emotion])

  return (
    <div className="relative w-full max-w-md aspect-square">
      <div className={`relative w-full h-full ${animation}`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg shadow-md"
          aria-label={`Your pet ${petType} named ${petName}`}
        />
      </div>
    </div>
  )
}

// Draw a dog with different emotions
function drawDog(
  ctx: CanvasRenderingContext2D,
  color: string,
  emotion: string,
  width: number,
  height: number,
  frameCount = 0,
) {
  // Set colors based on pet color
  let mainColor = "#D4A464" // Default golden
  let secondaryColor = "#A37B3B"

  if (color === "brown") {
    mainColor = "#8B4513"
    secondaryColor = "#5E2F0D"
  } else if (color === "black") {
    mainColor = "#2D2D2D"
    secondaryColor = "#1A1A1A"
  } else if (color === "white") {
    mainColor = "#F5F5F5"
    secondaryColor = "#E0E0E0"
  }

  // For dancing animation, add some movement
  let offsetY = 0
  let offsetX = 0
  let rotation = 0

  if (emotion === "dancing") {
    offsetY = Math.sin(frameCount * 0.2) * 10
    offsetX = Math.sin(frameCount * 0.3) * 5
    rotation = Math.sin(frameCount * 0.1) * 0.1
  } else if (emotion === "laughing") {
    offsetY = Math.sin(frameCount * 0.4) * 5
  } else if (emotion === "scared") {
    offsetX = Math.sin(frameCount * 0.8) * 3
  }

  // Save the current state
  ctx.save()

  // Apply rotation if needed
  if (rotation !== 0) {
    ctx.translate(width / 2, height / 2)
    ctx.rotate(rotation)
    ctx.translate(-width / 2, -height / 2)
  }

  // Draw body
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.ellipse(width / 2 + offsetX, height / 2 + 50 + offsetY, 120, 100, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw head
  ctx.beginPath()
  ctx.ellipse(width / 2 + offsetX, height / 2 - 50 + offsetY, 90, 80, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw ears
  ctx.fillStyle = secondaryColor
  // Left ear
  ctx.beginPath()
  ctx.ellipse(width / 2 - 70 + offsetX, height / 2 - 80 + offsetY, 30, 40, Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()
  // Right ear
  ctx.beginPath()
  ctx.ellipse(width / 2 + 70 + offsetX, height / 2 - 80 + offsetY, 30, 40, -Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()

  // Draw legs
  ctx.fillStyle = mainColor
  // Front legs
  ctx.fillRect(width / 2 - 80 + offsetX, height / 2 + 80 + offsetY, 25, 70)
  ctx.fillRect(width / 2 + 55 + offsetX, height / 2 + 80 + offsetY, 25, 70)
  // Back legs
  ctx.fillRect(width / 2 - 100 + offsetX, height / 2 + 100 + offsetY, 25, 50)
  ctx.fillRect(width / 2 + 75 + offsetX, height / 2 + 100 + offsetY, 25, 50)

  // Draw tail with animation for some emotions
  ctx.beginPath()

  if (emotion === "happy" || emotion === "excited" || emotion === "playful" || emotion === "dancing") {
    // Wagging tail
    const wagSpeed = emotion === "dancing" ? 0.3 : 0.2
    const wagAmount = emotion === "excited" ? 30 : 20
    const tailOffset = Math.sin(frameCount * wagSpeed) * wagAmount

    ctx.moveTo(width / 2 + 120 + offsetX, height / 2 + 50 + offsetY)
    ctx.quadraticCurveTo(
      width / 2 + 150 + offsetX,
      height / 2 + 20 + offsetY + tailOffset,
      width / 2 + 140 + offsetX,
      height / 2 - 10 + offsetY,
    )
  } else if (emotion === "sad" || emotion === "concerned" || emotion === "scared") {
    // Drooping tail
    ctx.moveTo(width / 2 + 120 + offsetX, height / 2 + 50 + offsetY)
    ctx.quadraticCurveTo(
      width / 2 + 140 + offsetX,
      height / 2 + 80 + offsetY,
      width / 2 + 130 + offsetX,
      height / 2 + 100 + offsetY,
    )
  } else {
    // Normal tail
    ctx.moveTo(width / 2 + 120 + offsetX, height / 2 + 50 + offsetY)
    ctx.quadraticCurveTo(
      width / 2 + 150 + offsetX,
      height / 2 + 20 + offsetY,
      width / 2 + 140 + offsetX,
      height / 2 - 10 + offsetY,
    )
  }

  ctx.lineWidth = 15
  ctx.strokeStyle = mainColor
  ctx.stroke()

  // Draw face based on emotion
  drawDogFace(ctx, emotion, width + offsetX, height + offsetY, frameCount)

  // Restore the context
  ctx.restore()

  // Draw special effects for certain emotions
  if (emotion === "loving") {
    drawHearts(ctx, width, height, frameCount)
  } else if (emotion === "shocked") {
    drawShockLines(ctx, width, height, frameCount)
  } else if (emotion === "thinking") {
    drawThoughtBubble(ctx, width, height, frameCount)
  }
}

function drawDogFace(ctx: CanvasRenderingContext2D, emotion: string, width: number, height: number, frameCount = 0) {
  // Draw nose
  ctx.fillStyle = "#000"
  ctx.beginPath()
  ctx.ellipse(width / 2, height / 2 - 30, 15, 10, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw eyes and mouth based on emotion
  switch (emotion) {
    case "happy":
      // Happy eyes (slightly closed)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Happy mouth (smile)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 30, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 + 20, width / 2 + 30, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "excited":
      // Wide open eyes
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      // White highlights in eyes
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 33, height / 2 - 63, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 27, height / 2 - 63, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Open mouth with tongue
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2, 20, 25, 0, 0, Math.PI)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Tongue
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 10, 10, 15, 0, 0, Math.PI)
      ctx.fillStyle = "#FF9999"
      ctx.fill()
      break

    case "playful":
      // Playful eyes (one open, one closed)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Winking eye
      ctx.beginPath()
      ctx.moveTo(width / 2 + 20, height / 2 - 60)
      ctx.lineTo(width / 2 + 40, height / 2 - 60)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Playful mouth (tongue out to side)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 + 10, width / 2 + 20, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tongue sticking out
      ctx.beginPath()
      ctx.moveTo(width / 2 + 20, height / 2 - 5)
      ctx.quadraticCurveTo(width / 2 + 30, height / 2 + 5, width / 2 + 40, height / 2)
      ctx.lineWidth = 8
      ctx.strokeStyle = "#FF9999"
      ctx.stroke()
      break

    case "hungry":
      // Normal eyes
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Drooling mouth
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 + 5, width / 2 + 20, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Drool
      ctx.beginPath()
      ctx.moveTo(width / 2, height / 2 + 5)
      ctx.quadraticCurveTo(width / 2 - 2, height / 2 + 15, width / 2, height / 2 + 25)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#ADD8E6"
      ctx.stroke()
      break

    case "sad":
      // Sad eyes with eyebrows
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 55, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 55, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Sad eyebrows
      ctx.beginPath()
      ctx.moveTo(width / 2 - 40, height / 2 - 75)
      ctx.lineTo(width / 2 - 20, height / 2 - 65)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width / 2 + 40, height / 2 - 75)
      ctx.lineTo(width / 2 + 20, height / 2 - 65)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Sad mouth (frown)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 - 25, width / 2 + 20, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tear drop
      ctx.beginPath()
      ctx.moveTo(width / 2 - 25, height / 2 - 45)
      ctx.quadraticCurveTo(width / 2 - 27, height / 2 - 35, width / 2 - 25, height / 2 - 25)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#ADD8E6"
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 25, 3, 5, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#ADD8E6"
      ctx.fill()
      break

    case "concerned":
      // Concerned eyes (eyebrows)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 55, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 55, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Eyebrows
      ctx.beginPath()
      ctx.moveTo(width / 2 - 40, height / 2 - 70)
      ctx.lineTo(width / 2 - 20, height / 2 - 75)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width / 2 + 40, height / 2 - 70)
      ctx.lineTo(width / 2 + 20, height / 2 - 75)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Concerned mouth (slight frown)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 - 20, width / 2 + 20, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "shocked":
      // Shocked eyes (wide open)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // White highlights in eyes
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 33, height / 2 - 63, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 27, height / 2 - 63, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Shocked mouth (O shape)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 15, 15, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Inner mouth
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 10, 10, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#FF9999"
      ctx.fill()
      break

    case "dancing":
      // Dancing eyes (happy with movement)
      const eyeOffset = Math.sin(frameCount * 0.2) * 5

      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30 + eyeOffset, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30 + eyeOffset, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White highlights in eyes
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 33 + eyeOffset, height / 2 - 63, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 27 + eyeOffset, height / 2 - 63, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Dancing mouth (big smile)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 35, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 + 25, width / 2 + 35, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tongue
      if (frameCount % 20 < 10) {
        ctx.beginPath()
        ctx.ellipse(width / 2, height / 2 + 15, 8, 12, 0, 0, Math.PI)
        ctx.fillStyle = "#FF9999"
        ctx.fill()
      }
      break

    case "loving":
      // Loving eyes (heart shaped)
      drawHeartEye(ctx, width / 2 - 30, height / 2 - 60, 12)
      drawHeartEye(ctx, width / 2 + 30, height / 2 - 60, 12)

      // Loving smile
      ctx.beginPath()
      ctx.moveTo(width / 2 - 25, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 + 15, width / 2 + 25, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "sleepy":
      // Sleepy eyes (half closed)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Sleepy mouth (yawning)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 15, 10, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Z's for sleeping
      const zSize = 10 + Math.sin(frameCount * 0.1) * 3
      ctx.font = `${zSize}px Arial`
      ctx.fillStyle = "#000"
      ctx.fillText("z", width / 2 + 60, height / 2 - 80)
      ctx.font = `${zSize * 1.2}px Arial`
      ctx.fillText("Z", width / 2 + 70, height / 2 - 95)
      ctx.font = `${zSize * 1.4}px Arial`
      ctx.fillText("Z", width / 2 + 85, height / 2 - 110)
      break

    case "laughing":
      // Laughing eyes (squinted)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 2 + Math.sin(frameCount * 0.3) * 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 2 + Math.sin(frameCount * 0.3) * 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Laughing mouth (wide open)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 5, 25, 15 + Math.sin(frameCount * 0.3) * 5, 0, 0, Math.PI)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Tongue
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 5, 15, 8, 0, 0, Math.PI)
      ctx.fillStyle = "#FF9999"
      ctx.fill()

      // "Ha ha" text
      if (frameCount % 30 < 15) {
        ctx.font = "14px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Ha Ha!", width / 2 + 50, height / 2 - 40)
      } else {
        ctx.font = "14px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Hee Hee!", width / 2 + 50, height / 2 - 40)
      }
      break

    case "scared":
      // Scared eyes (wide with small pupils)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // White of eyes
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Small pupils (looking around nervously)
      const pupilX = Math.sin(frameCount * 0.2) * 3
      const pupilY = Math.cos(frameCount * 0.2) * 3

      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30 + pupilX, height / 2 - 60 + pupilY, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30 + pupilX, height / 2 - 60 + pupilY, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Scared mouth (small and tight)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 10, 5, 0, 0, Math.PI * 2)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "curious":
      // Curious eyes (one eyebrow raised)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Raised eyebrow
      ctx.beginPath()
      ctx.moveTo(width / 2 - 40, height / 2 - 70)
      ctx.lineTo(width / 2 - 20, height / 2 - 75)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Normal eyebrow
      ctx.beginPath()
      ctx.moveTo(width / 2 + 20, height / 2 - 70)
      ctx.lineTo(width / 2 + 40, height / 2 - 70)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Curious mouth (slightly open)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 10, 8, 0, 0, Math.PI * 2)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "thinking":
      // Thinking eyes (looking up)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 65, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 65, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Thinking mouth (pursed)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 10, height / 2 - 10)
      ctx.lineTo(width / 2 + 10, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    default:
      // Default eyes
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 30, height / 2 - 60, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Default mouth
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2, width / 2 + 20, height / 2 - 10)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
  }
}

// Helper function to draw heart-shaped eyes
function drawHeartEye(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#FF6B6B"

  ctx.beginPath()
  ctx.moveTo(x, y - size / 4)

  // Left curve
  ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y, x, y + size / 2)

  // Right curve
  ctx.bezierCurveTo(x + size, y, x + size / 2, y - size / 2, x, y - size / 4)

  ctx.fill()
}

// Draw hearts for loving emotion
function drawHearts(ctx: CanvasRenderingContext2D, width: number, height: number, frameCount: number) {
  const numHearts = 5

  for (let i = 0; i < numHearts; i++) {
    const size = 10 + Math.sin(frameCount * 0.1 + i) * 3
    const x = width / 2 + Math.sin(frameCount * 0.05 + i * 1.5) * 80
    const y = height / 2 - 100 + Math.cos(frameCount * 0.1 + i * 1.2) * 30 - i * 10

    drawHeartEye(ctx, x, y, size)
  }
}

// Draw shock lines for shocked emotion
function drawShockLines(ctx: CanvasRenderingContext2D, width: number, height: number, frameCount: number) {
  ctx.strokeStyle = "#FFD700"
  ctx.lineWidth = 2

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const length = 20 + Math.sin(frameCount * 0.2 + i) * 5

    ctx.beginPath()
    ctx.moveTo(width / 2 + Math.cos(angle) * 70, height / 2 - 50 + Math.sin(angle) * 70)
    ctx.lineTo(width / 2 + Math.cos(angle) * (70 + length), height / 2 - 50 + Math.sin(angle) * (70 + length))
    ctx.stroke()
  }
}

// Draw thought bubble for thinking emotion
function drawThoughtBubble(ctx: CanvasRenderingContext2D, width: number, height: number, frameCount: number) {
  ctx.fillStyle = "#FFF"
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 2

  // Small bubbles leading to thought
  for (let i = 0; i < 3; i++) {
    const size = 5 + i * 3
    ctx.beginPath()
    ctx.arc(width / 2 + 50 + i * 10, height / 2 - 80 - i * 10, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // Main thought bubble
  ctx.beginPath()
  ctx.ellipse(width / 2 + 100, height / 2 - 120, 30, 20, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Question mark or thinking content
  ctx.fillStyle = "#000"
  ctx.font = "20px Arial"
  ctx.fillText("?", width / 2 + 95, height / 2 - 115)
}

// Draw a cat with different emotions
function drawCat(
  ctx: CanvasRenderingContext2D,
  color: string,
  emotion: string,
  width: number,
  height: number,
  frameCount = 0,
) {
  // Set colors based on pet color
  let mainColor = "#F7A23B" // Default orange
  let secondaryColor = "#E68A00"

  if (color === "gray") {
    mainColor = "#808080"
    secondaryColor = "#606060"
  } else if (color === "black") {
    mainColor = "#2D2D2D"
    secondaryColor = "#1A1A1A"
  } else if (color === "white") {
    mainColor = "#F5F5F5"
    secondaryColor = "#E0E0E0"
  }

  // For dancing animation, add some movement
  let offsetY = 0
  let offsetX = 0
  let rotation = 0

  if (emotion === "dancing") {
    offsetY = Math.sin(frameCount * 0.2) * 10
    offsetX = Math.sin(frameCount * 0.3) * 5
    rotation = Math.sin(frameCount * 0.1) * 0.1
  } else if (emotion === "laughing") {
    offsetY = Math.sin(frameCount * 0.4) * 5
  } else if (emotion === "scared") {
    offsetX = Math.sin(frameCount * 0.8) * 3
  }

  // Save the current state
  ctx.save()

  // Apply rotation if needed
  if (rotation !== 0) {
    ctx.translate(width / 2, height / 2)
    ctx.rotate(rotation)
    ctx.translate(-width / 2, -height / 2)
  }

  // Draw body
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.ellipse(width / 2 + offsetX, height / 2 + 50 + offsetY, 100, 80, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw head
  ctx.beginPath()
  ctx.ellipse(width / 2 + offsetX, height / 2 - 50 + offsetY, 70, 65, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw ears (triangular for cats)
  ctx.fillStyle = mainColor

  // Ear animation for some emotions
  let earTilt = 0
  if (emotion === "curious" || emotion === "alert") {
    earTilt = 0.2
  } else if (emotion === "scared") {
    earTilt = -0.3
  }

  // Left ear
  ctx.beginPath()
  ctx.moveTo(width / 2 - 40 + offsetX, height / 2 - 80 + offsetY)
  ctx.lineTo(width / 2 - 70 + offsetX, height / 2 - 120 + offsetY - earTilt * 10)
  ctx.lineTo(width / 2 - 20 + offsetX, height / 2 - 100 + offsetY)
  ctx.closePath()
  ctx.fill()

  // Right ear
  ctx.beginPath()
  ctx.moveTo(width / 2 + 40 + offsetX, height / 2 - 80 + offsetY)
  ctx.lineTo(width / 2 + 70 + offsetX, height / 2 - 120 + offsetY - earTilt * 10)
  ctx.lineTo(width / 2 + 20 + offsetX, height / 2 - 100 + offsetY)
  ctx.closePath()
  ctx.fill()

  // Inner ears
  ctx.fillStyle = "#FFC0CB" // Pink
  // Left inner ear
  ctx.beginPath()
  ctx.moveTo(width / 2 - 40 + offsetX, height / 2 - 85 + offsetY)
  ctx.lineTo(width / 2 - 60 + offsetX, height / 2 - 110 + offsetY - earTilt * 8)
  ctx.lineTo(width / 2 - 30 + offsetX, height / 2 - 95 + offsetY)
  ctx.closePath()
  ctx.fill()

  // Right inner ear
  ctx.beginPath()
  ctx.moveTo(width / 2 + 40 + offsetX, height / 2 - 85 + offsetY)
  ctx.lineTo(width / 2 + 60 + offsetX, height / 2 - 110 + offsetY - earTilt * 8)
  ctx.lineTo(width / 2 + 30 + offsetX, height / 2 - 95 + offsetY)
  ctx.closePath()
  ctx.fill()

  // Draw legs
  ctx.fillStyle = mainColor
  // Front legs
  ctx.fillRect(width / 2 - 70 + offsetX, height / 2 + 70 + offsetY, 20, 60)
  ctx.fillRect(width / 2 + 50 + offsetX, height / 2 + 70 + offsetY, 20, 60)
  // Back legs
  ctx.fillRect(width / 2 - 90 + offsetX, height / 2 + 90 + offsetY, 20, 40)
  ctx.fillRect(width / 2 + 70 + offsetX, height / 2 + 90 + offsetY, 20, 40)

  // Draw tail with animation for some emotions
  ctx.beginPath()

  if (emotion === "happy" || emotion === "excited" || emotion === "playful") {
    // Happy tail (curved up)
    ctx.moveTo(width / 2 + 100 + offsetX, height / 2 + 50 + offsetY)
    ctx.bezierCurveTo(
      width / 2 + 130 + offsetX,
      height / 2 + 30 + offsetY,
      width / 2 + 150 + offsetX,
      height / 2 - 10 + offsetY,
      width / 2 + 140 + offsetX,
      height / 2 - 40 + offsetY,
    )
  } else if (emotion === "dancing") {
    // Dancing tail (wagging)
    const wagAmount = Math.sin(frameCount * 0.3) * 30
    ctx.moveTo(width / 2 + 100 + offsetX, height / 2 + 50 + offsetY)
    ctx.bezierCurveTo(
      width / 2 + 130 + offsetX + wagAmount,
      height / 2 + 70 + offsetY,
      width / 2 + 150 + offsetX - wagAmount,
      height / 2 + 30 + offsetY,
      width / 2 + 140 + offsetX,
      height / 2 - 10 + offsetY,
    )
  } else if (emotion === "sad" || emotion === "concerned") {
    // Sad tail (drooping)
    ctx.moveTo(width / 2 + 100 + offsetX, height / 2 + 50 + offsetY)
    ctx.bezierCurveTo(
      width / 2 + 120 + offsetX,
      height / 2 + 80 + offsetY,
      width / 2 + 130 + offsetX,
      height / 2 + 100 + offsetY,
      width / 2 + 140 + offsetX,
      height / 2 + 110 + offsetY,
    )
  } else if (emotion === "scared" || emotion === "shocked") {
    // Puffed up tail
    ctx.moveTo(width / 2 + 100 + offsetX, height / 2 + 50 + offsetY)
    ctx.bezierCurveTo(
      width / 2 + 120 + offsetX,
      height / 2 + 20 + offsetY,
      width / 2 + 140 + offsetX,
      height / 2 - 10 + offsetY,
      width / 2 + 130 + offsetX,
      height / 2 - 30 + offsetY,
    )
    ctx.lineWidth = 20 // Thicker for puffed up
  } else {
    // Normal tail
    ctx.moveTo(width / 2 + 100 + offsetX, height / 2 + 50 + offsetY)
    ctx.bezierCurveTo(
      width / 2 + 130 + offsetX,
      height / 2 + 70 + offsetY,
      width / 2 + 150 + offsetX,
      height / 2 + 30 + offsetY,
      width / 2 + 140 + offsetX,
      height / 2 - 10 + offsetY,
    )
  }

  ctx.lineWidth = emotion === "scared" ? 20 : 12
  ctx.strokeStyle = mainColor
  ctx.stroke()

  // Draw whiskers
  ctx.strokeStyle = "#FFF"
  ctx.lineWidth = 2

  // Whisker animation
  let whiskerOffset = 0
  if (emotion === "curious" || emotion === "excited") {
    whiskerOffset = Math.sin(frameCount * 0.2) * 3
  }

  // Left whiskers
  ctx.beginPath()
  ctx.moveTo(width / 2 - 30 + offsetX, height / 2 - 20 + offsetY)
  ctx.lineTo(width / 2 - 80 + offsetX, height / 2 - 30 + offsetY + whiskerOffset)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(width / 2 - 30 + offsetX, height / 2 - 15 + offsetY)
  ctx.lineTo(width / 2 - 80 + offsetX, height / 2 - 10 + offsetY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(width / 2 - 30 + offsetX, height / 2 - 10 + offsetY)
  ctx.lineTo(width / 2 - 80 + offsetX, height / 2 + 10 + offsetY - whiskerOffset)
  ctx.stroke()

  // Right whiskers
  ctx.beginPath()
  ctx.moveTo(width / 2 + 30 + offsetX, height / 2 - 20 + offsetY)
  ctx.lineTo(width / 2 + 80 + offsetX, height / 2 - 30 + offsetY + whiskerOffset)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(width / 2 + 30 + offsetX, height / 2 - 15 + offsetY)
  ctx.lineTo(width / 2 + 80 + offsetX, height / 2 - 10 + offsetY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(width / 2 + 30 + offsetX, height / 2 - 10 + offsetY)
  ctx.lineTo(width / 2 + 80 + offsetX, height / 2 + 10 + offsetY - whiskerOffset)
  ctx.stroke()

  // Draw face based on emotion
  drawCatFace(ctx, emotion, width + offsetX, height + offsetY, frameCount)

  // Restore the context
  ctx.restore()

  // Draw special effects for certain emotions
  if (emotion === "loving") {
    drawHearts(ctx, width, height, frameCount)
  } else if (emotion === "shocked") {
    drawShockLines(ctx, width, height, frameCount)
  } else if (emotion === "thinking") {
    drawThoughtBubble(ctx, width, height, frameCount)
  }
}

function drawCatFace(ctx: CanvasRenderingContext2D, emotion: string, width: number, height: number, frameCount = 0) {
  // Draw nose (triangular for cats)
  ctx.fillStyle = "#FFC0CB" // Pink
  ctx.beginPath()
  ctx.moveTo(width / 2, height / 2 - 30)
  ctx.lineTo(width / 2 - 10, height / 2 - 20)
  ctx.lineTo(width / 2 + 10, height / 2 - 20)
  ctx.closePath()
  ctx.fill()

  // Draw eyes and mouth based on emotion
  switch (emotion) {
    case "happy":
      // Happy eyes (almond shaped)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Happy mouth (slight curve)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 10, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2, width / 2 + 10, height / 2 - 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "excited":
      // Excited eyes (wide open)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (dilated)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 10, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 10, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Excited mouth (open)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 10, 8, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()
      break

    case "playful":
      // Playful eyes (one normal, one squinted)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Squinted eye
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Playful mouth (slight smile with tongue)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 15, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2, width / 2 + 15, height / 2 - 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tongue
      ctx.beginPath()
      ctx.moveTo(width / 2, height / 2 - 5)
      ctx.quadraticCurveTo(width / 2 + 5, height / 2 + 5, width / 2 + 10, height / 2)
      ctx.lineWidth = 4
      ctx.strokeStyle = "#FF9999"
      ctx.stroke()
      break

    case "hungry":
      // Hungry eyes (focused)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (vertical slits)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 2, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 2, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Hungry mouth (licking lips)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 15, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 - 5, width / 2 + 15, height / 2 - 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tongue licking
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 5, 0, Math.PI, false)
      ctx.fillStyle = "#FF9999"
      ctx.fill()
      break

    case "sad":
      // Sad eyes with small pupils
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (small and sad)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 47, 3, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 47, 3, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Sad mouth (frown)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 15, height / 2 - 15)
      ctx.quadraticCurveTo(width / 2, height / 2 - 25, width / 2 + 15, height / 2 - 15)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tear drop
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 40)
      ctx.quadraticCurveTo(width / 2 - 22, height / 2 - 30, width / 2 - 20, height / 2 - 20)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#ADD8E6"
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(width / 2 - 20, height / 2 - 20, 3, 5, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#ADD8E6"
      ctx.fill()
      break

    case "concerned":
      // Concerned eyes (wide with small pupils)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (small)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Concerned mouth (slight frown)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 15, height / 2 - 15)
      ctx.quadraticCurveTo(width / 2, height / 2 - 20, width / 2 + 15, height / 2 - 15)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "shocked":
      // Shocked eyes (very wide)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (very large)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // Shocked mouth (O shape)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 10, 10, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()
      break

    case "dancing":
      // Dancing eyes (happy with movement)
      const eyeOffset = Math.sin(frameCount * 0.2) * 5

      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25 + eyeOffset, height / 2 - 50, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25 + eyeOffset, height / 2 - 50, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25 + eyeOffset, height / 2 - 50, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25 + eyeOffset, height / 2 - 50, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Dancing mouth (big smile)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2 + 5, width / 2 + 20, height / 2 - 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "loving":
      // Loving eyes (heart shaped)
      drawHeartEye(ctx, width / 2 - 25, height / 2 - 50, 12)
      drawHeartEye(ctx, width / 2 + 25, height / 2 - 50, 12)

      // Loving smile
      ctx.beginPath()
      ctx.moveTo(width / 2 - 15, height / 2 - 10)
      ctx.quadraticCurveTo(width / 2, height / 2, width / 2 + 15, height / 2 - 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "sleepy":
      // Sleepy eyes (half closed)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Sleepy mouth (yawning)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 10, 8, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Z's for sleeping
      const zSize = 10 + Math.sin(frameCount * 0.1) * 3
      ctx.font = `${zSize}px Arial`
      ctx.fillStyle = "#000"
      ctx.fillText("z", width / 2 + 60, height / 2 - 80)
      ctx.font = `${zSize * 1.2}px Arial`
      ctx.fillText("Z", width / 2 + 70, height / 2 - 95)
      ctx.font = `${zSize * 1.4}px Arial`
      ctx.fillText("Z", width / 2 + 85, height / 2 - 110)
      break

    case "laughing":
      // Laughing eyes (squinted)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 2 + Math.sin(frameCount * 0.3) * 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 2 + Math.sin(frameCount * 0.3) * 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Laughing mouth (wide open)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 15, 10 + Math.sin(frameCount * 0.3) * 3, 0, 0, Math.PI)
      ctx.fillStyle = "#000"
      ctx.fill()

      // "Ha ha" text
      if (frameCount % 30 < 15) {
        ctx.font = "14px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Meow!", width / 2 + 50, height / 2 - 40)
      } else {
        ctx.font = "14px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Purr!", width / 2 + 50, height / 2 - 40)
      }
      break

    case "scared":
      // Scared eyes (wide with vertical pupils)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (vertical slits)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 2, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 2, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Scared mouth (small and tight)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 10, height / 2 - 15)
      ctx.lineTo(width / 2 + 10, height / 2 - 15)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "curious":
      // Curious eyes (one eye normal, one eye wide)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 15, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 3, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 5, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Curious mouth (slightly open)
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 - 10, 8, 5, 0, 0, Math.PI * 2)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "thinking":
      // Thinking eyes (looking up)
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 55, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 55, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (looking up)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 59, 3, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 59, 3, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Thinking mouth (closed)
      ctx.beginPath()
      ctx.moveTo(width / 2 - 10, height / 2 - 10)
      ctx.lineTo(width / 2 + 10, height / 2 - 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    default:
      // Default eyes
      ctx.fillStyle = "#4CAF50" // Green cat eyes
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 12, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 50, 3, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 50, 3, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Default mouth
      ctx.beginPath()
      ctx.moveTo(width / 2 - 10, height / 2 - 15)
      ctx.lineTo(width / 2 + 10, height / 2 - 15)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000"
      ctx.stroke()
  }
}

// Draw a bird with different emotions
function drawBird(
  ctx: CanvasRenderingContext2D,
  color: string,
  emotion: string,
  width: number,
  height: number,
  frameCount = 0,
) {
  // Set colors based on pet color
  let mainColor = "#4F86F7" // Default blue
  let secondaryColor = "#FFD700" // Yellow for beak

  if (color === "red") {
    mainColor = "#FF6B6B"
  } else if (color === "green") {
    mainColor = "#4CAF50"
  } else if (color === "yellow") {
    mainColor = "#FFEB3B"
    secondaryColor = "#FF9800" // Orange beak for yellow bird
  }

  // For dancing animation, add some movement
  let offsetY = 0
  let offsetX = 0
  let rotation = 0

  if (emotion === "dancing") {
    offsetY = Math.sin(frameCount * 0.2) * 10
    offsetX = Math.sin(frameCount * 0.3) * 5
    rotation = Math.sin(frameCount * 0.1) * 0.1
  } else if (emotion === "laughing") {
    offsetY = Math.sin(frameCount * 0.4) * 5
  } else if (emotion === "scared") {
    offsetX = Math.sin(frameCount * 0.8) * 3
  }

  // Save the current state
  ctx.save()

  // Apply rotation if needed
  if (rotation !== 0) {
    ctx.translate(width / 2, height / 2)
    ctx.rotate(rotation)
    ctx.translate(-width / 2, -height / 2)
  }

  // Draw body
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.ellipse(width / 2 + offsetX, height / 2 + 30 + offsetY, 80, 100, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw head
  ctx.beginPath()
  ctx.arc(width / 2 + offsetX, height / 2 - 70 + offsetY, 60, 0, Math.PI * 2)
  ctx.fill()

  // Draw wings with animation for some emotions
  ctx.fillStyle = mainColor

  // Wing animation
  let wingOffset = 0
  if (emotion === "excited" || emotion === "dancing") {
    wingOffset = Math.sin(frameCount * 0.3) * 20
  } else if (emotion === "scared") {
    wingOffset = Math.sin(frameCount * 0.5) * 10
  }

  // Left wing
  ctx.beginPath()
  ctx.ellipse(width / 2 - 80 + offsetX, height / 2 + 20 + offsetY, 40, 80 + wingOffset, Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()

  // Right wing
  ctx.beginPath()
  ctx.ellipse(width / 2 + 80 + offsetX, height / 2 + 20 + offsetY, 40, 80 + wingOffset, -Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()

  // Draw tail feathers
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.moveTo(width / 2 - 30 + offsetX, height / 2 + 120 + offsetY)
  ctx.lineTo(width / 2 + offsetX, height / 2 + 160 + offsetY)
  ctx.lineTo(width / 2 + 30 + offsetX, height / 2 + 120 + offsetY)
  ctx.closePath()
  ctx.fill()

  // Draw face based on emotion
  drawBirdFace(ctx, emotion, secondaryColor, width + offsetX, height + offsetY, frameCount)

  // Restore the context
  ctx.restore()

  // Draw special effects for certain emotions
  if (emotion === "loving") {
    drawHearts(ctx, width, height, frameCount)
  } else if (emotion === "shocked") {
    drawShockLines(ctx, width, height, frameCount)
  } else if (emotion === "thinking") {
    drawThoughtBubble(ctx, width, height, frameCount)
  }
}

function drawBirdFace(
  ctx: CanvasRenderingContext2D,
  emotion: string,
  beakColor: string,
  width: number,
  height: number,
  frameCount = 0,
) {
  // Draw beak based on emotion
  ctx.fillStyle = beakColor

  if (emotion === "happy" || emotion === "excited" || emotion === "playful") {
    // Happy beak (slightly open)
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 2 - 70)
    ctx.lineTo(width / 2 - 15, height / 2 - 45)
    ctx.lineTo(width / 2 + 15, height / 2 - 45)
    ctx.closePath()
    ctx.fill()
  } else if (emotion === "hungry" || emotion === "shocked" || emotion === "laughing") {
    // Open beak
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 2 - 70)
    ctx.lineTo(width / 2 - 20, height / 2 - 40)
    ctx.lineTo(width / 2 + 20, height / 2 - 40)
    ctx.closePath()
    ctx.fill()

    // Inside of beak
    ctx.fillStyle = "#FF9999"
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 2 - 65)
    ctx.lineTo(width / 2 - 15, height / 2 - 45)
    ctx.lineTo(width / 2 + 15, height / 2 - 45)
    ctx.closePath()
    ctx.fill()
  } else {
    // Default beak (closed)
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 2 - 70)
    ctx.lineTo(width / 2 - 15, height / 2 - 50)
    ctx.lineTo(width / 2 + 15, height / 2 - 50)
    ctx.closePath()
    ctx.fill()
  }

  // Draw eyes based on emotion
  switch (emotion) {
    case "happy":
      // Happy eyes (curved)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "excited":
      // Excited eyes (wide)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "playful":
      // Playful eyes (one normal, one winking)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Winking eye
      ctx.beginPath()
      ctx.moveTo(width / 2 + 15, height / 2 - 90)
      ctx.lineTo(width / 2 + 35, height / 2 - 90)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "hungry":
      // Hungry eyes (focused)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "sad":
      // Sad eyes with eyebrows
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Sad eyebrows
      ctx.beginPath()
      ctx.moveTo(width / 2 - 35, height / 2 - 100)
      ctx.lineTo(width / 2 - 15, height / 2 - 95)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width / 2 + 35, height / 2 - 100)
      ctx.lineTo(width / 2 + 15, height / 2 - 95)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Tear drop
      ctx.beginPath()
      ctx.moveTo(width / 2 - 20, height / 2 - 80)
      ctx.quadraticCurveTo(width / 2 - 22, height / 2 - 70, width / 2 - 20, height / 2 - 60)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#ADD8E6"
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(width / 2 - 20, height / 2 - 60, 3, 5, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#ADD8E6"
      ctx.fill()
      break

    case "concerned":
      // Concerned eyes
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Eyebrows
      ctx.beginPath()
      ctx.moveTo(width / 2 - 35, height / 2 - 100)
      ctx.lineTo(width / 2 - 15, height / 2 - 105)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width / 2 + 35, height / 2 - 100)
      ctx.lineTo(width / 2 + 15, height / 2 - 105)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "shocked":
      // Shocked eyes (wide)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "dancing":
      // Dancing eyes (happy with movement)
      const eyeOffset = Math.sin(frameCount * 0.2) * 5

      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25 + eyeOffset, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25 + eyeOffset, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22 + eyeOffset, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22 + eyeOffset, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Music notes
      ctx.font = "20px Arial"
      ctx.fillStyle = "#000"
      if (frameCount % 30 < 15) {
        ctx.fillText("♪", width / 2 + 60, height / 2 - 100)
        ctx.fillText("♫", width / 2 + 80, height / 2 - 80)
      } else {
        ctx.fillText("♫", width / 2 + 60, height / 2 - 80)
        ctx.fillText("♪", width / 2 + 80, height / 2 - 100)
      }
      break

    case "loving":
      // Loving eyes (heart shaped)
      drawHeartEye(ctx, width / 2 - 25, height / 2 - 90, 12)
      drawHeartEye(ctx, width / 2 + 25, height / 2 - 90, 12)
      break

    case "sleepy":
      // Sleepy eyes (half closed)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Z's for sleeping
      const zSize = 10 + Math.sin(frameCount * 0.1) * 3
      ctx.font = `${zSize}px Arial`
      ctx.fillStyle = "#000"
      ctx.fillText("z", width / 2 + 60, height / 2 - 80)
      ctx.font = `${zSize * 1.2}px Arial`
      ctx.fillText("Z", width / 2 + 70, height / 2 - 95)
      ctx.font = `${zSize * 1.4}px Arial`
      ctx.fillText("Z", width / 2 + 85, height / 2 - 110)
      break

    case "laughing":
      // Laughing eyes (squinted)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 2 + Math.sin(frameCount * 0.3) * 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 2 + Math.sin(frameCount * 0.3) * 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // "Ha ha" text
      if (frameCount % 30 < 15) {
        ctx.font = "14px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Tweet!", width / 2 + 50, height / 2 - 40)
      } else {
        ctx.font = "14px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText("Chirp!", width / 2 + 50, height / 2 - 40)
      }
      break

    case "scared":
      // Scared eyes (wide with small pupils)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 12, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // White of eyes
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Small pupils (looking around nervously)
      const pupilX = Math.sin(frameCount * 0.2) * 3
      const pupilY = Math.cos(frameCount * 0.2) * 3

      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25 + pupilX, height / 2 - 90 + pupilY, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25 + pupilX, height / 2 - 90 + pupilY, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "curious":
      // Curious eyes (one eyebrow raised)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Raised eyebrow
      ctx.beginPath()
      ctx.moveTo(width / 2 - 35, height / 2 - 100)
      ctx.lineTo(width / 2 - 15, height / 2 - 110)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()

      // Normal eyebrow
      ctx.beginPath()
      ctx.moveTo(width / 2 + 15, height / 2 - 100)
      ctx.lineTo(width / 2 + 35, height / 2 - 100)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000"
      ctx.stroke()
      break

    case "thinking":
      // Thinking eyes (looking up)
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 95, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 95, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 98, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 98, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    default:
      // Default eyes
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 25, height / 2 - 90, 8, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // White eye shine
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.ellipse(width / 2 - 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(width / 2 + 22, height / 2 - 93, 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
  }
}

