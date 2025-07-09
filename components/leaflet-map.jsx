"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

export default function LeafletMap({
  onSelectLocation,
  selectedLocation,
  className,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Memoize the location selection callback
  const handleLocationSelect = useCallback(
    (location) => {
      onSelectLocation(location);
    },
    [onSelectLocation]
  );

  // Initialize map after Leaflet scripts are loaded
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    // If map is already initialized, return
    if (mapInstanceRef.current) return;

    // Access Leaflet from window object
    const L = window.L;

    if (!L) {
      console.error("Leaflet not available");
      return;
    }

    // Algeria bounds (approximate coordinates)
    const algeriaBounds = [
      [19.0, -8.7], // Southwest corner
      [37.1, 12.0], // Northeast corner
    ];

    // Initialize map centered on Algeria with restricted bounds
    const map = L.map(mapRef.current, {
      zoomControl: false, // We'll add custom controls
      attributionControl: false,
      dragging: true, // Enable dragging
      touchZoom: true, // Enable touch zoom
      doubleClickZoom: true, // Enable double click zoom
      scrollWheelZoom: true, // Enable scroll wheel zoom
      boxZoom: true, // Enable box zoom
      keyboard: true, // Enable keyboard navigation
      tap: true, // Enable tap for mobile
      maxBounds: algeriaBounds, // Restrict map to Algeria
      maxBoundsViscosity: 1.0, // Prevent dragging outside bounds
    }).setView([28.0339, 1.6596], 6); // Center on Algeria

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 5, // Allow zooming out to see all of Algeria
    }).addTo(map);

    // Add custom zoom control to bottom right
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    // Create custom icon for the marker
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#f97316" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Handle map click to set marker
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      // Check if the clicked location is within Algeria bounds
      if (lat < 19.0 || lat > 37.1 || lng < -8.7 || lng > 12.0) {
        console.log("Location outside Algeria bounds, ignoring click");
        return;
      }

      // Remove existing marker if any
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Add new marker with custom icon
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup("Emplacement sélectionné")
        .openPopup();

      markerRef.current = marker;

      // Call the callback with location data
      handleLocationSelect({ lat, lng, address: "Emplacement sélectionné" });
    });

    // Add event listeners for better interactivity feedback
    map.on("movestart", () => {
      console.log("Map movement started");
    });

    map.on("zoomstart", () => {
      console.log("Map zoom started");
    });

    // Save map instance for cleanup
    mapInstanceRef.current = map;

    // Trigger a resize event after map is loaded to fix rendering issues
    setTimeout(() => {
      map.invalidateSize();
      setIsMapReady(true);
      console.log("Map is ready and interactive");
    }, 100);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, handleLocationSelect]);

  // Update marker if selectedLocation changes externally
  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !selectedLocation ||
      !isMapReady ||
      !window.L
    )
      return;

    // Check if the selected location is within Algeria bounds
    if (
      selectedLocation.lat < 19.0 ||
      selectedLocation.lat > 37.1 ||
      selectedLocation.lng < -8.7 ||
      selectedLocation.lng > 12.0
    ) {
      console.log("Selected location outside Algeria bounds, ignoring");
      return;
    }

    const L = window.L;

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Create custom icon for the marker
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#f97316" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add new marker
    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
      icon: customIcon,
    })
      .addTo(mapInstanceRef.current)
      .bindPopup("Emplacement sélectionné")
      .openPopup();

    markerRef.current = marker;

    // Center map on the marker smoothly without re-initializing
    mapInstanceRef.current.setView(
      [selectedLocation.lat, selectedLocation.lng],
      13,
      {
        animate: true,
        duration: 0.5,
      }
    );
  }, [selectedLocation, isMapReady]);

  // Handle window resize to maintain map responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Leaflet script load completion
  const handleScriptsLoaded = useCallback(() => {
    setLeafletLoaded(true);
  }, []);

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
          cursor: grab;
        }
        .leaflet-container:active {
          cursor: grabbing;
        }
        .custom-div-icon {
          background: none;
          border: none;
        }
        .marker-pin {
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
          transition: transform 0.2s ease;
        }
        .marker-pin:hover {
          transform: scale(1.1);
        }
        .leaflet-control-zoom {
          margin-bottom: 80px !important;
          margin-right: 20px !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .leaflet-control-zoom a {
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 18px !important;
          background-color: white !important;
          color: #374151 !important;
          border: none !important;
          transition: all 0.2s ease;
        }
        .leaflet-control-zoom a:hover {
          background-color: #f3f4f6 !important;
          color: #f97316 !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      <div ref={mapRef} className={className || "w-full h-full"}>
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-sky-200">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-orange-600 font-medium">
                Chargement de la carte...
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
