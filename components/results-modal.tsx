"use client"

import { useRef } from "react"
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
  const printRef = useRef<HTMLDivElement>(null)

  if (!open) return null

  // Function to handle printing
  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour imprimer")
      return
    }

    // Generate the HTML content for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Résultats de Simulation SnovaTech</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
            }
            .logo-accent {
              color: #FFAA00;
            }
            .logo-primary {
              color: #050035;
            }
            h1 {
              color: #050035;
              margin-top: 10px;
            }
            .metrics {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              border: 1px solid #eee;
              border-radius: 8px;
              overflow: hidden;
            }
            .metric {
              flex: 1;
              padding: 15px;
              border-right: 1px solid #eee;
            }
            .metric:last-child {
              border-right: none;
            }
            .metric-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #FFAA00;
            }
            .metric-desc {
              font-size: 12px;
              color: #999;
            }
            .note {
              margin-top: 30px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 8px;
              font-size: 14px;
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
          
          <div class="note">
            <p><strong>Note:</strong> Cette simulation est basée sur les informations que vous avez fournies et représente une estimation. Pour une analyse plus précise, veuillez nous contacter pour une étude personnalisée.</p>
            <p>Les graphiques de production et de consommation sont disponibles dans notre application. Connectez-vous à votre compte pour les visualiser.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} SnovaTech. Tous droits réservés.</p>
            <p>Contact: snovatech.innovation@gmail.com | Tél: 0550 55 55 55</p>
            <p>Alger, bab ezzouar, usthb, startp hall</p>
          </div>
        </body>
      </html>
    `

    // Write the content to the new window
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      // Close the window after printing (optional)
      // printWindow.onafterprint = () => printWindow.close()
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="p-6" ref={printRef}>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8 border rounded-lg overflow-hidden">
                <div className="p-6 flex flex-col border-r">
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                    Nombre de panneaux
                  </div>
                  <div className="text-3xl font-bold text-accent">{simulationData?.panels || 30}</div>
                  <div className="text-xs text-gray-500">Nécessaire pour couvrir votre consommation</div>
                </div>

                <div className="p-6 flex flex-col border-r">
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                    Coût de l'installation
                  </div>
                  <div className="text-3xl font-bold text-accent">{simulationData?.cost || "2.5 million DA"}</div>
                  <div className="text-xs text-gray-500">Investissement pour votre transition énergétique</div>
                </div>

                <div className="p-6 flex flex-col">
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

              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                <Button onClick={onClose} variant="outline" className="border-primary text-primary">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Modifier les paramètres
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-primary text-primary" onClick={handlePrint}>
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
