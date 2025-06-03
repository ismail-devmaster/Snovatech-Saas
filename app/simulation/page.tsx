"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Menu, Loader2, Search } from "lucide-react";
import { ResultsModal } from "@/components/results-modal";
import dynamic from "next/dynamic";

// Import the map component with no SSR
interface Location {
  lat: number;
  lng: number;
}

interface FormErrors {
  name?: string;
  roofArea?: string;
  roofType?: string;
  consumption?: string;
  cost?: string;
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

const LeafletMap = dynamic(() => import("@/components/leaflet-map.jsx"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-primary font-medium">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function SimulationPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [resultsModalOpen, setResultsModalOpen] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<SimulationData | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(true);

  // Form state
  const [addressSearch, setAddressSearch] = useState("");
  const [name, setName] = useState("ex. Laichi Chanez");
  const [roofArea, setRoofArea] = useState("ex. 120m²");
  const [roofType, setRoofType] = useState("");
  const [consumption, setConsumption] = useState("ex. 1 500 kWh/an");
  const [cost, setCost] = useState("ex. 20 000 DA");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleMapClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!name.trim() || name === "ex. Laichi Chanez") {
      errors.name = "Le nom est requis";
    }

    if (!roofArea.trim() || roofArea === "ex. 120m²") {
      errors.roofArea = "La surface de toiture est requise";
    }

    if (!roofType) {
      errors.roofType = "Le type de toiture est requis";
    }

    if (!consumption.trim() || consumption === "ex. 1 500 kWh/an") {
      errors.consumption = "La consommation électrique est requise";
    }

    if (!cost.trim() || cost === "ex. 20 000 DA") {
      errors.cost = "Le coût annuel est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const runSimulation = () => {
    if (!validateForm()) {
      return;
    }

    setSimulationLoading(true);

    setTimeout(() => {
      const panelCount = 30;
      const installationCost = panelCount * 80000;
      const roiYears = 5;

      const monthlyGeneration = [45, 30, 65, 40, 55, 70, 25];
      const yearlyComparison = {
        consumption: [15, 10, 5, 45, 50, 35, 30, 55, 45, 60, 65, 70],
        production: [18, 20, 22, 25, 30, 28, 15, 40, 38, 45, 55, 65],
      };

      setSimulationData({
        // panels: panelCount,
        panels: Math.floor((Number.parseFloat(roofArea) * 3) / 10) || 30,
        cost: `${(Number(consumption) < 125
          ? Number(consumption) * 4179
          : Number(consumption) * 1779
        ).toFixed(1)} DA`,
        roi: `${roiYears} ans`,
        monthlyGeneration,
        yearlyComparison,
        location: selectedLocation,
      });

      setLoading(true);
      setResultsModalOpen(true);

      setTimeout(() => {
        setLoading(false);
        setSimulationLoading(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-200 to-blue-200">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm py-4 px-6 shadow-sm z-10 relative rounded-full mx-6 mt-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="SnovaTech Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <h1 className="text-xl font-bold">
              <span className="text-accent">Snova</span>
              <span className="text-primary">Tech</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Accueil
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
            >
              À propos
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
            >
              Comment
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop Simulation Button */}
          <div className="hidden md:block">
            <Button className="bg-primary hover:bg-secondary text-white rounded-full px-6">
              Simulation Gratuite
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-2">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                À propos
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                Comment
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative px-6 py-6">
        {/* Address Search Bar */}
        <div className="max-w-md mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Recherchez votre adresse"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-sm"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Form Panel */}
          <div className="w-96 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="ex. Laichi Chanez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white/70 border-gray-200 ${
                    formErrors.name ? "border-red-500" : ""
                  }`}
                  onFocus={() => {
                    if (name === "ex. Laichi Chanez") setName("");
                  }}
                  onBlur={() => {
                    if (name === "") setName("ex. Laichi Chanez");
                  }}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surface de votre toiture (en m²){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="ex. 120m²"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className={`w-full bg-white/70 border-gray-200 ${
                    formErrors.roofArea ? "border-red-500" : ""
                  }`}
                  onFocus={() => {
                    if (roofArea === "ex. 120m²") setRoofArea("");
                  }}
                  onBlur={() => {
                    if (roofArea === "") setRoofArea("ex. 120m²");
                  }}
                />
                {formErrors.roofArea && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.roofArea}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de toiture <span className="text-red-500">*</span>
                </label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  className={`w-full rounded-md border bg-white/70 border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.roofType ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Sélectionner</option>
                  <option value="flat">Toit plat</option>
                  <option value="sloped">Toit incliné</option>
                  <option value="metal">Toit métallique</option>
                </select>
                {formErrors.roofType && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.roofType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consommation électrique (en kWh/an){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="ex. 1 500 kWh/an"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className={`w-full bg-white/70 border-gray-200 ${
                    formErrors.consumption ? "border-red-500" : ""
                  }`}
                  onFocus={() => {
                    if (consumption === "ex. 1 500 kWh/an") setConsumption("");
                  }}
                  onBlur={() => {
                    if (consumption === "") setConsumption("ex. 1 500 kWh/an");
                  }}
                />
                {formErrors.consumption && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.consumption}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez trouver cette info sur votre facture
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coût annuel électricité (da){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="ex. 20 000 DA"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className={`w-full bg-white/70 border-gray-200 ${
                    formErrors.cost ? "border-red-500" : ""
                  }`}
                  onFocus={() => {
                    if (cost === "ex. 20 000 DA") setCost("");
                  }}
                  onBlur={() => {
                    if (cost === "") setCost("ex. 20 000 DA");
                  }}
                />
                {formErrors.cost && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cost}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez trouver cette info sur votre facture
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={runSimulation}
                  className="w-full bg-primary hover:bg-secondary text-white rounded-full"
                  disabled={simulationLoading}
                >
                  {simulationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Simulation en cours...
                    </>
                  ) : (
                    "Simuler"
                  )}
                </Button>
              </div>

              {selectedLocation && (
                <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded-md">
                  <p className="font-medium">✓ Emplacement sélectionné:</p>
                  <p className="mt-1">
                    Coordonnées: {selectedLocation.lat.toFixed(4)},{" "}
                    {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="flex-1 relative">
            <div className="w-full h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden relative z-10">
              <LeafletMap
                onSelectLocation={handleMapClick}
                selectedLocation={selectedLocation}
                className="w-full h-full rounded-2xl"
              />
            </div>

            {/* Info Tooltip */}
            {showInfoTooltip && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-sm z-20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Cette simulation est là pour vous donner une estimation
                      approximative ! C'est un bon point de départ, mais rien de
                      précis à ce stade.
                    </p>
                    <p className="text-xs text-gray-600">
                      Pour une simulation vraiment personnalisée (et plus
                      fiable), on passe à l'étape suivante ensemble. On s'occupe
                      du reste ❤️
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInfoTooltip(false)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <ResultsModal
        open={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        simulationData={simulationData}
        loading={loading}
      />
    </div>
  );
}
