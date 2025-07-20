"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowUpRight,
  BarChart3,
  Zap,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TagIcon = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
  >
    <circle cx="10" cy="10.5" r="10" fill="#050035" />
  </svg>
);

const ChartIcon = () => (
  <svg
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[33px] h-[33px]"
  >
    <path
      d="M16.5 22V28.875M16.5 22L24.75 28.875M16.5 22L8.25 28.875M28.875 4.125V15.4C28.875 17.7102 28.875 18.8653 28.4254 19.7477C28.0299 20.5239 27.3989 21.1549 26.6227 21.5504C25.7403 22 24.5852 22 22.275 22H10.725C8.41478 22 7.25968 22 6.37729 21.5504C5.60112 21.1549 4.97008 20.5239 4.5746 19.7477C4.125 18.8653 4.125 17.7102 4.125 15.4V4.125M11 12.375V16.5M16.5 9.625V16.5M22 15.125V16.5M30.25 4.125H2.75"
      stroke="#F3F2F5"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="34"
    height="33"
    viewBox="0 0 34 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[33px] h-[33px]"
  >
    <path
      d="M18.3749 2.75L6.12843 17.4458C5.64882 18.0213 5.40902 18.3091 5.40535 18.5521C5.40217 18.7634 5.49631 18.9644 5.66066 19.0972C5.84971 19.25 6.2243 19.25 6.97348 19.25H16.9999L15.6249 30.25L27.8714 15.5542C28.351 14.9787 28.5908 14.6909 28.5945 14.4479C28.5977 14.2366 28.5036 14.0356 28.3392 13.9028C28.1502 13.75 27.7756 13.75 27.0264 13.75H16.9999L18.3749 2.75Z"
      stroke="#F3F2F5"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");

  // Add state for form fields and loading
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

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

  useEffect(() => {
    const sectionIds = ["accueil", "services", "avantages", "a-propos", "faq"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // adjust offset for navbar height
      let currentSection = sectionIds[0];
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F2F5] font-['Manrope'] scroll-smooth">
      {/* Navigation */}
      <nav
        className="fixed top-4 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 z-50 bg-white rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 shadow-lg border border-gray-200 flex items-center justify-between transition-all"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl sm:text-2xl font-bold text-[#FFAA00]">
            Snova
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#050035]">
            Tech
          </span>
        </div>

        {/* Desktop Navigation - Centered Links */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-4 lg:space-x-8">
          {[
            { id: "accueil", label: "Accueil" },
            { id: "services", label: "Services" },
            { id: "avantages", label: "Avantages" },
            { id: "a-propos", label: "À propos" },
            { id: "faq", label: "FAQ" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`transition-colors px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFAA00] focus:bg-[#FFAA00]/10 ${
                activeSection === item.id
                  ? "text-[#050035] font-bold"
                  : "text-gray-600 hover:text-[#050035]"
              }`}
              tabIndex={0}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              {activeSection === item.id && (
                <span className="inline-block align-middle mr-2 w-2 h-2 rounded-full bg-[#050035]"></span>
              )}
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Simulation Button - Right */}
        <div className="hidden md:flex items-center ml-4 lg:ml-8">
          <Link href="/simulation" passHref legacyBehavior>
            <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg min-w-[48px] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#FFAA00]">
              Simulation Gratuite
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className="w-7 h-7 flex flex-col justify-center space-y-1.5">
            <div className="w-full h-0.5 bg-[#050035]"></div>
            <div className="w-full h-0.5 bg-[#050035]"></div>
            <div className="w-full h-0.5 bg-[#050035]"></div>
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed top-24 left-0 right-0 bg-white z-40 py-6 border-t border-gray-200 shadow-lg animate-fade-in"
          role="menu"
        >
          <div className="flex flex-col space-y-3 px-6">
            {[
              { id: "accueil", label: "Accueil" },
              { id: "services", label: "Services" },
              { id: "avantages", label: "Avantages" },
              { id: "a-propos", label: "À propos" },
              { id: "faq", label: "FAQ" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-gray-600 hover:text-[#050035] transition-colors text-lg py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                role="menuitem"
                tabIndex={0}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link href="/simulation" passHref legacyBehavior>
              <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-6 py-3 w-full min-h-[48px] text-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFAA00]">
                Simulation Gratuite
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="accueil"
        className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 md:px-6 lg:px-12 min-h-[60vh] md:min-h-[700px] lg:min-h-[810px] flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="relative rounded-[32px] sm:rounded-[48px] overflow-visible min-h-[55vh] md:min-h-[600px] lg:min-h-[720px] flex flex-col">
            {/* Video background */}
            <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] overflow-hidden">
              <video
                ref={(el) => {
                  if (el) {
                    el.play().catch((error) => {
                      console.log("Autoplay failed:", error);
                    });
                  }
                }}
                autoPlay
                loop
                playsInline
                muted
                className="w-full h-full object-cover"
                poster="/images/hero.png"
                onLoadedData={() => {
                  console.log("Video loaded successfully");
                }}
                onError={(e) => {
                  console.error("Video error:", e);
                }}
                tabIndex={-1}
                aria-label="Présentation vidéo de SnovaTech"
              >
                <source src="/videos/Snoatech.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Play and Pause Buttons */}
              <div className="absolute top-4 right-4 z-20 flex gap-3">
                {/* Play Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const video =
                      e.currentTarget.parentElement?.parentElement?.querySelector(
                        "video"
                      );
                    if (video) {
                      video.play();
                    }
                  }}
                  className="bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-full p-3 sm:p-4 transition-all duration-300 border-2 border-white/40 hover:border-white/60 hover:scale-110 shadow-lg hover:shadow-xl min-w-[48px] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                  aria-label="Lire la vidéo"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                {/* Pause Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const video =
                      e.currentTarget.parentElement?.parentElement?.querySelector(
                        "video"
                      );
                    if (video) {
                      video.pause();
                    }
                  }}
                  className="bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-full p-3 sm:p-4 transition-all duration-300 border-2 border-white/40 hover:border-white/60 hover:scale-110 shadow-lg hover:shadow-xl min-w-[48px] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                  aria-label="Mettre la vidéo en pause"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h3v16H6V4zm9 0h3v16h-3V4z" />
                  </svg>
                </button>
              </div>

              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40 rounded-[32px] sm:rounded-[48px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="services"
        className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-10 flex flex-col"
      >
        <div className="max-w-[1304px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16 w-full">
            {/* Left Section - Tag at top, Picture at bottom */}
            <div className="flex flex-col justify-between w-full lg:w-auto lg:min-w-[320px] xl:min-w-[450px] items-start mb-8 lg:mb-0">
              {/* Tag */}
              <div className="flex items-center gap-3 mb-6 lg:mb-10">
                <TagIcon />
                <h2 className="text-[#35305b] font-manrope text-xl sm:text-2xl font-semibold leading-tight">
                  Notre mission
                </h2>
              </div>
              {/* Picture */}
              <div className="flex justify-end items-center w-full h-[240px] sm:h-[280px] md:h-[320px] rounded-[24px] sm:rounded-[32px] border-2 border-[#050035] bg-[#050035] relative overflow-hidden self-end mt-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/506437525aa9c7fa0ee03dd633d807cc1dace1c4?width=1457"
                  alt="Mission image"
                  className="w-full h-full object-cover absolute left-0 bottom-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Section - Main Content and Feature Cards */}
            <div className="flex flex-col items-start gap-12 lg:gap-20 w-full lg:w-[771px]">
              <div className="flex flex-col items-start gap-10 lg:gap-[72px] w-full">
                {/* Main Content */}
                <div className="flex flex-col items-start gap-4 w-full mt-2 lg:mt-3">
                  <h3 className="w-full text-[#050035] font-manrope text-2xl sm:text-3xl lg:text-[40px] font-normal leading-tight">
                    Aider les entreprises à passer à l'énergie solaire avec des
                    solutions sur mesure, adaptées à leurs besoins.
                  </h3>
                  <p className="w-full text-[#050035] font-manrope text-xl sm:text-2xl lg:text-[32px] font-normal leading-snug">
                    Et avec l'appui de l'IA, offrir une simulation claire des
                    performances et des coûts avant tout engagement.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-[2px] sm:h-[3px] opacity-40 bg-[#050035]" />

                {/* Feature Cards */}
                <div className="flex flex-col sm:flex-row items-stretch gap-6 lg:gap-12 w-full">
                  {/* Transparence Card */}
                  <div
                    className="flex flex-col items-start gap-4 flex-1 bg-white rounded-xl shadow-md p-6 min-h-[180px] focus-within:ring-2 focus-within:ring-[#FFAA00]"
                    tabIndex={0}
                    aria-label="Transparence"
                  >
                    <div className="flex p-3 sm:p-[17px] items-center justify-center rounded-full bg-[#050035] mb-2">
                      <ChartIcon />
                    </div>
                    <h4 className="text-[#050035] font-manrope text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight">
                      Transparence
                    </h4>
                    <p className="w-full text-[#050035] font-manrope text-lg sm:text-xl font-normal leading-tight">
                      Simulation claire, détaillée, et estimation précise des
                      coûts et des bénéfices avant toute décision
                      d'investissement
                    </p>
                  </div>

                  {/* Sur-mesure Card */}
                  <div
                    className="flex flex-col items-start gap-4 flex-1 bg-white rounded-xl shadow-md p-6 min-h-[180px] focus-within:ring-2 focus-within:ring-[#FFAA00]"
                    tabIndex={0}
                    aria-label="Sur-mesure"
                  >
                    <div className="flex p-3 sm:p-[17px] items-center justify-center rounded-full bg-[#050035] mb-2">
                      <ZapIcon />
                    </div>
                    <h4 className="text-[#050035] font-manrope text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight">
                      Sur-mesure
                    </h4>
                    <p className="w-full text-[#050035] font-manrope text-lg sm:text-xl font-normal leading-tight">
                      Chaque entreprise est unique. On pense à vos besoins
                      spécifiques, vos contraintes techniques et vos objectifs
                      énergétiques.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="avantages"
        className="py-12 sm:py-20 px-4 sm:px-6 md:mx-4 lg:px-10 bg-[#050035] text-white font-manrope rounded-2xl sm:rounded-3xl overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-16">
            {/* "Comment ça marche ?" text with a dot icon */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <h3 className="text-sm sm:text-base font-medium opacity-70">
                Comment ça marche ?
              </h3>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight">
              Un processus Simple,
              <br className="hidden sm:block" />
              pour votre passage au solaire
            </h2>
          </div>

          {/* Grid for the first four cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Card 01 */}
            <div
              className="bg-[#3C3D6D] p-5 sm:p-6 rounded-xl flex flex-col items-start text-left min-h-[160px] focus-within:ring-2 focus-within:ring-[#FFAA00]"
              tabIndex={0}
              aria-label="Simulation gratuite"
            >
              <div className="font-bold text-xl sm:text-2xl mb-2">
                01.
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-4 flex-grow">
                Simulation gratuite
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                De la puissance et le coût approximatif de votre future
                installation solaire.
              </p>
            </div>
            {/* Card 02 */}
            <div
              className="bg-[#3C3D6D] p-5 sm:p-6 rounded-xl flex flex-col items-start text-left min-h-[160px] focus-within:ring-2 focus-within:ring-[#FFAA00]"
              tabIndex={0}
              aria-label="Réservez un appel"
            >
              <div className="font-bold text-xl sm:text-2xl mb-2">
                02.
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-4 flex-grow">
                Réservez un appel
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                Pour une étude personnalisée de votre toiture, ensoleillement et
                besoins.
              </p>
            </div>
            {/* Card 03 */}
            <div
              className="bg-[#3C3D6D] p-5 sm:p-6 rounded-xl flex flex-col items-start text-left min-h-[160px] focus-within:ring-2 focus-within:ring-[#FFAA00]"
              tabIndex={0}
              aria-label="Simulation sur mesure"
            >
              <div className="font-bold text-xl sm:text-2xl mb-2">
                03.
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-4 flex-grow">
                Simulation sur mesure
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                Recevez une simulation complète et précise de votre système
                solaire avant l'installation.
              </p>
            </div>
            {/* Card 04 */}
            <div
              className="bg-[#3C3D6D] p-5 sm:p-6 rounded-xl flex flex-col items-start text-left min-h-[160px] focus-within:ring-2 focus-within:ring-[#FFAA00]"
              tabIndex={0}
              aria-label="Installation clé en main"
            >
              <div className="font-bold text-xl sm:text-2xl mb-2">
                04.
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-4 flex-grow">
                Installation clé en main
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                On s'occupe de l'installation de votre système solaire avec nos
                partenaires.
              </p>
            </div>
          </div>

          {/* Card 05 - Special layout */}
          <div
            className="bg-[#3C3D6D] p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 focus-within:ring-2 focus-within:ring-[#FFAA00]"
            tabIndex={0}
            aria-label="Suivi et maintenance"
          >
            <div className="flex items-center gap-4">
              <div className="font-bold text-xl sm:text-2xl">
                05.
              </div>
              <h3 className="font-bold text-xl sm:text-2xl">
                Suivi et maintenance
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300 sm:text-right sm:max-w-md pt-2 sm:pt-0">
              On vous propose un suivi et entretien de votre installation
              solaire afin de préserver son efficacité le plus longtemps
              possible
            </p>
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="a-propos" className="py-10 sm:py-16">
        <div></div>
      </section>

      {/* FAQ and CTA Section */}
      <section
        id="faq"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-6xl mx-auto w-full">
          {/* FAQ Section */}
          <div className="mb-20 sm:mb-32">
            <div className="text-center mb-12 sm:mb-20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-5 h-5 bg-[#050035] rounded-full"></div>
                <span className="text-[#35305B] text-xl sm:text-2xl font-bold">
                  On répond à vos questions
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#050035] text-center max-w-2xl mx-auto leading-tight">
                Avant de vous lancer, voici ce que vous devez savoir
              </h2>
            </div>

            <Accordion
              type="multiple"
              className="w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
            >
              {[
                {
                  value: "item-1",
                  question: "À qui s'adresse votre service ?",
                  answer:
                    "Aux entreprises et grands consommateurs d'énergie souhaitant réduire leur facture énergétique et s'engager dans la transition écologique.",
                },
                {
                  value: "item-2",
                  question: "Pourquoi devrais-je passer au solaire ?",
                  answer:
                    "Le solaire permet de réduire vos factures d'énergie, de stabiliser vos coûts à long terme et de contribuer activement à la transition écologique. C'est aussi un levier d'image positive pour votre entreprise.",
                },
                {
                  value: "item-3",
                  question:
                    "Est-ce qu'il existe des aides ou subventions de l'État ?",
                  answer:
                    "Oui. L'État algérien propose des exonérations, des procédures simplifiées, un prix d'achat garanti de l'électricité solaire, et des aides pour les PME locales. On vous aide à en bénéficier.",
                },
                {
                  value: "item-4",
                  question: "Que propose la simulation personnalisée avec IA ?",
                  answer:
                    "Elle analyse votre site, vos besoins et vos contraintes pour vous fournir un projet sur mesure, avec données techniques précises, production estimée, et coûts détaillés.",
                },
                {
                  value: "item-5",
                  question:
                    "Est-ce que vous installez les panneaux solaires vous-mêmes ?",
                  answer:
                    "Nous travaillons en partenariat avec des installateurs certifiés. Notre rôle est de vous accompagner avec une solution sur mesure et de vous orienter vers les bons professionnels.",
                },
                {
                  value: "item-6",
                  question:
                    "Est-ce que je peux vous contacter pour en discuter ?",
                  answer:
                    "Bien sûr ! Notre équipe est disponible pour répondre à vos questions et vous accompagner dans votre projet.",
                },
              ].map((item, idx) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className={`border-b border-[#050035]/40 ${
                    idx === 5 ? "border-none" : ""
                  }`}
                >
                  <AccordionTrigger className="px-6 sm:px-12 py-6 sm:py-8 text-lg sm:text-2xl font-bold text-[#050035] hover:no-underline text-left focus:outline-none focus:ring-2 focus:ring-[#FFAA00]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 sm:px-12 pb-6 sm:pb-8 text-base sm:text-xl text-[#5F5C7D] leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Final CTA Section */}
          <div
            id="cta"
            className="bg-[#050035] rounded-3xl sm:rounded-[48px] p-8 sm:p-16 lg:p-20 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
          >
            <Modal
              open={isBookingOpen}
              onClose={() => {
                setIsBookingOpen(false);
                setBookingSuccess(false);
              }}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
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
                    className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#050035] hover:bg-[#FFAA00] hover:text-white text-2xl font-bold shadow-lg border-2 border-[#FFAA00] focus:outline-none transition-all z-10"
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
                        We’ll contact you soon.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center mb-6 text-center">
                        <img
                          src="/images/logo.svg"
                          alt="SnovaTech Logo"
                          className="w-16 h-16 mb-2 drop-shadow-xl modal-logo-glow"
                        />
                        <h2 className="text-3xl font-extrabold text-[#FFAA00] tracking-tight mb-1">
                          Réservez un appel
                        </h2>
                        <p className="text-lg text-white/80">
                          Schedule your free consultation with our team.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Label htmlFor="booking-name" className="sr-only">
                            Name
                          </Label>
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFAA00] pointer-events-none">
                            <User className="w-5 h-5" />
                          </span>
                          <Input
                            id="booking-name"
                            type="text"
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            required
                            placeholder="Your name"
                            className="pl-10 py-3 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
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
                          <Label htmlFor="booking-email" className="sr-only">
                            Email
                          </Label>
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFAA00] pointer-events-none">
                            <Mail className="w-5 h-5" />
                          </span>
                          <Input
                            id="booking-email"
                            type="email"
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                            required
                            placeholder="Your email"
                            className="pl-10 py-3 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
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
                          <Label htmlFor="booking-phone" className="sr-only">
                            Phone
                          </Label>
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFAA00] pointer-events-none">
                            <Phone className="w-5 h-5" />
                          </span>
                          <Input
                            id="booking-phone"
                            type="tel"
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            required
                            placeholder="Your phone number"
                            className="pl-10 py-3 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
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
                          <Label htmlFor="booking-date" className="sr-only">
                            Preferred Date/Time
                          </Label>
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFAA00] pointer-events-none">
                            <Calendar className="w-5 h-5" />
                          </span>
                          <Input
                            id="booking-date"
                            type="datetime-local"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            required
                            className="pl-10 py-3 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
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
                          <Label
                            htmlFor="booking-message"
                            className="sr-only"
                          >
                            Message
                          </Label>
                          <span className="absolute left-3 top-5 text-[#FFAA00] pointer-events-none">
                            <MessageSquare className="w-5 h-5" />
                          </span>
                          <Textarea
                            id="booking-message"
                            value={bookingMessage}
                            onChange={(e) => setBookingMessage(e.target.value)}
                            placeholder="Your message (optional)"
                            className="pl-10 py-3 bg-transparent border border-white text-white placeholder:text-white/60 focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00] focus:shadow-lg transition-all"
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
                        {bookingSending ? "Envoi..." : "Réservez un appel"}
                      </Button>
                    </>
                  )}
                </form>
              </div>
            </Modal>
            <div className="relative z-10 max-w-3xl lg:max-w-5xl w-full text-center lg:text-left">
              <div className="mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                  Prêt à découvrir votre potentiel solaire ?
                </h2>
                <p className="text-lg sm:text-2xl opacity-80 max-w-2xl sm:max-w-4xl leading-relaxed mx-auto lg:mx-0">
                  Commencez par votre simulation gratuite, puis réservez un
                  appel avec nous pour une étude précise, claire et une
                  simulation sur mesure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full justify-center lg:justify-start">
                <Button
                  className="bg-transparent border-2 sm:border-4 border-white text-white hover:bg-white hover:text-[#050035] rounded-full px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl font-bold transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Réservez un appel
                </Button>
                <Button className="bg-white border-2 sm:border-4 border-white text-[#050035] hover:bg-[#050035] hover:text-white rounded-full px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl font-bold transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#FFAA00]">
                  <Link href="/simulation" passHref legacyBehavior>
                    <span>Simulation gratuite</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Logo in bottom right corner */}
            <div className="absolute -bottom-20 sm:-bottom-32 -right-16 sm:-right-28 z-0 pointer-events-none hidden lg:block">
              <img
                src="/images/logo.svg"
                alt="SnovaTech Logo"
                className="w-48 h-48 sm:w-[26rem] sm:h-[26rem] opacity-80"
                loading="lazy"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-16 sm:-right-26 -bottom-20 sm:-bottom-32 opacity-10 hidden lg:block">
              <div className="w-40 h-40 sm:w-[424px] sm:h-[428px] flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-48 sm:h-48 rounded-full border-2 sm:border-4 border-[#FFAA00] flex items-center justify-center">
                    <div className="text-[#FFAA00] text-3xl sm:text-6xl font-bold">
                      S
                    </div>
                  </div>
                  <div className="absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-2 sm:w-4 h-2 sm:h-4 bg-[#FFAA00] rounded-full"></div>
                  <div className="absolute top-2 sm:top-4 -right-4 sm:-right-8 w-3 sm:w-6 h-3 sm:h-6 bg-[#FF8800] rounded-full"></div>
                  <div className="absolute -bottom-2 sm:-bottom-4 left-4 sm:left-8 w-2.5 sm:w-5 h-2.5 sm:h-5 bg-[#FFAA00] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050035] rounded-t-2xl sm:rounded-t-[32px] pt-16 sm:pt-28 pb-8 sm:pb-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 mb-12 sm:mb-24 text-center md:text-left">
            {/* Company Info */}
            <div className="space-y-6 sm:space-y-8 flex flex-col items-center md:items-start justify-center">
              <div>
                <div className="flex flex-col items-center md:items-start">
                  <img
                    src="/images/logo.svg"
                    alt="SnovaTech Logo"
                    className="w-20 sm:w-24 mb-4"
                    loading="lazy"
                  />
                  <div className="flex items-center space-x-0 mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#FFAA00]">
                      Snova
                    </span>
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      Tech
                    </span>
                  </div>
                  <p className="text-[#FFAA00] text-lg sm:text-xl font-bold">
                    Leading Revolution With Innovation
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav
              className="space-y-3 sm:space-y-4"
              aria-label="Footer navigation"
            >
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">
                Navigation
              </h3>
              <div className="space-y-3">
                {[
                  { href: "#accueil", label: "Accueil" },
                  { href: "#services", label: "Services" },
                  { href: "#avantages", label: "Avantages" },
                  { href: "#a-propos", label: "À propos" },
                  { href: "#faq", label: "FAQ" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-[#CDCCD7] hover:text-white transition-colors text-lg sm:text-xl rounded focus:outline-none focus:ring-2 focus:ring-[#FFAA00] px-1 py-1"
                    tabIndex={0}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Contact Form */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">
                Contactez nous
              </h3>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSending(true);
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: contactName,
                        email: contactEmail,
                        message: contactMessage,
                      }),
                    });
                    if (res.ok) {
                      alert("Message envoyé avec succès !");
                      setContactName("");
                      setContactEmail("");
                      setContactMessage("");
                    } else {
                      alert("Erreur lors de l'envoi du message.");
                    }
                  } catch {
                    alert("Erreur lors de l'envoi du message.");
                  } finally {
                    setSending(false);
                  }
                }}
                aria-label="Formulaire de contact"
              >
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA00] text-base"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  aria-label="Nom et prénom"
                />
                <input
                  type="email"
                  placeholder="Adresse email"
                  className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA00] text-base"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  aria-label="Adresse email"
                />
                <textarea
                  rows={3}
                  placeholder="Votre message..."
                  className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA00] resize-none text-base"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  aria-label="Votre message"
                />
                <Button
                  className="bg-white text-[#050035] hover:bg-gray-100 rounded-md px-5 py-2.5 text-base font-bold min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/20 pt-8 sm:pt-12 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61574140114176"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-[#050035]" />
                </a>
                <a
                  href="https://www.linkedin.com/company/snovatech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA00]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-[#050035]" />
                </a>
              </div>

              {/* Copyright */}
              <p className="text-white/90 text-center text-base sm:text-lg order-last md:order-none">
                © 2025 SnovaTech. All rights reserved.
              </p>

              {/* Contact Info */}
              <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-8 text-sm sm:text-base">
                <div className="flex items-center gap-3 text-white/90">
                  <Mail className="h-5 w-5" />
                  <span>snovatech.innovation@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Phone className="h-5 w-5" />
                  <span>+213 540 70 92 82</span>
                </div>
              </div>
            </div>
             <div className="flex items-center justify-center gap-3 text-white/90 mt-8 text-sm sm:text-base">
                  <MapPin className="h-5 w-5" />
                  <span>Alger, bab ezzouar, usthb, startp hall</span>
                </div>
          </div>
        </div>
      </footer>
    </div>
  );
}