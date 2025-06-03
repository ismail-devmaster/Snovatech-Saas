"use client";

import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  CreditCard,
  ExternalLink,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SimulationResultsProps {
  data: {
    panels: number;
    cost: string;
    roi: string;
    monthlyGeneration: number[];
    yearlyComparison: {
      consumption: number[];
      production: number[];
    };
  };
  onClose: () => void;
}

// Define months in French for the x-axis
const months = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export function SimulationResults({ data, onClose }: SimulationResultsProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Format monthly generation data for chart
  const generationData = data.monthlyGeneration
    .slice(0, 7)
    .map((value, index) => ({
      name: months[index],
      value,
    }));

  // Format yearly comparison data for chart
  const comparisonData = months.map((month, index) => ({
    name: month,
    consommation: data.yearlyComparison.consumption[index] || 0,
    vente: data.yearlyComparison.production[index] || 0,
  }));

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            Résultats de votre simulation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results content */}
        <div className="p-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Number of panels */}
            <div className="bg-white rounded-lg p-5 border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Nombre de panneaux
                </h3>
                <Grid className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {data.panels}
              </div>
              <div className="text-xs text-gray-500">
                Nécessaire pour couvrir votre consommation
              </div>
            </div>

            {/* Installation cost */}
            <div className="bg-white rounded-lg p-5 border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Coût de l'installation
                </h3>
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {data.cost}
              </div>
              <div className="text-xs text-gray-500">
                Investissement pour votre transition énergétique
              </div>
            </div>

            {/* Return on investment */}
            <div className="bg-white rounded-lg p-5 border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Retour sur investissement
                </h3>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {data.roi}
              </div>
              <div className="text-xs text-gray-500">
                suivi de 20 ans d'électricité gratuite
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Generation Chart */}
            <div className="bg-white rounded-lg p-5 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-800">
                  Génération électrique
                </h3>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generationData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#FF8A00" />
                        <stop offset="100%" stopColor="#FFEDCC" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, "dataMax + 10"]}
                      hide
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name="Production"
                      fill="url(#colorGradient)"
                      radius={[10, 10, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white rounded-lg p-5 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-800">
                  Aperçu général
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
                    <span className="text-xs">Consommation</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-slate-800 mr-1"></span>
                    <span className="text-xs">Vente</span>
                  </div>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={comparisonData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, "dataMax + 10"]}
                      hide
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="consommation"
                      name="Consommation"
                      stroke="#FF8A00"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="vente"
                      name="Vente"
                      stroke="#050035"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              Reservez Un Appel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
