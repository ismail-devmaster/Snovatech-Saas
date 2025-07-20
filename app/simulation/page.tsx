"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Search, X, MapPin, Calculator, AlertCircle, Info, Menu, ChevronUp, ChevronDown } from "lucide-react";
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
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-orange-600 font-medium text-sm sm:text-base">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function SimulationPage() {
  // Location and UI state
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [addressSearch, setAddressSearch] = useState("");
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormMinimized, setIsFormMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-minimize form on mobile if viewport is small
      if (window.innerWidth < 640) {
        setIsFormMinimized(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    if (formData.consumption) {
      const consumptionNum = parseFloat(formData.consumption);
      if (isNaN(consumptionNum) || consumptionNum <= 0) {
        errors.consumption = "Veuillez entrer une consommation électrique valide";
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
      const multiplier = roofType === "flat" ? FLAT_ROOF_MULTIPLIER : SLOPED_ROOF_MULTIPLIER;
      const panelCount = Math.floor((roofArea * multiplier) / 10);
      const installationCost = 720 * 50 * panelCount;
      const roi = installationCost / costAnnuel / 10000;
      const annualProduction = panelCount * PANEL_PRODUCTION_KWH;
      const annualSavings = Math.min(
        annualProduction * (costAnnuel / consumption),
        costAnnuel
      );
      const paybackPeriod = installationCost / annualSavings;

      const generateMonthlyData = () => {
        const monthlyFactors = [0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5];
        return monthlyFactors.map((factor) =>
          Math.round((annualProduction / 12) * factor * (0.9 + Math.random() * 0.2))
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
      const errorMessages = Object.values(errors);
      if (errorMessages.length > 0) {
        alert(errorMessages[0]);
      }
      return;
    }

    setIsCalculating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let consumption: number;
      const costNum = parseFloat(formData.cost);

      if (formData.consumption && formData.consumption.trim() !== "") {
        consumption = parseFloat(formData.consumption);
        console.log("User provided consumption:", consumption, "kWh/an");
      } else {
        consumption = calculateConsumption(costNum);
        console.log("Calculated consumption from cost:", {
          cost: costNum,
          calculatedConsumption: consumption,
          formula: `${costNum} * 10000 / 4179 = ${consumption}`,
        });
      }

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
          message = "Accès à la localisation refusé. Veuillez l'autoriser dans les paramètres.";
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

  // Toggle form visibility on mobile
  const toggleFormVisibility = useCallback(() => {
    setIsFormMinimized(!isFormMinimized);
  }, [isFormMinimized]);

  // Memoize the map component
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

      {/* Mobile-First Navigation */}
      <nav className={`absolute top-2 z-20 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 pointer-events-auto transition-all duration-300 ${
        isMobile ? 'left-2 right-2 rounded-2xl px-4 py-3' : 'left-8 right-8 lg:left-16 lg:right-16 rounded-full px-6 lg:px-8 py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo - Responsive sizing */}
          <a href="/" className="flex items-center space-x-0 hover:opacity-80 transition-opacity">
            <span className={`font-bold text-[#FFAA00] ${isMobile ? 'text-xl' : 'text-2xl'}`}>Snova</span>
            <span className={`font-bold text-[#050035] ${isMobile ? 'text-xl' : 'text-2xl'}`}>Tech</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 xl:space-x-8">
            <a href="/" className="text-gray-600 hover:text-[#050035] transition-colors text-sm xl:text-base">
              Accueil
            </a>
            <a href="/#services" className="text-gray-600 hover:text-[#050035] transition-colors text-sm xl:text-base">
              Services
            </a>
            <a href="/#avantages" className="text-gray-600 hover:text-[#050035] transition-colors text-sm xl:text-base">
              Avantages
            </a>
            <a href="/#a-propos" className="text-gray-600 hover:text-[#050035] transition-colors text-sm xl:text-base">
              À propos
            </a>
            <a href="/#faq" className="text-gray-600 hover:text-[#050035] transition-colors text-sm xl:text-base">
              FAQ
            </a>
          </div>

          {/* Desktop Simulation Button */}
          <div className="hidden lg:flex items-center">
            <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-4 xl:px-6 py-2 text-sm">
              Simulation Gratuite
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-[#050035]" />
          </button>
        </div>

        {/* Mobile menu - Enhanced */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-gray-600 hover:text-[#050035] transition-colors py-2 px-2 hover:bg-gray-50 rounded-lg">
                Accueil
              </a>
              <a href="/#services" className="text-gray-600 hover:text-[#050035] transition-colors py-2 px-2 hover:bg-gray-50 rounded-lg">
                Services
              </a>
              <a href="/#avantages" className="text-gray-600 hover:text-[#050035] transition-colors py-2 px-2 hover:bg-gray-50 rounded-lg">
                Avantages
              </a>
              <a href="/#a-propos" className="text-gray-600 hover:text-[#050035] transition-colors py-2 px-2 hover:bg-gray-50 rounded-lg">
                À propos
              </a>
              <a href="/#faq" className="text-gray-600 hover:text-[#050035] transition-colors py-2 px-2 hover:bg-gray-50 rounded-lg">
                FAQ
              </a>
              <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-xl px-4 py-2 mt-2 text-sm">
                Simulation Gratuite
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Form Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleFormVisibility}
          className={`fixed bottom-20 left-4 z-30 bg-[#050035] hover:bg-[#050035]/90 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all duration-300 ${
            isFormMinimized ? 'translate-y-0' : 'translate-y-2 opacity-75'
          }`}
          aria-label={isFormMinimized ? 'Show form' : 'Hide form'}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isFormMinimized ? 'Ouvrir le formulaire' : 'Masquer le formulaire'}
          </span>
          {isFormMinimized ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Responsive Form Panel */}
      <div className={`absolute z-20 bg-white shadow-lg pointer-events-auto transition-all duration-300 ${
        isMobile 
          ? `bottom-0 left-0 right-0 rounded-t-3xl ${
              isFormMinimized 
                ? 'translate-y-full opacity-0 pointer-events-none' 
                : 'translate-y-0 opacity-100'
            } max-h-[75vh]`
          : 'top-20 mt-3 left-4 w-80 xl:w-96 max-h-[calc(100vh-6rem)] rounded-2xl'
      } overflow-hidden flex flex-col`}>
        
        {/* Mobile Form Header */}
        {isMobile && !isFormMinimized && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-[#050035]" />
              <h2 className="font-semibold text-[#050035]">Simulation Solaire</h2>
            </div>
            <button
              onClick={toggleFormVisibility}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close form"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Form Content - Scrollable */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-5'}`}>
          {/* Address Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Recherchez votre adresse"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className={`pl-9 text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                isMobile ? 'py-3 text-base' : 'py-2.5'
              }`}
            />
          </div>

          {/* Form Fields */}
          <div className={`space-y-${isMobile ? '4' : '3'}`}>
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${
                isMobile ? 'text-sm' : 'text-xs'
              }`}>
                Nom et prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="ex. Laichi Chanez"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                  isMobile ? 'py-3 text-base' : 'py-2'
                }`}
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${
                isMobile ? 'text-sm' : 'text-xs'
              }`}>
                Surface de votre toiture (en m²) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="120"
                value={formData.roofArea}
                onChange={(e) => handleInputChange("roofArea", e.target.value)}
                min="1"
                max="10000"
                step="1"
                className={`text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                  isMobile ? 'py-3 text-base' : 'py-2'
                }`}
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${
                isMobile ? 'text-sm' : 'text-xs'
              }`}>
                Type de toiture <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.roofType}
                onChange={(e) => handleInputChange("roofType", e.target.value)}
                className={`w-full text-sm rounded-xl border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  isMobile ? 'py-3 text-base' : 'py-2'
                }`}
              >
                <option value="">Sélectionner</option>
                <option value="flat">Toit plat</option>
                <option value="sloped">Toit incliné</option>
              </select>
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${
                isMobile ? 'text-sm' : 'text-xs'
              }`}>
                Consommation électrique (en kWh/an)
              </label>
              <Input
                type="number"
                placeholder="1500 (optionnel)"
                value={formData.consumption}
                onChange={(e) => handleInputChange("consumption", e.target.value)}
                min="1"
                max="100000"
                step="1"
                className={`text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                  isMobile ? 'py-3 text-base' : 'py-2'
                }`}
              />
              <p className={`text-gray-500 mt-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                Optionnel - Si non renseigné, sera calculé à partir du coût
              </p>
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${
                isMobile ? 'text-sm' : 'text-xs'
              }`}>
                Coût annuel électricité (million) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="20000"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                min="1"
                max="10000000"
                step="1"
                className={`text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                  isMobile ? 'py-3 text-base' : 'py-2'
                }`}
              />
              <p className={`text-gray-500 mt-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                Vous pouvez trouver cette info sur votre facture
              </p>
            </div>
          </div>
        </div>

        {/* Form Footer - Fixed */}
        <div className={`border-t border-gray-100 bg-white ${
          isMobile ? 'p-4 pb-6' : 'p-4'
        } ${isMobile ? 'rounded-t-3xl' : 'rounded-b-2xl'}`}>
          <Button
            onClick={handleSimulate}
            className={`w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              isMobile ? 'py-4 text-base' : 'py-2.5 text-sm'
            }`}
            disabled={!selectedLocation || isCalculating}
          >
            {isCalculating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calcul en cours...
              </div>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Simuler
              </>
            )}
          </Button>

          {selectedLocation && (
            <div className={`text-green-600 mt-3 text-center font-medium ${
              isMobile ? 'text-sm' : 'text-xs'
            }`}>
              ✓ Emplacement sélectionné
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Info Popup - Responsive */}
      {showInfoPopup && !isMobile && (
        <div className="absolute top-20 mt-3 right-4 z-20 bg-white rounded-xl p-4 shadow-lg max-w-xs xl:max-w-sm pointer-events-auto border border-orange-200">
          <button
            onClick={() => setShowInfoPopup(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close info popup"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pr-6">
            <div className="flex items-start space-x-2 mb-2">
              <Info className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-800">
                Cette simulation est là pour vous donner une estimation approximative !
              </p>
            </div>
            <p className="text-sm text-gray-600">
              C'est un bon point de départ, mais rien de précis à ce stade. Pour une simulation vraiment personnalisée, on passe à l'étape suivante ensemble. On s'occupe du reste 😊
            </p>
          </div>
        </div>
      )}

      {/* Mobile Info Banner */}
      {showInfoPopup && isMobile && (
        <div className="absolute top-16 left-2 right-2 z-20 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 shadow-lg pointer-events-auto border border-orange-200">
          <button
            onClick={() => setShowInfoPopup(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close info"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pr-6">
            <p className="text-sm font-medium text-gray-800 mb-1">
              💡 Estimation approximative
            </p>
            <p className="text-xs text-gray-600">
              Pour une simulation personnalisée, on s'occupe du reste ensemble !
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Location Button - Mobile optimized */}
      <button
        className={`absolute z-20 bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 active:scale-95 pointer-events-auto ${
          isMobile 
            ? 'bottom-4 right-4 rounded-2xl p-4' 
            : 'bottom-4 right-4 rounded-full p-3'
        }`}
        aria-label="Ma position"
        onClick={handleGetLocation}
      >
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobile ? "24" : "20"}
            height={isMobile ? "24" : "20"}
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
          {isMobile && (
            <span className="text-sm font-medium text-gray-700">Ma position</span>
          )}
        </div>
      </button>

      {/* Simulation Results Modal - Mobile Enhanced */}
      {showResults && simulationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseResults}
          />
          <div className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden ${
            isMobile ? 'max-h-[90vh]' : 'max-h-[85vh]'
          }`}>
            <SimulationResults data={simulationData} onClose={handleCloseResults} />
          </div>
        </div>
      )}

      {/* Loading Overlay for Mobile */}
      {isCalculating && isMobile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center max-w-xs mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-800 font-medium text-center">Calcul de votre simulation...</p>
            <p className="text-gray-600 text-sm text-center mt-2">
              Analyse de votre toiture et calcul du potentiel solaire
            </p>
          </div>
        </div>
      )}

      {/* Mobile Bottom Safe Area */}
      {isMobile && <div className="h-safe-area-inset-bottom" />}

      {/* Touch-friendly overlay for map interactions */}
      <div className="absolute inset-0 z-10 pointer-events-none" />
    </div>
  );
}