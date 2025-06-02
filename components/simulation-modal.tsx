"use client";
import { useState, useEffect } from "react";
import { X, ChevronLeft } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleMapComponent from "./google-map";
import { SolarCharts } from "./solar-charts";

interface SimulationModalProps {
  open: boolean;
  onClose: () => void;
}

export function SimulationModal({ open, onClose }: SimulationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [roofArea, setRoofArea] = useState("");
  const [roofType, setRoofType] = useState("");
  const [consumption, setConsumption] = useState("");
  const [cost, setCost] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setSimulationData(null);
      setLoading(false);
      setSelectedLocation(null);
    }
  }, [open]);

  const handleSelectLocation = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  // Simulate API call for solar panel energy prediction
  const runSimulation = () => {
    if (!selectedLocation) {
      alert("Veuillez sélectionner un emplacement sur la carte");
      return;
    }

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Generate dynamic simulation data based on location and form inputs
      const panelCount =
        Math.floor((Number.parseFloat(roofArea) * 3) / 10) || 30;
      const installationCost = panelCount * 80000;
      const roiYears = Math.ceil(
        installationCost / (Number.parseFloat(cost) || 20000)
      );

      // Generate random but realistic monthly data
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

      setSimulationData({
        panels: panelCount,
        cost: `${(installationCost / 1000000).toFixed(1)} ${
          installationCost >= 1000000 ? "million" : ""
        } DA`,
        roi: `${roiYears} ans`,
        monthlyGeneration: generateMonthlyData(),
        yearlyComparison: {
          consumption: Array.from({ length: 12 }, () =>
            Math.floor(15 + Math.random() * 30)
          ),
          production: Array.from({ length: 12 }, () =>
            Math.floor(10 + Math.random() * 30)
          ),
        },
        location: selectedLocation,
      });
      setLoading(false);
      setStep(2); // Move to results step
    }, 2000);
  };

  return (
    <Modal open={open} onClose={onClose} className="w-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">
            Simulation Solaire
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Map with Form */}
        {step === 1 && (
          <div className="flex flex-col md:flex-row">
            {/* Form on the left */}
            <div className="md:w-1/3 p-6 border-r">
              <h3 className="text-lg font-bold text-primary mb-4">
                Informations de base
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom et prénom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="ex. Laichi Chanez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roofArea"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Surface de votre toiture (en m²){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="roofArea"
                    type="text"
                    placeholder="ex. 120m²"
                    value={roofArea}
                    onChange={(e) => setRoofArea(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roofType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type de toiture <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="roofType"
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionner</option>
                    <option value="flat">Toit plat</option>
                    <option value="sloped">Toit incliné</option>
                    <option value="metal">Toit métallique</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="consumption"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Consommation électrique (en kWh/an){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="consumption"
                    type="text"
                    placeholder="ex. 1 500 kWh/an"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous pouvez trouver cette info sur votre facture
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="cost"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût annuel électricité (da){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="cost"
                    type="text"
                    placeholder="ex. 20 000 DA"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous pouvez trouver cette info sur votre facture
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={runSimulation}
                    className="w-full bg-primary hover:bg-secondary text-white"
                    disabled={!selectedLocation}
                  >
                    Simuler
                  </Button>
                </div>

                {selectedLocation && (
                  <div className="text-xs text-green-600 mt-2">
                    ✓ Emplacement sélectionné: {selectedLocation.lat.toFixed(4)}
                    , {selectedLocation.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Map on the right */}
            <div className="md:w-2/3 h-[600px] relative">
              <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-md max-w-xs">
                <div className="flex items-center">
                  <div className="bg-accent rounded-full w-2 h-2 mr-2"></div>
                  <p className="text-sm font-medium">
                    Sélectionnez votre emplacement
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Cliquez sur la carte pour indiquer l'emplacement exact de
                  votre installation
                </p>
              </div>
              <GoogleMapComponent onSelectLocation={handleSelectLocation} />
            </div>
          </div>
        )}

        {/* Step 2: Simulation Results with Dynamic Charts */}
        {step === 2 && (
          <div>
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-primary font-medium">
                  Calcul de votre simulation en cours...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Nous analysons les données solaires de votre région
                </p>
              </div>
            ) : (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Résultats de votre simulation
                </h2>

                {/* Key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1 flex items-center">
                      <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                      Nombre de panneaux
                    </div>
                    <div className="text-3xl font-bold text-accent">
                      {simulationData?.panels}
                    </div>
                    <div className="text-xs text-gray-500">
                      Nécessaire pour couvrir votre consommation
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1 flex items-center">
                      <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                      Coût de l'installation
                    </div>
                    <div className="text-3xl font-bold text-accent">
                      {simulationData?.cost}
                    </div>
                    <div className="text-xs text-gray-500">
                      Investissement pour votre transition énergétique
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1 flex items-center">
                      <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                      Retour sur investissement
                    </div>
                    <div className="text-3xl font-bold text-accent">
                      {simulationData?.roi}
                    </div>
                    <div className="text-xs text-gray-500">
                      suivi de 20 ans d'électricité gratuite
                    </div>
                  </div>
                </div>

                {/* Dynamic Charts */}
                {simulationData && (
                  <SolarCharts
                    monthlyGeneration={simulationData.monthlyGeneration}
                    yearlyComparison={simulationData.yearlyComparison}
                  />
                )}

                <div className="flex justify-between">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Modifier
                    l'emplacement
                  </Button>
                  <div className="space-x-3">
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      Imprimer
                    </Button>
                    <Button className="bg-primary hover:bg-secondary text-white">
                      Réservez Un Appel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
