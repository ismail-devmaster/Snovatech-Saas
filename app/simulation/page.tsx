"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimulationResults } from "@/components/simulation-modal";

interface Location {
  lat: number;
  lng: number;
}

interface SimulationData {
  panels: number;
  cost: string;
  roi: string;
  monthlyGeneration: number[];
  yearlyComparison: {
    consumption: number[];
    production: number[];
  };
  location: Location | null;
}

// Move the dynamic import outside the component
const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-sky-200 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-orange-600 font-medium">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function SimulationPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [addressSearch, setAddressSearch] = useState("");
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );

  // Form state
  const [name, setName] = useState("");
  const [roofArea, setRoofArea] = useState("");
  const [roofType, setRoofType] = useState("");
  const [consumption, setConsumption] = useState("");
  const [cost, setCost] = useState("");

  const handleMapClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSimulate = () => {
    if (!selectedLocation) {
      alert("Veuillez sélectionner un emplacement sur la carte");
      return;
    }

    // Validate numeric fields
    const roofAreaNum = Number.parseFloat(roofArea);
    const consumptionNum = Number.parseFloat(consumption);
    const costNum = Number.parseFloat(cost);

    if (!roofAreaNum || roofAreaNum <= 0) {
      alert("Veuillez entrer une surface de toiture valide");
      return;
    }

    if (!consumptionNum || consumptionNum <= 0) {
      alert("Veuillez entrer une consommation électrique valide");
      return;
    }

    if (!costNum || costNum <= 0) {
      alert("Veuillez entrer un coût annuel valide");
      return;
    }

    // Show calculating state
    setIsCalculating(true);

    // Simulate API delay
    setTimeout(() => {
      // Generate simulation data based on inputs
      const panelCount = Math.floor(roofAreaNum * 0.25 || 30); // Approx 4m² per panel
      const installationCost = panelCount * 80000; // 80,000 DA per panel
      const roiYears = Math.ceil(installationCost / (costNum || 20000)); // Simple ROI calculation

      // Generate monthly data
      const generateMonthlyData = () => {
        const baseValue = 40;
        return Array.from({ length: 12 }, (_, i) => {
          // Summer months produce more
          const seasonFactor = i >= 4 && i <= 8 ? 1.5 : 0.7;
          return Math.floor(
            baseValue * seasonFactor * (0.8 + Math.random() * 0.4)
          );
        });
      };

      // Set simulation data
      setSimulationData({
        // panels: panelCount,
        panels: Math.floor((roofAreaNum / 10) * 3),
        cost: (() => {
          const totalCost =
            Number(consumption) < 125
              ? Number(consumption) * 4179
              : Number(consumption) * 1779;

          if (totalCost >= 1000000) {
            return `${(totalCost / 1000000).toFixed(1)} million DA`;
          }
          return `${totalCost.toFixed(1)} DA`;
        })(),
        roi: `${roiYears} ans`,
        monthlyGeneration: generateMonthlyData(),
        yearlyComparison: {
          consumption: Array.from({ length: 12 }, () =>
            Math.floor(15 + Math.random() * 30)
          ),
          production: Array.from({ length: 12 }, () =>
            Math.floor(10 + Math.random() * 40)
          ),
        },
        location: selectedLocation,
      });

      // Hide calculating state and show results
      setIsCalculating(false);
      setShowResults(true);
    }, 1500);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  // Memoize the map component to prevent unnecessary re-renders
  const memoizedMap = useMemo(
    () => (
      <LeafletMap
        onSelectLocation={handleMapClick}
        selectedLocation={selectedLocation}
        className="w-full h-full"
      />
    ),
    [selectedLocation]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Map as background - fully interactive */}
      <div className="absolute inset-0 z-0">{memoizedMap}</div>

      {/* Header - positioned above map but allows map interaction below */}
      <header className="absolute top-4 left-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg pointer-events-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold">
            <span className="text-orange-500">Snova</span>
            <span className="text-slate-800">Tech</span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm">
            <a
              href="#"
              className="text-slate-800 font-medium hover:text-orange-500 transition-colors"
            >
              • Accueil
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              À propos
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              Comment
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              FAQ
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <Button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm">
            Simulation Gratuite
          </Button>
        </div>
      </header>

      {/* Form Panel - Optimized for viewport visibility */}
      <div className="absolute top-20 mt-3 left-4 z-20 w-80 max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-lg pointer-events-auto overflow-hidden flex flex-col">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Address Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Recherchez votre adresse"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="pl-9 py-2.5 text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nom et prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="ex. Laichi Chanez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm py-2 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Surface de votre toiture (en m²){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="120"
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                min="1"
                max="10000"
                step="1"
                className="text-sm py-2 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type de toiture <span className="text-red-500">*</span>
              </label>
              <select
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Sélectionner</option>
                <option value="flat">Toit plat</option>
                <option value="sloped">Toit incliné</option>
                <option value="metal">Toit métallique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Consommation électrique (en kWh/an){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="1500"
                value={consumption}
                onChange={(e) => setConsumption(e.target.value)}
                min="1"
                max="100000"
                step="1"
                className="text-sm py-2 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-0.5">
                Vous pouvez trouver cette info sur votre facture
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Coût annuel électricité (da){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="20000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min="1"
                max="10000000"
                step="1"
                className="text-sm py-2 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-0.5">
                Vous pouvez trouver cette info sur votre facture
              </p>
            </div>
          </div>
        </div>

        {/* Fixed bottom section with button */}
        <div className="border-t border-gray-100 p-4 bg-white rounded-b-2xl">
          <Button
            onClick={handleSimulate}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-medium text-sm"
            disabled={!selectedLocation || isCalculating}
          >
            {isCalculating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calcul en cours...
              </div>
            ) : (
              "Simuler"
            )}
          </Button>

          {selectedLocation && (
            <div className="text-xs text-green-600 mt-2 text-center">
              ✓ Emplacement sélectionné
            </div>
          )}
        </div>
      </div>

      {/* Info Popup - Responsive positioning */}
      {showInfoPopup && (
        <div className="absolute top-20 mt-3 right-4 z-20 bg-white rounded-xl p-4 shadow-lg max-w-xs pointer-events-auto">
          <button
            onClick={() => setShowInfoPopup(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pr-6">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Cette simulation est là pour vous donner une estimation
              approximative ! C'est un bon point de départ, mais rien de précis
              à ce stade.
            </p>
            <p className="text-sm text-gray-600">
              Pour une simulation vraiment personnalisée (et plus fiable), on
              passe à l'étape suivante ensemble. On s'occupe du reste 😊
            </p>
          </div>
        </div>
      )}

      {/* Location Button - positioned above map */}
      <button
        className="absolute bottom-4 right-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 pointer-events-auto"
        aria-label="My Location"
        onClick={() => {
          // Add geolocation functionality here
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLocation({ lat: latitude, lng: longitude });
              },
              (error) => {
                console.error("Error getting location:", error);
                alert("Impossible d'obtenir votre position actuelle");
              }
            );
          } else {
            alert("La géolocalisation n'est pas supportée par ce navigateur");
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="1" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
        </svg>
      </button>

      {/* Simulation Results Modal */}
      {showResults && simulationData && (
        <SimulationResults data={simulationData} onClose={handleCloseResults} />
      )}

      {/* Invisible overlay to ensure map interactions work everywhere else */}
      <div className="absolute inset-0 z-10 pointer-events-none" />
    </div>
  );
}
