"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Search, X, MapPin, Calculator, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimulationResults } from "@/components/simulation-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Location {
  lat: number;
  lng: number;
}

interface SimulationData {
  panels: number;
  production: number;
  cost: number;
  roi: number;
  monthlyGeneration: number[];
  yearlyComparison: {
    consumption: number[];
    production: number[];
  };
  location: Location;
  savings: number;
  paybackPeriod: number;
}

interface FormData {
  name: string;
  roofArea: string;
  roofType: string;
  consumption: string;
  cost: string;
}

interface FormErrors {
  name?: string;
  roofArea?: string;
  roofType?: string;
  consumption?: string;
  cost?: string;
  location?: string;
}

// Constants for calculations
const PANEL_EFFICIENCY = 0.25; // 4m² per panel
const PANEL_COST_DA = 80000; // Cost per panel in DA
const FLAT_ROOF_MULTIPLIER = 3;
const SLOPED_ROOF_MULTIPLIER = 3.4;
const PANEL_PRODUCTION_KWH = 1150; // kWh per panel per year
const INSTALLATION_COST_PER_PANEL = 36000; // DA per panel

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
  // Location and UI state
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    roofArea: "",
    roofType: "",
    consumption: "",
    cost: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [toiturePanels, setToiturePanels] = useState<number | null>(null);

  // Update roof panel multiplier when roof type changes
  useEffect(() => {
    if (formData.roofType === "flat") {
      setToiturePanels(FLAT_ROOF_MULTIPLIER);
    } else if (formData.roofType === "sloped") {
      setToiturePanels(SLOPED_ROOF_MULTIPLIER);
    } else {
      setToiturePanels(null);
    }
  }, [formData.roofType]);

  // Calculate consumption if not provided
  const calculateConsumption = useCallback((cost: number): number => {
    return (cost * 10000) / 4179;
  }, []);

  // Form validation
  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom est requis";
    }

    const roofAreaNum = parseFloat(formData.roofArea);
    if (!formData.roofArea || isNaN(roofAreaNum) || roofAreaNum <= 0) {
      errors.roofArea = "Veuillez entrer une surface de toiture valide";
    } else if (roofAreaNum > 10000) {
      errors.roofArea = "La surface semble trop importante";
    }

    if (!formData.roofType) {
      errors.roofType = "Veuillez sélectionner un type de toiture";
    }

    // Consumption is now optional - we'll calculate it if not provided
    if (formData.consumption) {
      const consumptionNum = parseFloat(formData.consumption);
      if (isNaN(consumptionNum) || consumptionNum <= 0) {
        errors.consumption =
          "Veuillez entrer une consommation électrique valide";
      }
    }

    const costNum = parseFloat(formData.cost);
    if (!formData.cost || isNaN(costNum) || costNum <= 0) {
      errors.cost = "Veuillez entrer un coût annuel valide";
    }

    if (!selectedLocation) {
      errors.location = "Veuillez sélectionner un emplacement sur la carte";
    }

    return errors;
  }, [formData, selectedLocation]);

  // Handle form input changes
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formErrors]
  );

  // Handle map click
  const handleMapClick = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      // Clear location error
      if (formErrors.location) {
        setFormErrors((prev) => ({ ...prev, location: undefined }));
      }
    },
    [formErrors.location]
  );

  // Calculate solar potential
  const calculateSolarPotential = useCallback(
    (
      roofArea: number,
      roofType: string,
      consumption: number,
      costAnnuel: number
    ): SimulationData => {
      // 1. Calculate panels: roofArea * roofType multiplier / 10
      const multiplier =
        roofType === "flat" ? FLAT_ROOF_MULTIPLIER : SLOPED_ROOF_MULTIPLIER;
      const panelCount = Math.floor((roofArea * multiplier) / 10);

      // 2. Calculate cost: 720 * 50 * panels
      const installationCost = 720 * 50 * panelCount;

      // 3. Calculate ROI: installation cost / annual electricity cost
      const roi = installationCost / costAnnuel / 10000;

      const annualProduction = panelCount * PANEL_PRODUCTION_KWH;
      const annualSavings = Math.min(
        annualProduction * (costAnnuel / consumption),
        costAnnuel
      );
      const paybackPeriod = installationCost / annualSavings;

      // Generate realistic monthly generation data
      const generateMonthlyData = () => {
        const monthlyFactors = [
          0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5,
        ];
        return monthlyFactors.map((factor) =>
          Math.round(
            (annualProduction / 12) * factor * (0.9 + Math.random() * 0.2)
          )
        );
      };

      const generateYearlyComparison = () => {
        const monthlyConsumption = consumption / 12;
        const monthlyProduction = annualProduction / 12;

        return {
          consumption: Array.from({ length: 12 }, (_, i) =>
            Math.round(monthlyConsumption * (0.9 + Math.random() * 0.2))
          ),
          production: Array.from({ length: 12 }, (_, i) =>
            Math.round(monthlyProduction * (0.8 + Math.random() * 0.4))
          ),
        };
      };

      // ... existing code ...
      return {
        panels: panelCount,
        production: annualProduction,
        cost: installationCost,
        roi: roi,
        monthlyGeneration: generateMonthlyData(),
        yearlyComparison: generateYearlyComparison(),
        location: selectedLocation!,
        savings: annualSavings,
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      };
    },
    [selectedLocation]
  );

  // Handle simulation
  const handleSimulate = useCallback(async () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Show alert for first error
      const errorMessages = Object.values(errors);
      if (errorMessages.length > 0) {
        alert(errorMessages[0]);
      }
      return;
    }

    setIsCalculating(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Determine consumption value
      let consumption: number;
      const costNum = parseFloat(formData.cost);

      if (formData.consumption && formData.consumption.trim() !== "") {
        // User provided consumption
        consumption = parseFloat(formData.consumption);
        console.log("User provided consumption:", consumption, "kWh/an");
      } else {
        // Calculate consumption from cost
        consumption = calculateConsumption(costNum);
        console.log("Calculated consumption from cost:", {
          cost: costNum,
          calculatedConsumption: consumption,
          formula: `${costNum} * 10000 / 4179 = ${consumption}`,
        });
      }

      // Calculate simulation data
      const simulation = calculateSolarPotential(
        parseFloat(formData.roofArea),
        formData.roofType,
        consumption,
        costNum
      );

      setSimulationData(simulation);
      setShowResults(true);
    } catch (error) {
      console.error("Simulation error:", error);
      alert("Une erreur est survenue lors du calcul. Veuillez réessayer.");
    } finally {
      setIsCalculating(false);
    }
  }, [formData, validateForm, calculateSolarPotential, calculateConsumption]);

  // Handle geolocation
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par ce navigateur");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        let message = "Impossible d'obtenir votre position actuelle";
        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Accès à la localisation refusé. Veuillez l'autoriser dans les paramètres.";
        }
        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Close results modal
  const handleCloseResults = useCallback(() => {
    setShowResults(false);
  }, []);

  // Memoize the map component to prevent unnecessary re-renders
  const memoizedMap = useMemo(
    () => (
      <LeafletMap
        onSelectLocation={handleMapClick}
        selectedLocation={selectedLocation}
        className="w-full h-full"
      />
    ),
    [selectedLocation, handleMapClick]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Map as background - fully interactive */}
      <div className="absolute inset-0 z-0">{memoizedMap}</div>

      {/* Navigation - positioned above map but allows map interaction below */}
      <nav className="absolute top-2 left-16 right-16 z-20 bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-gray-200 pointer-events-auto">
        <div className="flex items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center space-x-0 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl font-bold text-[#FFAA00]">Snova</span>
            <span className="text-2xl font-bold text-[#050035]">Tech</span>
          </a>

          {/* Desktop Navigation - Centered Links */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <a
              href="/"
              className="text-gray-600 hover:text-[#050035] transition-colors"
            >
              Accueil
            </a>
            <a
              href="/#services"
              className="text-gray-600 hover:text-[#050035] transition-colors"
            >
              Services
            </a>
            <a
              href="/#avantages"
              className="text-gray-600 hover:text-[#050035] transition-colors"
            >
              Avantages
            </a>
            <a
              href="/#a-propos"
              className="text-gray-600 hover:text-[#050035] transition-colors"
            >
              À propos
            </a>
            <a
              href="/#faq"
              className="text-gray-600 hover:text-[#050035] transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Desktop Simulation Button - Right */}
          <div className="hidden md:flex items-center ml-8">
            <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-6">
              Simulation Gratuite
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-[#050035]"></div>
              <div className="w-full h-0.5 bg-[#050035]"></div>
              <div className="w-full h-0.5 bg-[#050035]"></div>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-3">
              <a
                href="/"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                Accueil
              </a>
              <a
                href="/#services"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                Services
              </a>
              <a
                href="/#avantages"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                Avantages
              </a>
              <a
                href="/#a-propos"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                À propos
              </a>
              <a
                href="/#faq"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                FAQ
              </a>
              <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-6 w-fit">
                Simulation Gratuite
              </Button>
            </div>
          </div>
        )}
      </nav>

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
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                value={formData.roofArea}
                onChange={(e) => handleInputChange("roofArea", e.target.value)}
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
                value={formData.roofType}
                onChange={(e) => handleInputChange("roofType", e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Sélectionner</option>
                <option value="flat">Toit plat</option>
                <option value="sloped">Toit incliné</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Consommation électrique (en kWh/an)
              </label>
              <Input
                type="number"
                placeholder="1500 (optionnel - sera calculé automatiquement)"
                value={formData.consumption}
                onChange={(e) =>
                  handleInputChange("consumption", e.target.value)
                }
                min="1"
                max="100000"
                step="1"
                className="text-sm py-2 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-0.5">
                Optionnel - Si non renseigné, sera calculé à partir du coût
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Coût annuel électricité (million){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="20000"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
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
        onClick={handleGetLocation}
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
