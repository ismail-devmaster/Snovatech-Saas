"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Menu, Loader2, Search } from "lucide-react";
import { ResultsModal } from "@/components/results-modal";
import dynamic from "next/dynamic";

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

export default function SimulationPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(true);

  const handleMapClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const runSimulation = () => {
    setSimulationLoading(true);
    setTimeout(() => {
      setSimulationData({
        panels: 30,
        cost: "20,000 DA",
        roi: "5 years",
        monthlyGeneration: [45, 30, 65, 40, 55, 70, 25],
        yearlyComparison: {
          consumption: [15, 10, 5, 45, 50, 35, 30, 55, 45, 60, 65, 70],
          production: [18, 20, 22, 25, 30, 28, 15, 40, 38, 45, 55, 65],
        },
        location: selectedLocation,
      });
      setResultModalOpen(true);
      setSimulationLoading(false);
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

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="hidden md:block">
            <Button
              className="bg-primary hover:bg-secondary text-white rounded-full px-6"
              onClick={runSimulation}
            >
              Simulation Gratuite
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative px-6 py-6">
        <div className="flex gap-6">
          <div className="w-96 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et prénom
                </label>
                <Input
                  type="text"
                  placeholder="ex. Laichi Chanez"
                  className="w-full bg-white/70 border-gray-200"
                />
              </div>
              <Button
                className="w-full bg-primary hover:bg-secondary text-white rounded-full"
                onClick={runSimulation}
                disabled={simulationLoading}
              >
                {simulationLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Simuler
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ResultsModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        simulationData={simulationData}
        loading={loading}
      />
    </div>
  );
}
