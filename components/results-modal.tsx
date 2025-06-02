"use client"

import { useRef } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { SolarCharts } from "./solar-charts"

interface SimulationData {
  panels?: number;
  cost?: string;
  roi?: string;
  monthlyGeneration?: number[];
  yearlyComparison?: {
    consumption: number[];
    production: number[];
  };
}

interface ResultsModalProps {
  open: boolean;
  onClose: () => void;
  simulationData?: SimulationData | null;
  loading: boolean;
}

export function ResultsModal({ open, onClose, simulationData, loading }: ResultsModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!open) return null

  // Function to handle printing
  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour imprimer")
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Résultats de Simulation SnovaTech</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #FFAA00;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .logo-accent { color: #FFAA00; }
            .logo-primary { color: #050035; }
            h1 {
              color: #050035;
              margin: 10px 0;
              font-size: 24px;
            }
            .metrics {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin: 40px 0;
            }
            .metric {
              padding: 25px;
              border: 2px solid #f0f0f0;
              border-radius: 12px;
              text-align: center;
            }
            .metric-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 8px;
              font-weight: 600;
            }
            .metric-value {
              font-size: 32px;
              font-weight: bold;
              color: #FFAA00;
              margin-bottom: 5px;
            }
            .metric-desc {
              font-size: 12px;
              color: #999;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <span class="logo-accent">Snova</span><span class="logo-primary">Tech</span>
            </div>
            <h1>Résultats de votre simulation solaire</h1>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">Nombre de panneaux</div>
              <div class="metric-value">${simulationData?.panels || 30}</div>
              <div class="metric-desc">Nécessaire pour couvrir votre consommation</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Coût de l'installation</div>
              <div class="metric-value">${simulationData?.cost || "2.5 million DA"}</div>
              <div class="metric-desc">Investissement pour votre transition énergétique</div>
            </div>
            
            <div class="metric">
              <div class="metric-label">Retour sur investissement</div>
              <div class="metric-value">${simulationData?.roi || "5 ans"}</div>
              <div class="metric-desc">suivi de 20 ans d'électricité gratuite</div>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} SnovaTech. Tous droits réservés.</p>
            <p>Contact: snovatech.innovation@gmail.com | Tél: 0550 55 55 55</p>
            <p>Alger, bab ezzouar, usthb, startp hall</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.print()
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="w-full">
      <div className="w-full max-w-6xl mx-auto bg-gray-50 min-h-[80vh]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-primary mb-2">Calcul de votre simulation en cours...</h3>
            <p className="text-gray-600">Nous analysons les données solaires de votre région</p>
          </div>
        ) : (
          <div ref={printRef} className="relative min-h-[80vh] flex flex-col">
            {/* Main Content Area */}
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-bold text-primary mb-8">Résultats de votre simulation</h2>

              {/* Key metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Nombre de panneaux</div>
                  <div className="text-3xl font-bold text-accent mb-1">{simulationData?.panels || 30}</div>
                  <div className="text-xs text-gray-500">Nécessaire pour couvrir votre consommation</div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Coût de l'installation</div>
                  <div className="text-3xl font-bold text-accent mb-1">{simulationData?.cost || "2.5 million DA"}</div>
                  <div className="text-xs text-gray-500">Investissement pour votre transition énergétique</div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Retour sur investissement</div>
                  <div className="text-3xl font-bold text-accent mb-1">{simulationData?.roi || "5 ans"}</div>
                  <div className="text-xs text-gray-500">suivi de 20 ans d'électricité gratuite</div>
                </div>
              </div>

              {/* Charts */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <SolarCharts
                  monthlyGeneration={simulationData?.monthlyGeneration}
                  yearlyComparison={simulationData?.yearlyComparison}
                />
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom right */}
            <div className="absolute bottom-8 right-8 flex gap-4">
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg shadow-sm"
                onClick={handlePrint}
              >
                Imprimer
              </Button>
              <Button className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg shadow-sm">
                Réservez Un Appel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
