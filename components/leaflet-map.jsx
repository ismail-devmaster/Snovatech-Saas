"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

export default function LeafletMap({ onSelectLocation, selectedLocation, className }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Initialize map after Leaflet scripts are loaded
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return

    // If map is already initialized, return
    if (mapInstanceRef.current) return

    // Access Leaflet from window object
    const L = window.L

    if (!L) {
      console.error("Leaflet not available")
      return
    }

    // Initialize map centered on Algiers
    const map = L.map(mapRef.current).setView([36.7538, 3.0588], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Create custom icon for the marker
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ff0000" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })

    // Handle map click to set marker
    map.on("click", (e) => {
      const { lat, lng } = e.latlng

      // Remove existing marker if any
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      // Add new marker with custom icon
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup("Emplacement sélectionné")
        .openPopup()

      markerRef.current = marker

      // Call the callback with location data
      onSelectLocation({ lat, lng, address: "Emplacement sélectionné" })
    })

    // Save map instance for cleanup
    mapInstanceRef.current = map

    // Trigger a resize event after map is loaded to fix rendering issues
    setTimeout(() => {
      map.invalidateSize()
      setIsMapReady(true)
    }, 100)

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded, onSelectLocation])

  // Update marker if selectedLocation changes externally
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation || !isMapReady || !window.L) return

    const L = window.L

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
    }

    // Create custom icon for the marker
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ff0000" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })

    // Add new marker
    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: customIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup("Emplacement sélectionné")
      .openPopup()

    markerRef.current = marker

    // Center map on the marker
    mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 13)
  }, [selectedLocation, isMapReady])

  // Handle Leaflet script load completion
  const handleScriptsLoaded = () => {
    setLeafletLoaded(true)
  }

  return (
    <>
      {/* Load Leaflet CSS and JS from CDN */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin="anonymous"
        onLoad={handleScriptsLoaded}
        strategy="afterInteractive"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin="anonymous"
      />

      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 1rem;
        }
        .custom-div-icon {
          background: none;
          border: none;
        }
        .marker-pin {
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
        }
      `}</style>
      <div ref={mapRef} className={className || "w-full h-full"}>
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-primary font-medium">Chargement de la carte...</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
