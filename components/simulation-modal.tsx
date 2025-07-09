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
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
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
    cost: number;
    roi: number;
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

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>(
    {}
  );

  // Validation helpers
  const validateBooking = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!bookingName.trim()) errors.name = "Name is required.";
    if (!bookingEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      errors.email = "Valid email required.";
    if (!bookingPhone.match(/^\+?\d{7,}$/))
      errors.phone = "Valid phone required.";
    if (!bookingDate) errors.date = "Date/Time required.";
    return errors;
  };

  // Format monthly generation data for chart
  const generationData = data.monthlyGeneration
    .slice(0, 7)
    .map((value, index) => ({
      name: months[index],
      value,
    }));

  function formatCost(value: number): string {
    const parts: string[] = [];

    if (value >= 10_000_000) {
      const milliard = Math.floor(value / 10_000_000);
      parts.push(`${milliard} milliard${milliard > 1 ? "s" : ""}`);
      value = value % 10_000_000;
    }

    if (value >= 10_000) {
      const million = Math.floor(value / 10_000);
      // Zero-pad sb to 3 digits if sa is present, otherwise no padding
      const sbFormatted =
        parts.length > 0
          ? million.toString().padStart(3, "0")
          : million.toString();
      parts.push(`${sbFormatted} million${million > 1 ? "s" : ""}`);
      value = value % 10_000;
    }

    if (value > 0) {
      parts.push(value.toLocaleString());
    }

    return parts.join(" et ");
  }
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
    <>
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
                  {formatCost(data.cost)}
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
                  {Number(data.roi).toFixed(1)} ans
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
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={() => setIsBookingOpen(true)}
              >
                Reservez Un Appel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingSuccess(false);
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 z-0 animate-gradient-bg bg-gradient-to-br from-[#050035]/80 via-[#FFAA00]/10 to-[#ffd34d]/10 backdrop-blur-xl"
            aria-hidden="true"
          />
          <form
            className="relative w-full max-w-md bg-[#18163a]/90 text-white rounded-3xl shadow-2xl border-4 border-[#FFAA00] px-6 py-10 sm:p-12 animate-fade-in-scale modal-glow"
            style={{ boxShadow: "0 8px 40px 0 rgba(5,0,53,0.25)" }}
            onSubmit={async (e) => {
              e.preventDefault();
              const errors = validateBooking();
              setBookingErrors(errors);
              if (Object.keys(errors).length > 0) return;
              setBookingSending(true);
              try {
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: bookingName,
                    email: bookingEmail,
                    message: `Phone: ${bookingPhone}\nDate/Time: ${bookingDate}\nMessage: ${bookingMessage}`,
                  }),
                });
                if (res.ok) {
                  setBookingSuccess(true);
                  setBookingName("");
                  setBookingEmail("");
                  setBookingPhone("");
                  setBookingDate("");
                  setBookingMessage("");
                  setTimeout(() => setIsBookingOpen(false), 2000);
                } else {
                  setBookingErrors({
                    submit: "Erreur lors de l'envoi de la demande.",
                  });
                }
              } catch {
                setBookingErrors({
                  submit: "Erreur lors de l'envoi de la demande.",
                });
              } finally {
                setBookingSending(false);
              }
            }}
            aria-modal="true"
            role="dialog"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsBookingOpen(false);
                setBookingSuccess(false);
              }}
              className="absolute -top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#050035] hover:bg-[#FFAA00] hover:text-white text-2xl font-bold shadow-lg border-2 border-[#FFAA00] focus:outline-none transition-all z-10"
              aria-label="Close"
              style={{ boxShadow: "0 2px 8px 0 rgba(5,0,53,0.10)" }}
            >
              ×
            </button>
            {/* Success State */}
            {bookingSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in-scale">
                <CheckCircle className="w-20 h-20 text-[#FFAA00] mb-4 animate-bounce-in" />
                <h3 className="text-2xl font-bold text-[#FFAA00] mb-2">
                  Thank you!
                </h3>
                <p className="text-lg text-white/90 text-center">
                  Your booking request has been sent.
                  <br />
                  We'll contact you soon.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <img
                    src="/images/logo.svg"
                    alt="SnovaTech Logo"
                    className="w-16 h-16 mb-2 drop-shadow-xl modal-logo-glow"
                  />
                  <h2 className="text-3xl font-extrabold text-[#FFAA00] text-center tracking-tight mb-1">
                    Réservez un appel
                  </h2>
                  <p className="text-lg text-white/80 text-center">
                    Schedule your free consultation with our team.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="booking-name" className="text-white">
                      Name
                    </Label>
                    <span className="absolute left-3 top-9 text-[#FFAA00] pointer-events-none">
                      <User className="w-5 h-5" />
                    </span>
                    <Input
                      id="booking-name"
                      type="text"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      required
                      placeholder="Your name"
                      className="pl-10 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
                      aria-invalid={!!bookingErrors.name}
                      aria-describedby="booking-name-error"
                    />
                    {bookingErrors?.name && (
                      <span
                        id="booking-name-error"
                        className="text-red-400 text-xs mt-1 block"
                      >
                        {bookingErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Label htmlFor="booking-email" className="text-white">
                      Email
                    </Label>
                    <span className="absolute left-3 top-9 text-[#FFAA00] pointer-events-none">
                      <Mail className="w-5 h-5" />
                    </span>
                    <Input
                      id="booking-email"
                      type="email"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      required
                      placeholder="Your email"
                      className="pl-10 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
                      aria-invalid={!!bookingErrors.email}
                      aria-describedby="booking-email-error"
                    />
                    {bookingErrors?.email && (
                      <span
                        id="booking-email-error"
                        className="text-red-400 text-xs mt-1 block"
                      >
                        {bookingErrors.email}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Label htmlFor="booking-phone" className="text-white">
                      Phone
                    </Label>
                    <span className="absolute left-3 top-9 text-[#FFAA00] pointer-events-none">
                      <Phone className="w-5 h-5" />
                    </span>
                    <Input
                      id="booking-phone"
                      type="tel"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      required
                      placeholder="Your phone number"
                      className="pl-10 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
                      aria-invalid={!!bookingErrors.phone}
                      aria-describedby="booking-phone-error"
                    />
                    {bookingErrors?.phone && (
                      <span
                        id="booking-phone-error"
                        className="text-red-400 text-xs mt-1 block"
                      >
                        {bookingErrors.phone}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Label htmlFor="booking-date" className="text-white">
                      Preferred Date/Time
                    </Label>
                    <span className="absolute left-3 top-9 text-[#FFAA00] pointer-events-none">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <Input
                      id="booking-date"
                      type="datetime-local"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="pl-10 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
                      aria-invalid={!!bookingErrors.date}
                      aria-describedby="booking-date-error"
                    />
                    {bookingErrors?.date && (
                      <span
                        id="booking-date-error"
                        className="text-red-400 text-xs mt-1 block"
                      >
                        {bookingErrors.date}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Label htmlFor="booking-message" className="text-white">
                      Message
                    </Label>
                    <span className="absolute left-3 top-9 text-[#FFAA00] pointer-events-none">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <Textarea
                      id="booking-message"
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      placeholder="Your message (optional)"
                      className="pl-10 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
                    />
                  </div>
                  {bookingErrors.submit && (
                    <span className="text-red-400 text-xs mt-2 block text-center">
                      {bookingErrors.submit}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-[#FFAA00] to-[#ffd34d] text-[#050035] font-bold text-lg py-3 rounded-xl shadow-xl hover:from-[#ffd34d] hover:to-[#FFAA00] transition-all border-none focus:scale-95 active:scale-95 ripple"
                  disabled={bookingSending}
                >
                  {bookingSending ? "Sending..." : "Réservez un appel"}
                </Button>
              </>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
}
