"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight, Facebook, Zap, Mail, MapPin, Phone, BarChart3, Menu, X } from "lucide-react"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Navigation - CENTERED */}
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <div className="flex items-center">
              <Image src="/images/logo.png" alt="SnovaTech Logo" width={50} height={50} className="mr-2" />
              <h1 className="text-2xl font-bold">
                <span className="text-accent">Snova</span>
                <span className="text-primary">Tech</span>
              </h1>
            </div>
            <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              Accueil
            </a>
            <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              À propos
            </a>
            <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              Comment
            </a>
            <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              FAQ
            </a>
            <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link href="/simulation">
              <Button className="bg-primary hover:bg-secondary text-white rounded-full">Simulation Gratuite</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="flex flex-col w-full space-y-3 md:hidden">
              <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Accueil
              </a>
              <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                À propos
              </a>
              <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Comment
              </a>
              <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                FAQ
              </a>
              <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Contact
              </a>
              <Link href="/simulation" className="mt-2">
                <Button className="bg-primary hover:bg-secondary text-white w-full rounded-full">
                  Simulation Gratuite
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Full Background Image */}
      <section className="relative bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
              <Image src="/images/full-hero.png" alt="Solar Energy Event" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-white">
                    Passez à l'énergie solaire avec nous
                  </h2>
                  <Button className="bg-white text-primary hover:bg-accent hover:text-primary rounded-full px-6 mt-4 flex items-center">
                    Réservez un appel
                    <div className="ml-2 bg-primary rounded-full p-1">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-0 bg-white p-5 rounded-l-xl shadow-lg max-w-xs hidden md:block translate-x-4">
              <p className="text-sm text-primary">
                D'une analyse intelligente de haute précision à une installation solaire sur mesure adaptée à vos
                besoins énergétiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - RESTRUCTURED to match the provided image */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row">
            {/* Left column with title and image */}
            <div className="md:w-1/3 pr-0 md:pr-8 mb-8 md:mb-0">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                <h3 className="text-sm font-medium text-primary">Notre mission</h3>
              </div>
              <div className="mt-8">
                <div className="rounded-xl overflow-hidden">
                  <Image src="/images/full-hero.png" alt="Notre mission" width={400} height={300} className="w-full" />
                </div>
              </div>
            </div>

            {/* Right column with text and icons */}
            <div className="md:w-2/3">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4">
                  Aider les entreprises à passer à l'énergie solaire avec des solutions sur mesure, adaptées à leurs
                  besoins.
                </h2>
                <p className="mb-8 text-secondary">
                  Et avec l'appui de l'IA, offrir une simulation claire des performances et des coûts avant tout
                  engagement.
                </p>
                {/* Blue line */}
                <hr className="border-t-2 border-secondary mb-8" />
              </div>

              {/* Icons section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="bg-primary p-3 rounded-full mr-4 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">Transparence</h3>
                    <p className="text-sm text-secondary">
                      Simulation claire, détaillée, et estimation précise des coûts et des bénéfices avant toute
                      décision d'investissement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary p-3 rounded-full mr-4 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">Sur-mesure</h3>
                    <p className="text-sm text-secondary">
                      Chaque entreprise est unique. On pense à vos besoins spécifiques, vos contraintes techniques et
                      vos objectifs énergétiques.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-primary text-white p-6 md:p-12 rounded-2xl mx-4 my-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-2">Comment ça marche ?</h3>
            <h2 className="text-2xl md:text-3xl font-bold">
              Un processus Simple,
              <br />
              pour votre passage au solaire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-secondary p-6 rounded-xl">
              <div className="font-bold text-xl mb-2">01.</div>
              <h3 className="font-bold mb-2">Simulation gratuite</h3>
              <p className="text-sm text-gray-300">
                Simulez rapidement le coût et les économies d'une future installation solaire.
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-xl">
              <div className="font-bold text-xl mb-2">02.</div>
              <h3 className="font-bold mb-2">Réservez un appel</h3>
              <p className="text-sm text-gray-300">
                Pour une étude personnalisée de vos besoins et un conseil adapté à votre situation.
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-xl">
              <div className="font-bold text-xl mb-2">03.</div>
              <h3 className="font-bold mb-2">Simulation sur mesure</h3>
              <p className="text-sm text-gray-300">
                Recevez une analyse complète et détaillée de votre projet avant l'installation.
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-xl">
              <div className="font-bold text-xl mb-2">04.</div>
              <h3 className="font-bold mb-2">Installation clé en main</h3>
              <p className="text-sm text-gray-300">
                On s'occupe de l'installation de A à Z pour une mise en service sans difficultés.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-secondary p-6 rounded-xl">
            <div className="font-bold text-xl mb-2">05.</div>
            <h3 className="font-bold mb-2">Suivi et maintenance</h3>
            <p className="text-sm text-gray-300">
              Accédez à une application de suivi en temps réel de votre installation solaire.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-medium text-primary mb-2 flex items-center justify-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              On répond à vos questions
            </h3>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              Avant de vous lancer, voici
              <br className="hidden sm:block" />
              ce que vous devez savoir
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-primary">
                À qui s'adresse votre service ?
              </AccordionTrigger>
              <AccordionContent className="text-secondary">
                Aux entreprises et grands consommateurs d'énergie souhaitant réduire leur facture énergétique et
                s'engager dans la transition écologique.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-primary">
                Pourquoi devrais-je passer au solaire ?
              </AccordionTrigger>
              <AccordionContent className="text-secondary">
                Le solaire permet de réduire vos factures d'énergie, de stabiliser vos coûts à long terme et de
                contribuer activement à la transition écologique. C'est aussi un levier d'image positive pour votre
                entreprise.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-primary">
                Est-ce qu'il existe des aides ou subventions de l'État ?
              </AccordionTrigger>
              <AccordionContent className="text-secondary">
                Oui, l'État soutient propose des subventions, des procédures simplifiées, un prix d'achat garanti de
                l'électricité solaire, et des aides pour les PME locales. On vous aide à en bénéficier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-primary">
                Que propose la simulation personnalisée avec l'IA ?
              </AccordionTrigger>
              <AccordionContent className="text-secondary">
                Elle analyse votre site, vos besoins et vos contraintes pour vous fournir un projet sur mesure, avec
                données techniques précises, production estimée, et coûts détaillés.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-primary">
                Est-ce que vous installez les panneaux solaires vous-mêmes ?
              </AccordionTrigger>
              <AccordionContent className="text-secondary">
                Nous travaillons en partenariat avec des installateurs certifiés. Notre rôle est de vous accompagner
                avec une solution sur mesure et de vous mettre en relation avec les bons professionnels.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-primary">
                Est-ce que je peux vous contacter pour en discuter ?
              </AccordionTrigger>
              <AccordionContent className="text-secondary">
                Bien sûr ! Notre équipe est disponible pour répondre à vos questions et vous accompagner dans votre
                projet. Vous pouvez nous contacter via le formulaire en bas de page ou réserver directement un appel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* "Prêt à découvrir" Section */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary text-white p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-3/4 z-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                  Prêt à découvrir votre potentiel solaire ?
                </h2>
                <p className="mb-6 text-sm md:text-base">
                  Commencez par votre simulation gratuite, puis réservez un appel avec nous pour une étude précise,
                  claire et une simulation sur mesure.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-transparent border-2 border-white hover:bg-white/10 rounded-full px-5 py-2 text-sm">
                    Réservez un appel
                  </Button>
                  <Link href="/simulation">
                    <Button className="bg-accent text-primary hover:bg-accent/90 rounded-full px-5 py-2 text-sm">
                      Simulation Gratuite
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:absolute md:right-8 md:top-1/2 md:transform md:-translate-y-1/2 mt-8 md:mt-0">
                <Image src="/images/logo.png" alt="SnovaTech Logo" width={100} height={100} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Image src="/images/logo.png" alt="SnovaTech Logo" width={50} height={50} />
                <h2 className="text-xl font-bold ml-2">
                  <span className="text-accent">Snova</span>
                  <span className="text-white">Tech</span>
                </h2>
              </div>
              <p className="text-sm mb-4">Leading Revolution With Innovation</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-accent transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors">
                  <Zap className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:text-accent transition-colors">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-accent transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-accent transition-colors">
                    Avantages
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-accent transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-accent transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contactez-nous</h3>
              <form className="space-y-4">
                <Input
                  type="text"
                  placeholder="Votre prénom"
                  className="bg-secondary border-0 text-white placeholder:text-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Adresse email"
                  className="bg-secondary border-0 text-white placeholder:text-gray-400"
                />
                <Textarea
                  placeholder="Votre message"
                  className="bg-secondary border-0 text-white placeholder:text-gray-400"
                />
                <Button className="bg-accent hover:bg-accent/90 text-primary font-medium w-full">Envoyer</Button>
              </form>
            </div>
          </div>

          <div className="border-t border-secondary mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 SnovaTech. All rights reserved.</p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Alger, bab ezzouar, usthb, startp hall</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>snovatech.innovation@gmail.com</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>0550 55 55 55</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
