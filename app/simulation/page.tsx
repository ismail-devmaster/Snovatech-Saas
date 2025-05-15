"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Menu } from "lucide-react"
import { ResultsModal } from "@/components/results-modal"
import MapPlaceholder from "@/components/map-placeholder"

export default function SimulationPage() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [resultsModalOpen, setResultsModalOpen] = useState(false)
  const [simulationData, setSimulationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [hasInteractedWithMap, setHasInteractedWithMap] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Form state
  const [name, setName] = useState("Test User")
  const [roofArea, setRoofArea] = useState("120")
  const [roofType, setRoofType] = useState("flat")
  const [consumption, setConsumption] = useState("1500")
  const [cost, setCost] = useState("20000")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Set hasInteractedWithMap to true when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      setHasInteractedWithMap(true)
    }
  }, [selectedLocation])

  const handleSelectLocation = (location: { lat: number; lng: number; address?: string }) => {
    setSelectedLocation(location)
    setHasInteractedWithMap(true)

    // On mobile, open the form sidebar after selecting a location
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(true)
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!name.trim()) {
      errors.name = "Le nom est requis"
    }

    if (!roofArea.trim()) {
      errors.roofArea = "La surface de toiture est requise"
    } else if (isNaN(Number(roofArea)) || Number(roofArea) <= 0) {
      errors.roofArea = "Veuillez entrer une valeur numérique positive"
    }

    if (!roofType) {
      errors.roofType = "Le type de toiture est requis"
    }

    if (!consumption.trim()) {
      errors.consumption = "La consommation électrique est requise"
    } else if (isNaN(Number(consumption)) || Number(consumption) <= 0) {
      errors.consumption = "Veuillez entrer une valeur numérique positive"
    }

    if (!cost.trim()) {
      errors.cost = "Le coût annuel est requis"
    } else if (isNaN(Number(cost)) || Number(cost) <= 0) {
      errors.cost = "Veuillez entrer une valeur numérique positive"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const runSimulation = () => {
    if (!selectedLocation && !hasInteractedWithMap) {
      // For testing purposes, we'll create a default location if none is selected
      const defaultLocation = {
        lat: 36.7538,
        lng: 3.0588,
        address: "Emplacement par défaut (Alger)",
      }
      setSelectedLocation(defaultLocation)
      setHasInteractedWithMap(true)
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Generate simulation data
      const panelCount = Math.floor(Number(roofArea) / 4) || 30
      const installationCost = panelCount * 80000
      const roiYears = Math.ceil(installationCost / (Number(cost) || 20000))

      // Generate monthly data
      const monthlyGeneration = [45, 30, 65, 40, 55, 70, 25, 35, 50, 45, 40, 30]

      // Generate comparison data
      const yearlyComparison = {
        consumption: [15, 10, 5, 45, 50, 35, 30, 55, 45, 60, 65, 70],
        production: [18, 20, 22, 25, 30, 28, 15, 40, 38, 45, 55, 65],
      }

      setSimulationData({
        panels: panelCount,
        cost: `${(installationCost / 1000000).toFixed(1)} ${installationCost >= 1000000 ? "million" : ""} DA`,
        roi: `${roiYears} ans`,
        monthlyGeneration,
        yearlyComparison,
        location: selectedLocation,
      })

      setLoading(false)
      setResultsModalOpen(true)

      // Close mobile sidebar after simulation
      if (window.innerWidth < 768) {
        setMobileSidebarOpen(false)
      }
    }, 1500)
  }

  // For testing purposes, you can open the modal directly
  const openModalWithStaticData = () => {
    setSimulationData({
      panels: 30,
      cost: "2.5 million DA",
      roi: "5 ans",
      // These will be ignored as we have static fallbacks
      monthlyGeneration: [45, 30, 65, 40, 55, 70, 25, 35, 50, 45, 40, 30],
      yearlyComparison: {
        consumption: [15, 10, 5, 45, 50, 35, 30, 55, 45, 60, 65, 70],
        production: [18, 20, 22, 25, 30, 28, 15, 40, 38, 45, 55, 65],
      },
    })
    setResultsModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white py-4 px-6 shadow-sm z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="SnovaTech Logo" width={50} height={50} className="mr-2" />
            <h1 className="text-2xl font-bold">
              <span className="text-accent">Snova</span>
              <span className="text-primary">Tech</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              Accueil
            </Link>
            <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              À propos
            </Link>
            <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              Comment
            </Link>
            <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              FAQ
            </Link>
            <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
            <Button
              className="bg-primary hover:bg-secondary text-white rounded-full text-sm px-3 py-1 h-auto"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? "Carte" : "Formulaire"}
            </Button>
          </div>

          {/* Desktop Simulation Button */}
          <div className="hidden md:block">
            <Button
              className="bg-primary hover:bg-secondary text-white rounded-full"
              onClick={openModalWithStaticData} // For testing - direct access to results
            >
              Voir Simulation
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-2">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                À propos
              </Link>
              <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Comment
              </Link>
              <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                FAQ
              </Link>
              <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Contact
              </Link>
              <Button
                className="bg-primary hover:bg-secondary text-white rounded-full w-full"
                onClick={openModalWithStaticData} // For testing - direct access to results
              >
                Voir Simulation
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Full-screen map with form */}
      <div className="flex-1 relative">
        {/* Map Placeholder */}
        <div className="absolute inset-0">
          <MapPlaceholder onSelectLocation={handleSelectLocation} />
        </div>

        {/* Form panel - Desktop (always visible) and Mobile (toggleable) */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-lg z-10 transition-transform duration-300 
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="p-4 h-full overflow-auto">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-primary mb-2">Mode Test</h3>
              <p className="text-sm text-gray-600">
                Les champs du formulaire sont pré-remplis pour vous permettre de tester rapidement la simulation.
                Cliquez sur le bouton "Simuler" pour voir les résultats.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="ex. Laichi Chanez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full ${formErrors.name ? "border-red-500" : ""}`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surface de votre toiture (en m²) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="ex. 120"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className={`w-full ${formErrors.roofArea ? "border-red-500" : ""}`}
                />
                {formErrors.roofArea && <p className="text-red-500 text-xs mt-1">{formErrors.roofArea}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de toiture <span className="text-red-500">*</span>
                </label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  className={`w-full rounded-md border ${formErrors.roofType ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="">Sélectionner</option>
                  <option value="flat">Toit plat</option>
                  <option value="sloped">Toit incliné</option>
                  <option value="metal">Toit métallique</option>
                </select>
                {formErrors.roofType && <p className="text-red-500 text-xs mt-1">{formErrors.roofType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consommation électrique (en kWh/an) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="ex. 1500"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className={`w-full ${formErrors.consumption ? "border-red-500" : ""}`}
                />
                {formErrors.consumption && <p className="text-red-500 text-xs mt-1">{formErrors.consumption}</p>}
                <p className="text-xs text-gray-500 mt-1">Vous pouvez trouver cette info sur votre facture</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coût annuel électricité (da) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="ex. 20000"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className={`w-full ${formErrors.cost ? "border-red-500" : ""}`}
                />
                {formErrors.cost && <p className="text-red-500 text-xs mt-1">{formErrors.cost}</p>}
                <p className="text-xs text-gray-500 mt-1">Vous pouvez trouver cette info sur votre facture</p>
              </div>

              <div className="pt-4">
                <Button onClick={runSimulation} className="w-full bg-primary hover:bg-secondary text-white">
                  Simuler
                </Button>
              </div>

              {selectedLocation && (
                <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded-md">
                  <p className="font-medium">✓ Emplacement sélectionné:</p>
                  <p className="mt-1">
                    Coordonnées: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                  {selectedLocation.address && <p className="mt-1">Adresse: {selectedLocation.address}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile toggle button for map/form - Visible on small screens when sidebar is closed */}
        <div className="md:hidden absolute bottom-4 right-4 z-20">
          {!mobileSidebarOpen && (
            <Button
              onClick={() => setMobileSidebarOpen(true)}
              className="bg-primary hover:bg-secondary text-white rounded-full shadow-lg"
            >
              Formulaire
            </Button>
          )}
        </div>

        {/* Information tooltip */}
        {showTooltip && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md max-w-xs z-20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium mb-1">Mode Test: Vérifiez les graphiques</p>
                <p className="text-xs text-gray-600">
                  Cette version permet de tester les graphiques et la simulation sans carte fonctionnelle. Cliquez sur
                  "Simuler" pour voir les résultats.
                </p>
              </div>
              <button onClick={() => setShowTooltip(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Modal */}
      <ResultsModal
        open={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        simulationData={simulationData}
        loading={loading}
      />
    </div>
  )
}
