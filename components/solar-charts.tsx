"use client"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Define static data that matches the image
const STATIC_GENERATION_DATA = [
  { name: "Jan", value: 45 },
  { name: "Fév", value: 30 },
  { name: "Mar", value: 65 },
  { name: "Avr", value: 40 },
  { name: "Mai", value: 55 },
  { name: "Jun", value: 70 },
  { name: "Jul", value: 25 },
  { name: "Aoû", value: 35 },
  { name: "Sep", value: 50 },
  { name: "Oct", value: 45 },
  { name: "Nov", value: 40 },
  { name: "Déc", value: 30 },
]

const STATIC_COMPARISON_DATA = [
  { name: "Jan", consommation: 15, vente: 18 },
  { name: "Fév", consommation: 10, vente: 20 },
  { name: "Mar", consommation: 5, vente: 22 },
  { name: "Avr", consommation: 45, vente: 25 },
  { name: "Mai", consommation: 50, vente: 30 },
  { name: "Jun", consommation: 35, vente: 28 },
  { name: "Jul", consommation: 30, vente: 15 },
  { name: "Aoû", consommation: 55, vente: 40 },
  { name: "Sep", consommation: 45, vente: 38 },
  { name: "Oct", consommation: 60, vente: 45 },
  { name: "Nov", consommation: 65, vente: 55 },
  { name: "Déc", consommation: 70, vente: 65 },
]

interface SolarChartsProps {
  monthlyGeneration?: number[]
  yearlyComparison?: {
    consumption: number[]
    production: number[]
  }
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
        <p className="text-xs font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value} kWh
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SolarCharts({ monthlyGeneration, yearlyComparison }: SolarChartsProps) {
  // Format data for bar chart - use provided data or fallback to static data
  const generationData = monthlyGeneration
    ? monthlyGeneration.map((value, index) => ({
        name: STATIC_GENERATION_DATA[index].name,
        value,
      }))
    : STATIC_GENERATION_DATA

  // Format data for line chart - use provided data or fallback to static data
  const comparisonData = yearlyComparison
    ? STATIC_COMPARISON_DATA.map((item, index) => ({
        name: item.name,
        consommation: yearlyComparison.consumption[index] || 0,
        vente: yearlyComparison.production[index] || 0,
      }))
    : STATIC_COMPARISON_DATA

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Generation Chart */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Génération électrique</h3>
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={generationData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFAA00" />
                  <stop offset="100%" stopColor="#FFDD99" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Production" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Aperçu général</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-accent mr-1"></span>
              <span className="text-xs">Consommation</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
              <span className="text-xs">Vente</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="consommation"
                name="Consommation"
                stroke="#FFAA00"
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
  )
}
