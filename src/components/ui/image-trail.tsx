import React, { Children, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AnimationSequence,
  motion,
  Target,
  Transition,
  useAnimate,
  useAnimationFrame,
} from "framer-motion"
import { v4 as uuidv4 } from "uuid"

import { useMouseVector } from "@/components/hooks/use-mouse-vector"

type TrailSegment = [Target, Transition]
type TrailAnimationSequence = TrailSegment[]

interface ImageTrailProps {
  children: React.ReactNode
  containerRef?: React.RefObject<HTMLElement | null>
  newOnTop?: boolean
  rotationRange?: number
  animationSequence?: TrailAnimationSequence
  interval?: number
}

interface TrailItem {
  id: string
  x: number
  y: number
  rotation: number
  animationSequence: TrailAnimationSequence
  scale: number
  child: React.ReactNode
}

const ImageTrail = ({
  children,
  newOnTop = true,
  rotationRange = 12,
  containerRef,
  animationSequence = [
    [{ scale: 1.1, opacity: 1 }, { duration: 0.15, ease: "easeOut" }],
    [{ scale: 0.2, opacity: 0, filter: "blur(4px)" }, { duration: 0.6, ease: "easeIn", delay: 0.4 }],
  ],
  interval = 90, // ms between spawns
}: ImageTrailProps) => {
  const [trail, setTrail] = useState<TrailItem[]>([])
  const lastAddedTimeRef = useRef<number>(0)
  
  const { position: mousePosition } = useMouseVector(containerRef)
  const lastMousePosRef = useRef(mousePosition)
  const currentIndexRef = useRef(0)

  const childrenArray = useMemo(() => Children.toArray(children), [children])

  const addToTrail = useCallback(
    (mousePos: { x: number; y: number }) => {
      if (childrenArray.length === 0) return

      const newItem: TrailItem = {
        id: uuidv4(),
        // Center the images (assuming a typical size of 160px width, 120px height)
        x: mousePos.x - 80,
        y: mousePos.y - 60,
        rotation: (Math.random() - 0.5) * rotationRange * 2,
        animationSequence,
        scale: 1,
        child: childrenArray[currentIndexRef.current],
      }

      currentIndexRef.current = (currentIndexRef.current + 1) % childrenArray.length

      setTrail((prev) => {
        if (newOnTop) {
          return [...prev, newItem]
        } else {
          return [newItem, ...prev]
        }
      })
    },
    [childrenArray, rotationRange, animationSequence, newOnTop]
  )

  const removeFromTrail = useCallback((itemId: string) => {
    setTrail((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  useAnimationFrame((time) => {
    // Check if mouse actually moved
    if (
      lastMousePosRef.current.x === mousePosition.x &&
      lastMousePosRef.current.y === mousePosition.y
    ) {
      return
    }
    lastMousePosRef.current = mousePosition

    const currentTime = time
    if (currentTime - lastAddedTimeRef.current < interval) {
      return
    }

    lastAddedTimeRef.current = currentTime
    addToTrail(mousePosition)
  })

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
      {trail.map((item) => (
        <TrailItemComponent key={item.id} item={item} onComplete={removeFromTrail} />
      ))}
    </div>
  )
}

interface TrailItemProps {
  item: TrailItem
  onComplete: (id: string) => void
}

const TrailItemComponent = ({ item, onComplete }: TrailItemProps) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const sequence = item.animationSequence.map((segment: TrailSegment) => [
      scope.current,
      ...segment,
    ])

    animate(sequence as AnimationSequence).then(() => {
      onComplete(item.id)
    })
  }, [animate, item.animationSequence, item.id, onComplete, scope])

  return (
    <motion.div
      ref={scope}
      className="absolute pointer-events-none"
      style={{
        left: item.x,
        top: item.y,
        rotate: item.rotation,
      }}
      initial={{ scale: 0, opacity: 0 }}
    >
      {item.child}
    </motion.div>
  )
}

export { ImageTrail }
