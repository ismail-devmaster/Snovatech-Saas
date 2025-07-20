// app/simulation/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  X,
  MapPin,
  Calculator,
  AlertCircle,
  Info,
  Menu,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimulationResults } from "@/components/simulation-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";

/* ---------- TYPES ---------- */
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

/* ---------- CONSTANTS ---------- */
const PANEL_EFFICIENCY = 0.25; // 4 m² per panel
const PANEL_COST_DA = 80000;
const FLAT_ROOF_MULTIPLIER = 3;
const SLOPED_ROOF_MULTIPLIER = 3.4;
const PANEL_PRODUCTION_KWH = 1150;
const INSTALLATION_COST_PER_PANEL = 36000;

/* ---------- DYNAMIC MAP ---------- */
const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-sky-200 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mb-4" />
        <p className="text-orange-600 font-medium text-sm sm:text-base">
          Chargement de la carte…
        </p>
      </div>
    </div>
  ),
});

/* ---------- MAIN PAGE ---------- */
export default function SimulationPage() {
  /* ---- STATE ---- */
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
  const [isFormMinimized, setIsFormMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    roofArea: "",
    roofType: "",
    consumption: "",
    cost: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [toiturePanels, setToiturePanels] = useState<number | null>(null);

  /* ---- HELPERS ---- */
  const checkViewport = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile && window.innerWidth < 640) setIsFormMinimized(true);
  }, []);

  useEffect(() => {
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, [checkViewport]);

  useEffect(() => {
    if (formData.roofType === "flat") setToiturePanels(FLAT_ROOF_MULTIPLIER);
    else if (formData.roofType === "sloped")
      setToiturePanels(SLOPED_ROOF_MULTIPLIER);
    else setToiturePanels(null);
  }, [formData.roofType]);

  const calculateConsumption = useCallback(
    (cost: number) => (cost * 10000) / 4179,
    []
  );

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Le nom est requis";
    const roofAreaNum = parseFloat(formData.roofArea);
    if (!formData.roofArea || isNaN(roofAreaNum) || roofAreaNum <= 0)
      errors.roofArea = "Surface de toiture invalide";
    else if (roofAreaNum > 10000) errors.roofArea = "Surface trop importante";
    if (!formData.roofType) errors.roofType = "Type de toiture requis";
    if (formData.consumption) {
      const c = parseFloat(formData.consumption);
      if (isNaN(c) || c <= 0) errors.consumption = "Consommation invalide";
    }
    const costNum = parseFloat(formData.cost);
    if (!formData.cost || isNaN(costNum) || costNum <= 0)
      errors.cost = "Coût annuel invalide";
    if (!selectedLocation) errors.location = "Emplacement requis";
    return errors;
  }, [formData, selectedLocation]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field])
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [formErrors]
  );

  const handleMapClick = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      if (formErrors.location)
        setFormErrors((prev) => ({ ...prev, location: undefined }));
    },
    [formErrors.location]
  );

  const calculateSolarPotential = useCallback(
    (
      roofArea: number,
      roofType: string,
      consumption: number,
      costAnnuel: number
    ): SimulationData => {
      const multiplier =
        roofType === "flat" ? FLAT_ROOF_MULTIPLIER : SLOPED_ROOF_MULTIPLIER;
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
        const factors = [
          0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5,
        ];
        return factors.map((f) =>
          Math.round((annualProduction / 12) * f * (0.9 + Math.random() * 0.2))
        );
      };

      const generateYearlyComparison = () => ({
        consumption: Array.from({ length: 12 }, () =>
          Math.round((consumption / 12) * (0.9 + Math.random() * 0.2))
        ),
        production: Array.from({ length: 12 }, () =>
          Math.round((annualProduction / 12) * (0.8 + Math.random() * 0.4))
        ),
      });

      return {
        panels: panelCount,
        production: annualProduction,
        cost: installationCost,
        roi,
        monthlyGeneration: generateMonthlyData(),
        yearlyComparison: generateYearlyComparison(),
        location: selectedLocation!,
        savings: annualSavings,
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      };
    },
    [selectedLocation]
  );

  const handleSimulate = useCallback(async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors)[0]);
      return;
    }
    setIsCalculating(true);
    await new Promise((r) => setTimeout(r, 1500));
    let consumption: number;
    const costNum = parseFloat(formData.cost);
    if (formData.consumption && formData.consumption.trim()) {
      consumption = parseFloat(formData.consumption);
    } else {
      consumption = calculateConsumption(costNum);
    }
    const sim = calculateSolarPotential(
      parseFloat(formData.roofArea),
      formData.roofType,
      consumption,
      costNum
    );
    setSimulationData(sim);
    setShowResults(true);
    setIsCalculating(false);
  }, [formData, validateForm, calculateSolarPotential, calculateConsumption]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setSelectedLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => {
        let msg = "Impossible d’obtenir votre position";
        if (err.code === err.PERMISSION_DENIED)
          msg = "Autorisez la localisation dans les paramètres";
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const handleCloseResults = useCallback(() => setShowResults(false), []);
  const toggleFormVisibility = useCallback(
    () => setIsFormMinimized((prev) => !prev),
    []
  );

  /* ---- MEMO MAP ---- */
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

  /* ---- RENDER ---- */
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Map */}
      <div className="absolute inset-0 z-0">{memoizedMap}</div>
      {/* NAVBAR */}
      <nav
        className={`absolute top-2 z-20 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 pointer-events-auto transition-all duration-300 ${
          isMobile
            ? "left-2 right-2 rounded-2xl px-4 py-3"
            : "left-4 right-4 md:left-8 md:right-8 lg:left-16 lg:right-16 rounded-full px-6 lg:px-8 py-4"
        }`}
      >
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
          >
            <span
              className={`font-bold text-[#FFAA00] ${
                isMobile ? "text-xl" : "text-2xl"
              }`}
            >
              Snova
            </span>
            <span
              className={`font-bold text-[#050035] ${
                isMobile ? "text-xl" : "text-2xl"
              }`}
            >
              Tech
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 xl:space-x-8">
            {["Accueil", "Services", "Avantages", "À propos", "FAQ"].map(
              (t) => (
                <a
                  key={t}
                  href={`/#${t.toLowerCase().replace(/ /g, "-")}`}
                  className="text-gray-600 hover:text-[#050035] transition-colors text-sm xl:text-base"
                >
                  {t}
                </a>
              )
            )}
          </div>

          <div className="hidden lg:flex">
            <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-4 xl:px-6 py-2 text-sm">
              Simulation Gratuite
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-[#050035]" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
            {["Accueil", "Services", "Avantages", "À propos", "FAQ"].map(
              (t) => (
                <a
                  key={t}
                  href={`/#${t.toLowerCase().replace(/ /g, "-")}`}
                  className="block text-gray-600 hover:text-[#050035] py-2 px-2 hover:bg-gray-50 rounded-lg"
                >
                  {t}
                </a>
              )
            )}
            <Button className="w-full mt-2 bg-[#050035] hover:bg-[#050035]/90 text-white rounded-xl px-4 py-2 text-sm">
              Simulation Gratuite
            </Button>
          </div>
        )}
      </nav>
      {/* MOBILE FORM TOGGLE */}
      {isMobile && (
        <button
          onClick={toggleFormVisibility}
          className={`fixed bottom-20 left-4 z-30 bg-[#050035] hover:bg-[#050035]/90 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all duration-300 ${
            isFormMinimized ? "translate-y-0" : "translate-y-2 opacity-75"
          }`}
          aria-label={isFormMinimized ? "Open form" : "Hide form"}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isFormMinimized ? "Ouvrir le formulaire" : "Masquer le formulaire"}
          </span>
          {isFormMinimized ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}
      {/* FORM PANEL */}
      <div
        className={`absolute z-20 bg-white shadow-lg pointer-events-auto transition-all duration-300 ${
          isMobile
            ? `bottom-0 left-0 right-0 rounded-t-3xl ${
                isFormMinimized
                  ? "translate-y-full opacity-0 pointer-events-none"
                  : "translate-y-0 opacity-100"
              } max-h-[75vh]`
            : "top-20 mt-3 left-4 w-80 xl:w-96 max-h-[calc(100vh-6rem)] rounded-2xl"
        } overflow-hidden flex flex-col`}
      >
        {isMobile && !isFormMinimized && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-[#050035]" />
              <h2 className="font-semibold text-[#050035]">
                Simulation Solaire
              </h2>
            </div>
            <button onClick={toggleFormVisibility} aria-label="Close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        <div
          className={`flex-1 overflow-y-auto ${
            isMobile ? "p-4" : "p-5"
          } space-y-4`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Recherchez votre adresse"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="pl-9 rounded-xl border-gray-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-3">
            {[
              ["Nom et prénom", "name", "text", "ex. Laichi Chanez", true],
              [
                "Surface de votre toiture (m²)",
                "roofArea",
                "number",
                "120",
                true,
              ],
            ].map(([label, key, type, placeholder, required]) => (
              <div key={key as string}>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  {label as string}{" "}
                  {required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type={type as string}
                  placeholder={placeholder as string}
                  value={formData[key as keyof FormData]}
                  onChange={(e) =>
                    handleInputChange(key as keyof FormData, e.target.value)
                  }
                  className="rounded-xl border-gray-200 focus:border-orange-500"
                />
              </div>
            ))}

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-sm">
                Type de toiture <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.roofType}
                onChange={(e) => handleInputChange("roofType", e.target.value)}
                className="w-full rounded-xl border-gray-200 focus:border-orange-500 px-3 py-2"
              >
                <option value="">Sélectionner</option>
                <option value="flat">Toit plat</option>
                <option value="sloped">Toit incliné</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-sm">
                Consommation électrique (kWh/an)
              </label>
              <Input
                type="number"
                placeholder="1500 (optionnel)"
                value={formData.consumption}
                onChange={(e) =>
                  handleInputChange("consumption", e.target.value)
                }
                className="rounded-xl border-gray-200 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optionnel – calculé si vide
              </p>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-sm">
                Coût annuel électricité (million){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="20000"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                className="rounded-xl border-gray-200 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white p-4">
          <Button
            onClick={handleSimulate}
            disabled={!selectedLocation || isCalculating}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Calcul…
              </div>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Simuler
              </>
            )}
          </Button>
          {selectedLocation && (
            <p className="text-green-600 text-center mt-2 text-xs">
              ✓ Emplacement sélectionné
            </p>
          )}
        </div>
      </div>
      {/* INFO POPUP */}
      {showInfoPopup &&
        (isMobile ? (
          <div className="absolute top-16 left-2 right-2 z-20 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 shadow-lg border border-orange-200">
            <button
              onClick={() => setShowInfoPopup(false)}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <p className="text-sm font-medium text-gray-800 mb-1">
              💡 Estimation approximative
            </p>
            <p className="text-xs text-gray-600">
              Pour une simulation personnalisée, on s’occupe du reste ensemble !
            </p>
          </div>
        ) : (
          <div className="absolute top-20 mt-3 right-4 z-20 bg-white rounded-xl p-4 shadow-lg max-w-xs xl:max-w-sm border border-orange-200">
            <button
              onClick={() => setShowInfoPopup(false)}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <div className="pr-6">
              <div className="flex items-start space-x-2 mb-2">
                <Info className="w-5 h-5 text-orange-500 mt-0.5" />
                <p className="text-sm font-medium">
                  Cette simulation est une estimation approximative&nbsp;!
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Pour une simulation vraiment personnalisée, on passe à l’étape
                suivante ensemble.
              </p>
            </div>
          </div>
        ))}
      /* LOCATION BUTTON */
      <button
        onClick={handleGetLocation}
        className={`absolute z-20 bg-white shadow-lg hover:bg-gray-100 rounded-full transition-transform transform hover:scale-105 active:scale-95 pointer-events-auto ${
          isMobile ? "bottom-4 right-4 p-4" : "bottom-4 right-4 p-3"
        }`}
        aria-label="Ma position"
      >
        <MapPin
          className={`text-gray-700 ${isMobile ? "w-6 h-6" : "w-5 h-5"}`}
        />
      </button>
      /* RESULTS MODAL */
      {showResults && simulationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseResults}
          />
          <div
            className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full ${
              isMobile ? "max-h-[90vh]" : "max-h-[85vh]"
            } overflow-hidden`}
          >
            <SimulationResults
              data={simulationData}
              onClose={handleCloseResults}
            />
          </div>
        </div>
      )}
      {/* LOADING OVERLAY (mobile) */}
      {isCalculating && isMobile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center max-w-xs mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
            <p className="text-gray-800 font-medium text-center">
              Calcul de votre simulation…
            </p>
            <p className="text-gray-600 text-sm text-center mt-2">
              Analyse de votre toiture et calcul du potentiel solaire
            </p>
          </div>
        </div>
      )}
      {/* SAFE AREA */}
      {isMobile && <div className="h-[env(safe-area-inset-bottom)]" />}
    </div>
  );
}
