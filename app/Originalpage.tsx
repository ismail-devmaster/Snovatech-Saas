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
      <nav className="fixed top-4 left-2 right-2 sm:top-8 sm:left-16 sm:right-16 z-50 bg-white rounded-full px-4 sm:px-8 py-4 shadow-lg border border-gray-200">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex items-center space-x-0">
            <span className="text-2xl font-bold text-[#FFAA00]">Snova</span>
            <span className="text-2xl font-bold text-[#050035]">Tech</span>
          </div>

          {/* Desktop Navigation - Centered Links */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <a
              href="#accueil"
              className={`transition-colors ${
                activeSection === "accueil"
                  ? "text-[#050035] font-bold"
                  : "text-gray-600 hover:text-[#050035]"
              }`}
            >
              {activeSection === "accueil" && (
                <span className="inline-block align-middle mr-2 w-2 h-2 rounded-full bg-[#050035]"></span>
              )}
              Accueil
            </a>
            <a
              href="#services"
              className={`transition-colors ${
                activeSection === "services"
                  ? "text-[#050035] font-bold"
                  : "text-gray-600 hover:text-[#050035]"
              }`}
            >
              {activeSection === "services" && (
                <span className="inline-block align-middle mr-2 w-2 h-2 rounded-full bg-[#050035]"></span>
              )}
              Services
            </a>
            <a
              href="#avantages"
              className={`transition-colors ${
                activeSection === "avantages"
                  ? "text-[#050035] font-bold"
                  : "text-gray-600 hover:text-[#050035]"
              }`}
            >
              {activeSection === "avantages" && (
                <span className="inline-block align-middle mr-2 w-2 h-2 rounded-full bg-[#050035]"></span>
              )}
              Avantages
            </a>
            <a
              href="#a-propos"
              className={`transition-colors ${
                activeSection === "a-propos"
                  ? "text-[#050035] font-bold"
                  : "text-gray-600 hover:text-[#050035]"
              }`}
            >
              {activeSection === "a-propos" && (
                <span className="inline-block align-middle mr-2 w-2 h-2 rounded-full bg-[#050035]"></span>
              )}
              À propos
            </a>
            <a
              href="#faq"
              className={`transition-colors ${
                activeSection === "faq"
                  ? "text-[#050035] font-bold"
                  : "text-gray-600 hover:text-[#050035]"
              }`}
            >
              {activeSection === "faq" && (
                <span className="inline-block align-middle mr-2 w-2 h-2 rounded-full bg-[#050035]"></span>
              )}
              FAQ
            </a>
          </div>

          {/* Desktop Simulation Button - Right */}
          <div className="hidden md:flex items-center ml-8">
            <Link href="/simulation" passHref legacyBehavior>
              <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-6">
                Simulation Gratuite
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-[#050035]"></div>
              <div className="w-full h-0.5 bg-[#050035]"></div>
              <div className="w-full h-0.5 bg-[#050035]"></div>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-3">
              <a
                href="#accueil"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                Accueil
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                Services
              </a>
              <a
                href="#avantages"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                Avantages
              </a>
              <a
                href="#a-propos"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                À propos
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-[#050035] transition-colors"
              >
                FAQ
              </a>
              <Link href="/simulation" passHref legacyBehavior>
                <Button className="bg-[#050035] hover:bg-[#050035]/90 text-white rounded-full px-6 w-fit">
                  Simulation Gratuite
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="accueil"
        className="relative pt-32 pb-16 px-2 sm:px-4 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[48px] overflow-visible min-h-[600px] lg:min-h-[810px]">
            {/* Video background */}
            <div className="absolute inset-0 rounded-[48px] overflow-hidden">
              <video
                ref={(el) => {
                  if (el) {
                    // Force play when component mounts
                    el.play().catch((error) => {
                      console.log("Autoplay failed:", error);
                    });
                  }
                }}
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
                poster="https://cdn.builder.io/api/v1/image/assets/TEMP/6796af76b1ca060708c999c9ba9d58d1daee05c0?width=1920"
                onLoadedData={() => {
                  console.log("Video loaded successfully");
                }}
                onError={(e) => {
                  console.error("Video error:", e);
                }}
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
                  className="bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-full p-4 transition-all duration-300 border-2 border-white/40 hover:border-white/60 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Play video"
                >
                  <svg
                    className="w-7 h-7"
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
                  className="bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-full p-4 transition-all duration-300 border-2 border-white/40 hover:border-white/60 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Pause video"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h3v16H6V4zm9 0h3v16h-3V4z" />
                  </svg>
                </button>
              </div>

              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30 rounded-[48px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}

      <section
        id="services"
        className="w-full py-24 lg:py-36 px-2 sm:px-4 lg:px-10"
      >
        <div className="max-w-[1304px] mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20 w-full px-0 sm:px-4 lg:px-20">
            {/* Left Section - Tag at top, Picture at bottom */}
            <div className="flex flex-col justify-between h-auto w-full lg:w-auto lg:min-w-[450px] items-start">
              {/* Tag */}
              <div className="flex items-center gap-3 mb-30 lg:mb-690">
                <TagIcon />
                <h2 className="text-[#35305b] font-manrope text-xl lg:text-2xl font-semibold leading-tight">
                  Notre mission
                </h2>
              </div>
              {/* Picture */}
              <div className="flex justify-end items-center w-full h-[320px] rounded-[32px] border-2 border-[#050035] bg-[#050035] relative overflow-hidden self-end mt-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/506437525aa9c7fa0ee03dd633d807cc1dace1c4?width=1457"
                  alt="Mission image"
                  className="w-[728px] h-[410px] absolute  -bottom-12 object-fill"
                />
              </div>
            </div>

            {/* Right Section - Main Content and Feature Cards */}
            <div className="flex flex-col items-start gap-12 lg:gap-20 w-full lg:w-[771px]">
              <div className="flex flex-col items-start gap-12 lg:gap-[72px] w-full">
                {/* Main Content */}
                <div className="flex flex-col items-start gap-6 w-full mt-2 lg:mt-3">
                  <h3 className="w-full text-[#050035] font-manrope text-2xl lg:text-[40px] font-normal leading-tight">
                    Aider les entreprises à passer à l'énergie solaire avec des
                    solutions sur mesure, adaptées à leurs besoins.
                  </h3>
                  <p className="w-full text-[#050035] font-manrope text-2xl lg:text-[40px] font-normal leading-tight">
                    Et avec l'appui de l'IA, offrir une simulation claire des
                    performances et des coûts avant tout engagement.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-[3px] opacity-40 bg-[#050035]" />

                {/* Feature Cards */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full">
                  {/* Transparence Card */}
                  <div className="flex flex-col items-start gap-8 lg:gap-10 flex-1">
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex p-[17px] items-center justify-center rounded-full bg-[#050035]">
                        <ChartIcon />
                      </div>
                      <h4 className="text-[#050035] font-manrope text-2xl lg:text-[32px] font-bold leading-tight">
                        Transparence
                      </h4>
                    </div>
                    <p className="w-full text-[#050035] font-manrope text-lg lg:text-xl font-normal leading-tight">
                      Simulation claire, détaillée, et estimation précise des
                      coûts et des bénéfices avant toute décision
                      d'investissement
                    </p>
                  </div>

                  {/* Sur-mesure Card */}
                  <div className="flex flex-col items-start gap-8 lg:gap-10 flex-1">
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex p-[17px] items-center justify-center rounded-full bg-[#050035]">
                        <ZapIcon />
                      </div>
                      <h4 className="text-[#050035] font-manrope text-2xl lg:text-[32px] font-bold leading-tight">
                        Sur-mesure
                      </h4>
                    </div>
                    <p className="w-full text-[#050035] font-manrope text-lg lg:text-xl font-normal leading-tight">
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
        className="py-16 px-2 sm:px-4 mx-0 sm:mx-10 lg:px-10 bg-[#050035] text-white font-manrope rounded-3xl overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            {/* "Comment ça marche ?" text with a dot icon */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <h3 className="text-sm font-medium opacity-70">
                Comment ça marche ?
              </h3>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold leading-tight">
              Un processus Simple,
              <br />
              pour votre passage au solaire
            </h2>
          </div>

          {/* Grid for the first four cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Card 01 */}
            <div className="bg-[#3C3D6D] p-6 rounded-xl flex flex-col items-start text-left">
              <div className="font-bold text-xl mb-2">01.</div>
              <h3 className="font-bold text-xl mb-20">Simulation gratuite</h3>
              <p className="text-sm text-gray-300">
                De la puissance et le coût approximatif de votre future
                installation solaire.
              </p>
            </div>
            {/* Card 02 */}
            <div className="bg-[#3C3D6D] p-6 rounded-xl flex flex-col items-start text-left">
              <div className="font-bold text-xl mb-2">02.</div>
              <h3 className="font-bold text-xl mb-20">Réservez un appel</h3>
              <p className="text-sm text-gray-300">
                Pour une étude personnalisée de votre toiture, ensoleillement et
                besoins.
              </p>
            </div>
            {/* Card 03 */}
            <div className="bg-[#3C3D6D] p-6 rounded-xl flex flex-col items-start text-left">
              <div className="font-bold text-xl mb-2">03.</div>
              <h3 className="font-bold text-xl mb-20">Simulation sur mesure</h3>
              <p className="text-sm text-gray-300">
                Recevez une simulation complète et précise de votre système
                solaire avant l'installation.
              </p>
            </div>
            {/* Card 04 */}
            <div className="bg-[#3C3D6D] p-6 rounded-xl flex flex-col items-start text-left">
              <div className="font-bold text-xl mb-2">04.</div>
              <h3 className="font-bold text-xl mb-20">
                Installation clé en main
              </h3>
              <p className="text-sm text-gray-300">
                On s'occupe de l'installation de votre système solaire avec nos
                partenaires.
              </p>
            </div>
          </div>

          {/* Card 05 - Special layout */}
          <div className="bg-[#3C3D6D] p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col items-start text-left">
              <div className="font-bold text-xl mb-2">05.</div>
              <h3 className="font-bold text-xl">Suivi et maintenance</h3>
            </div>
            <p className="text-sm text-gray-300 sm:text-right">
              On vous propose un suivi et entretien de votre installation
              solaire afin de préserver son efficacité le plus longtemps
              possible
            </p>
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="a-propos" className="py-20">
        <div></div>
      </section>

      {/* FAQ and CTA Section */}
      <section id="faq" className="py-32 px-2 sm:px-4 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* FAQ Section */}
          <div className="mb-32">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-5 h-5 bg-[#050035] rounded-full"></div>
                <span className="text-[#35305B] text-2xl font-bold">
                  On répond à vos questions
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#050035] text-center max-w-lg mx-auto leading-tight">
                Avant de vous lancer, voici ce que vous devez savoir
              </h2>
            </div>

            <Accordion
              type="multiple"
              className="w-full bg-white rounded-3xl overflow-hidden shadow-lg"
            >
              <AccordionItem
                value="item-1"
                className="border-b border-[#050035]/40"
              >
                <AccordionTrigger className="px-12 py-10 text-2xl font-bold text-[#050035] hover:no-underline text-left">
                  À qui s'adresse votre service ?
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-8 text-xl text-[#5F5C7D] leading-relaxed">
                  Aux entreprises et grands consommateurs d'énergie souhaitant
                  réduire leur facture énergétique et s'engager dans la
                  transition écologique.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-b border-[#050035]/40"
              >
                <AccordionTrigger className="px-12 py-8 text-2xl font-bold text-[#050035] hover:no-underline text-left">
                  Pourquoi devrais-je passer au solaire ?
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-8 text-xl text-[#5F5C7D] leading-relaxed">
                  Le solaire permet de réduire vos factures d'énergie, de
                  stabiliser vos coûts à long terme et de contribuer activement
                  à la transition écologique. C'est aussi un levier d'image
                  positive pour votre entreprise.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-b border-[#050035]/40"
              >
                <AccordionTrigger className="px-12 py-8 text-2xl font-bold text-[#050035] hover:no-underline text-left">
                  Est-ce qu'il existe des aides ou subventions de l'État ?
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-8 text-xl text-[#5F5C7D] leading-relaxed">
                  Oui. L'État algérien propose des exonérations, des procédures
                  simplifiées, un prix d'achat garanti de l'électricité solaire,
                  et des aides pour les PME locales. On vous aide à en
                  bénéficier.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border-b border-[#050035]/40"
              >
                <AccordionTrigger className="px-12 py-8 text-2xl font-bold text-[#050035] hover:no-underline text-left">
                  Que propose la simulation personnalisée avec IA ?
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-8 text-xl text-[#5F5C7D] leading-relaxed">
                  Elle analyse votre site, vos besoins et vos contraintes pour
                  vous fournir un projet sur mesure, avec données techniques
                  précises, production estimée, et coûts détaillés.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border-b border-[#050035]/40"
              >
                <AccordionTrigger className="px-12 py-8 text-2xl font-bold text-[#050035] hover:no-underline text-left">
                  Est-ce que vous installez les panneaux solaires vous-mêmes ?
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-8 text-xl text-[#5F5C7D] leading-relaxed">
                  Nous travaillons en partenariat avec des installateurs
                  certifiés. Notre rôle est de vous accompagner avec une
                  solution sur mesure et de vous orienter vers les bons
                  professionnels.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-none">
                <AccordionTrigger className="px-12 py-8 text-2xl font-bold text-[#050035] hover:no-underline text-left">
                  Est-ce que je peux vous contacter pour en discuter ?
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-10 text-xl text-[#5F5C7D] leading-relaxed">
                  Bien sûr ! Notre équipe est disponible pour répondre à vos
                  questions et vous accompagner dans votre projet.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Final CTA Section */}
          <div
            id="cta"
            className="bg-[#050035] rounded-[48px] p-6 sm:p-16 lg:p-22 text-white relative overflow-hidden"
          >
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
                        We’ll contact you soon.
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
                          <Label
                            htmlFor="booking-message"
                            className="text-white"
                          >
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
            <div className="relative z-10 max-w-5xl">
              <div className="mb-16">
                <h2 className="text-3xl sm:text-5xl font-bold mb-4 ">
                  Prêt à découvrir votre potentiel solaire ?
                </h2>
                <p className="text-lg sm:text-2xl opacity-80 max-w-4xl leading-relaxed">
                  Commencez par votre simulation gratuite, puis réservez un
                  appel avec nous pour une étude précise, claire et une
                  simulation sur mesure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button
                  className="w-full sm:w-auto bg-transparent border-4 border-white text-white hover:bg-white hover:text-[#050035] rounded-full px-8 py-6 text-lg sm:text-xl font-bold transition-all"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Réservez un appel
                </Button>
                <Button className="w-full sm:w-auto bg-white border-4 border-white text-[#050035] hover:bg-[#050035] hover:text-white rounded-full px-8 py-6 text-lg sm:text-xl font-bold transition-all">
                  <Link href="/simulation" passHref legacyBehavior>
                    <span>Simulation gratuite</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Logo in bottom right corner */}
            <div className="absolute -bottom-32 -right-28 z-20 pointer-events-none">
              <img
                src="/images/logo.svg"
                alt="SnovaTech Logo"
                className="w-[26rem] h-[26rem] opacity-80"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-26 -bottom-32 opacity-10">
              <div className="w-[424px] h-[428px] flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-[#FFAA00] flex items-center justify-center">
                    <div className="text-[#FFAA00] text-6xl font-bold">S</div>
                  </div>
                  <div className="absolute -top-8 -left-8 w-4 h-4 bg-[#FFAA00] rounded-full"></div>
                  <div className="absolute top-4 -right-8 w-6 h-6 bg-[#FF8800] rounded-full"></div>
                  <div className="absolute -bottom-4 left-8 w-5 h-5 bg-[#FFAA00] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050035] rounded-t-[32px] pt-16 sm:pt-28 pb-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
            {/* Company Info */}
            <div className="space-y-8 flex flex-col items-center justify-center">
              <div>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/logo.svg"
                    alt="SnovaTech Logo"
                    className="w-24 mb-4"
                  />
                  <div className="flex items-center space-x-0 mb-2">
                    <span className="text-4xl font-bold text-[#FFAA00]">
                      Snova
                    </span>
                    <span className="text-4xl font-bold text-white">Tech</span>
                  </div>
                  <p className="text-[#FFAA00] text-xl font-bold">
                    Leading Revolution With Innovation
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-2xl font-bold mb-3">Navigation</h3>
              <div className="space-y-3">
                <a
                  href="#accueil"
                  className="block text-[#CDCCD7] hover:text-white transition-colors text-xl"
                >
                  Accueil
                </a>
                <a
                  href="#services"
                  className="block text-[#CDCCD7] hover:text-white transition-colors text-xl"
                >
                  Services
                </a>
                <a
                  href="#avantages"
                  className="block text-[#CDCCD7] hover:text-white transition-colors text-xl"
                >
                  Avantages
                </a>
                <a
                  href="#a-propos"
                  className="block text-[#CDCCD7] hover:text-white transition-colors text-xl"
                >
                  À propos
                </a>
                <a
                  href="#faq"
                  className="block text-[#CDCCD7] hover:text-white transition-colors text-xl"
                >
                  FAQ
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
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
              >
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA00] text-base sm:text-lg"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Adresse email"
                  className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA00] text-base sm:text-lg"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <textarea
                  rows={4}
                  placeholder="Votre message..."
                  className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA00] resize-none text-base sm:text-lg"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
                <Button
                  className="w-full sm:w-auto bg-white text-[#050035] hover:bg-gray-100 rounded-md px-4 py-2 text-sm sm:text-base font-bold"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/20 pt-14 overflow-x-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61574140114176"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-3"
                >
                  <Facebook className="h-5 w-5 text-[#050035]" />
                </a>
                <a
                  href="https://www.linkedin.com/company/snovatech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-3"
                >
                  <Linkedin className="h-5 w-5 text-[#050035]" />
                </a>
              </div>

              {/* Copyright */}
              <p className="text-white/90 text-center text-base sm:text-lg">
                © 2025 SnovaTech. All rights reserved.
              </p>

              {/* Contact Info */}
              <div className="flex flex-col lg:flex-row gap-8 text-base">
                <div className="flex items-center gap-3 text-white/90 text-sm sm:text-base">
                  <MapPin className="h-6 w-6" />
                  <span>Alger, bab ezzouar, usthb, startp hall</span>
                </div>
                <div className="flex items-center gap-3 text-white/90 text-sm sm:text-base">
                  <Mail className="h-6 w-6" />
                  <span>snovatech.innovation@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/90 text-sm sm:text-base">
                  <Phone className="h-6 w-6" />
                  <span>+213 540 70 92 82</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
