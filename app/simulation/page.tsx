"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

interface Location {
  lat: number;
  lng: number;
}

interface SimulationData {
  panels: number;
  cost: string;
  monthlyGeneration: number[];
  location: Location | null;
}

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function SimulationPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [addressSearch, setAddressSearch] = useState("");

  const handleMapClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="relative min-h-screen">
      {/* Map background */}
      <div className="fixed inset-0 z-0">
        <LeafletMap
          onSelectLocation={handleMapClick}
          selectedLocation={selectedLocation}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
