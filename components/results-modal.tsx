"use client"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Printer, Phone } from "lucide-react"
import { SolarCharts } from "./solar-charts"

interface ResultsModalProps {
  open: boolean
  onClose: () => void
  simulationData: any
  loading: boolean
}

export function ResultsModal({ open, onClose, simulationData, loading }: ResultsModalProps) {
  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="p-6">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary font-medium">Calcul de votre simulation en cours...</p>
              <p className="text-sm text-gray-500 mt-2">Nous analysons les données solaires de votre région</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Résultats de votre simulation</h2>

              {/* Key metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col border-r">
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                    Nombre de panneaux
                  </div>
                  <div className="text-3xl font-bold text-accent">{simulationData?.panels || 30}</div>
                  <div className="text-xs text-gray-500">Nécessaire pour couvrir votre consommation</div>
                </div>

                <div className="p-4 flex flex-col border-r">
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                    Coût de l'installation
                  </div>
                  <div className="text-3xl font-bold text-accent">{simulationData?.cost || "2.5 million DA"}</div>
                  <div className="text-xs text-gray-500">Investissement pour votre transition énergétique</div>
                </div>

                <div className="p-4 flex flex-col">
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                    Retour sur investissement
                  </div>
                  <div className="text-3xl font-bold text-accent">{simulationData?.roi || "5 ans"}</div>
                  <div className="text-xs text-gray-500">suivi de 20 ans d'électricité gratuite</div>
                </div>
              </div>

              {/* Dynamic Charts - will fall back to static data if no data provided */}
              <SolarCharts
                monthlyGeneration={simulationData?.monthlyGeneration}
                yearlyComparison={simulationData?.yearlyComparison}
              />

              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                <Button onClick={onClose} variant="outline" className="border-primary text-primary">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Modifier les paramètres
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-primary text-primary">
                    <Printer className="mr-2 h-4 w-4" /> Imprimer
                  </Button>
                  <Button className="bg-primary hover:bg-secondary text-white">
                    <Phone className="mr-2 h-4 w-4" /> Réservez Un Appel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
