"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface GoogleMapComponentProps {
  onSelectLocation: (lat: number, lng: number) => void
}

export default function GoogleMapComponent({ onSelectLocation }: GoogleMapComponentProps) {
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null)

  // Default coordinates for Algiers
  const defaultLat = 36.7538
  const defaultLng = 3.0588

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate relative position (0-1)
    const relX = x / rect.width
    const relY = y / rect.height

    // Convert to approximate lat/lng (simple linear mapping)
    // This is a very simplified approximation
    const latRange = 0.2 // ~20km north-south
    const lngRange = 0.3 // ~30km east-west

    const lat = defaultLat + (0.5 - relY) * latRange
    const lng = defaultLng + (relX - 0.5) * lngRange

    setSelectedPoint({ x, y })
    onSelectLocation(lat, lng)
  }

  return (
    <div className="relative w-full h-full bg-blue-50 cursor-pointer" onClick={handleMapClick}>
      {/* Static map image */}
      <div className="relative w-full h-full">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simulation%20interactive%20map-vKpxgJd5DJKLaDQTV6cXtNJCxw2xki.png"
          alt="Carte d'Algiers"
          fill
          className="object-cover"
        />
      </div>

      {/* Selected point marker */}
      {selectedPoint && (
        <div
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${selectedPoint.x}px`,
            top: `${selectedPoint.y}px`,
          }}
        >
          <div className="flex flex-col items-center">
            <MapPin className="h-8 w-8 text-primary" />
            <div className="bg-white px-2 py-1 rounded-md shadow-md text-xs">Emplacement sélectionné</div>
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-md max-w-xs">
        <div className="flex items-center">
          <div className="bg-accent rounded-full w-2 h-2 mr-2"></div>
          <p className="text-sm font-medium">Sélectionnez votre emplacement</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Cliquez sur la carte pour indiquer l'emplacement exact de votre installation
        </p>
      </div>
    </div>
  )
}
