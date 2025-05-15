"use client"

import type React from "react"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapPlaceholderProps {
  onSelectLocation: (location: { lat: number; lng: number; address?: string }) => void
}

export default function MapPlaceholder({ onSelectLocation }: MapPlaceholderProps) {
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
    const latRange = 0.2 // ~20km north-south
    const lngRange = 0.3 // ~30km east-west

    const lat = defaultLat + (0.5 - relY) * latRange
    const lng = defaultLng + (relX - 0.5) * lngRange

    setSelectedPoint({ x, y })
    onSelectLocation({ lat, lng, address: "Emplacement sélectionné" })
  }

  // Function to select a default location without clicking
  const selectDefaultLocation = () => {
    // Center of the placeholder
    const x = 200
    const y = 200
    setSelectedPoint({ x, y })
    onSelectLocation({
      lat: defaultLat,
      lng: defaultLng,
      address: "Emplacement par défaut (Alger)",
    })
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-grow bg-blue-50 cursor-pointer" onClick={handleMapClick}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Carte temporairement indisponible</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cliquez n'importe où sur cette zone pour sélectionner un emplacement, ou utilisez le bouton ci-dessous
              pour sélectionner un emplacement par défaut.
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                selectDefaultLocation()
              }}
              className="bg-primary hover:bg-secondary text-white"
            >
              Sélectionner un emplacement par défaut
            </Button>
          </div>
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
      </div>
    </div>
  )
}
