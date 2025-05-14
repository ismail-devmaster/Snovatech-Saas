import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-amber-500">
            <span className="text-amber-500">Snova</span>
            <span className="text-[#0a0a3a]">Tech</span>
          </h1>
          <div className="hidden md:flex ml-10 space-x-6">
            <a href="#" className="text-sm font-medium">
              Accueil
            </a>
            <a href="#" className="text-sm font-medium">
              À propos
            </a>
            <a href="#" className="text-sm font-medium">
              Comment
            </a>
            <a href="#" className="text-sm font-medium">
              FAQ
            </a>
            <a href="#" className="text-sm font-medium">
              Contact
            </a>
          </div>
        </div>
        <Button className="bg-[#0a0a3a] hover:bg-[#0a0a3a]/90">Simulation Gratuite</Button>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-900 to-[#0a0a3a] text-white p-6 md:p-12 rounded-lg mx-4 my-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Passez à l'énergie solaire avec nous</h2>
                <p className="mb-6">
                  D'une analyse intelligente de haute précision à une installation clé en main adaptée à vos besoins
                  énergétiques.
                </p>
                <Button className="bg-white text-[#0a0a3a] hover:bg-white/90 rounded-full px-6">
                  Réservez un appel <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="md:w-1/3">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Solar Energy"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="bg-[#0a0a3a] text-white p-6 md:p-12 rounded-lg mx-4 my-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à découvrir votre potentiel solaire ?</h2>
            <p className="mb-6">
              Commencez par votre simulation gratuite, puis réservez un appel avec nous pour une étude précise, claire
              et une simulation sur mesure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-transparent border-2 border-white hover:bg-white/10 rounded-full px-6">
                Réservez un appel
              </Button>
              <Button className="bg-white text-[#0a0a3a] hover:bg-white/90 rounded-full px-6">
                Simulation Gratuite
              </Button>
            </div>
          </div>
          <div className="md:absolute md:right-12 md:top-1/2 md:transform md:-translate-y-1/2 mt-8 md:mt-0">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-amber-500 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute inset-4 bg-[#0a0a3a] rounded-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-white h-8 w-8"></div>
                  <div className="bg-white h-8 w-8"></div>
                  <div className="bg-white h-8 w-8"></div>
                  <div className="bg-white h-8 w-8"></div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 w-16 h-16">
                <div className="absolute inset-0 bg-amber-500 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-500 h-12 w-2 rotate-45"></div>
                  <div className="bg-amber-500 h-12 w-2 -rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#0a0a3a] text-white p-6 md:p-12 rounded-lg mx-4 my-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-2">Comment ça marche ?</h3>
            <h2 className="text-2xl md:text-3xl font-bold">
              Un processus Simple,
              <br />
              pour votre passage au solaire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1a1a4a] p-6 rounded-lg">
              <div className="font-bold text-xl mb-2">01.</div>
              <h3 className="font-bold mb-2">Simulation gratuite</h3>
              <p className="text-sm text-gray-300">
                Simulez rapidement le coût et les économies d'une future installation solaire.
              </p>
            </div>

            <div className="bg-[#1a1a4a] p-6 rounded-lg">
              <div className="font-bold text-xl mb-2">02.</div>
              <h3 className="font-bold mb-2">Réservez un appel</h3>
              <p className="text-sm text-gray-300">
                Pour une étude personnalisée de vos besoins et un conseil adapté à votre situation.
              </p>
            </div>

            <div className="bg-[#1a1a4a] p-6 rounded-lg">
              <div className="font-bold text-xl mb-2">03.</div>
              <h3 className="font-bold mb-2">Simulation sur mesure</h3>
              <p className="text-sm text-gray-300">
                Recevez une analyse complète et détaillée de votre projet avant l'installation.
              </p>
            </div>

            <div className="bg-[#1a1a4a] p-6 rounded-lg">
              <div className="font-bold text-xl mb-2">04.</div>
              <h3 className="font-bold mb-2">Installation clé en main</h3>
              <p className="text-sm text-gray-300">
                On s'occupe de l'installation de A à Z pour une mise en service sans difficultés.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-[#1a1a4a] p-6 rounded-lg">
            <div className="font-bold text-xl mb-2">05.</div>
            <h3 className="font-bold mb-2">Suivi et maintenance</h3>
            <p className="text-sm text-gray-300">
              Accédez à une application de suivi en temps réel de votre installation solaire.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <h3 className="text-sm font-medium text-[#0a0a3a] mb-2 flex items-center">
                <span className="w-2 h-2 bg-[#0a0a3a] rounded-full mr-2"></span>
                Notre mission
              </h3>
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Notre mission"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a3a] mb-4">
                Aider les entreprises à passer à l'énergie solaire avec des solutions sur mesure, adaptées à leurs
                besoins.
              </h2>
              <p className="mb-8">
                Et avec l'appui de l'IA, offrir une simulation claire des performances et des coûts avant tout
                engagement.
              </p>
              <hr className="border-t-2 border-purple-200 mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="bg-[#0a0a3a] p-3 rounded-lg mr-4">
                    <div className="text-white">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a3a] mb-2">Transparence</h3>
                    <p className="text-sm">
                      Simulation claire, détaillée, et estimation précise des coûts et des bénéfices avant toute
                      décision d'investissement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#0a0a3a] p-3 rounded-lg mr-4">
                    <div className="text-white">
                      <Linkedin className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a3a] mb-2">Sur-mesure</h3>
                    <p className="text-sm">
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

      {/* FAQ Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-medium text-[#0a0a3a] mb-2 flex items-center justify-center">
              <span className="w-2 h-2 bg-[#0a0a3a] rounded-full mr-2"></span>
              On répond à vos questions
            </h3>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a3a]">
              Avant de vous lancer, voici
              <br />
              ce que vous devez savoir
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-[#0a0a3a]">
                À qui s'adresse votre service ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Aux entreprises et grands consommateurs d'énergie souhaitant réduire leur facture énergétique et
                s'engager dans la transition écologique.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-[#0a0a3a]">
                Pourquoi devrais-je passer au solaire ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Le solaire permet de réduire vos factures d'énergie, de stabiliser vos coûts à long terme et de
                contribuer activement à la transition écologique. C'est aussi un levier d'image positive pour votre
                entreprise.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-[#0a0a3a]">
                Est-ce qu'il existe des aides ou subventions de l'État ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Oui, l'État soutient propose des subventions, des procédures simplifiées, un prix d'achat garanti de
                l'électricité solaire, et des aides pour les PME locales. On vous aide à en bénéficier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-[#0a0a3a]">
                Que propose la simulation personnalisée avec l'IA ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Elle analyse votre site, vos besoins et vos contraintes pour vous fournir un projet sur mesure, avec
                données techniques précises, production estimée, et coûts détaillés.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-gray-200 py-4">
              <AccordionTrigger className="text-left font-bold text-[#0a0a3a]">
                Est-ce que vous installez les panneaux solaires vous-mêmes ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Nous travaillons en partenariat avec des installateurs certifiés. Notre rôle est de vous accompagner
                avec une solution sur mesure et de vous mettre en relation avec les bons professionnels.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-white p-6 rounded-lg mx-4 my-6 border border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-full">
              <h3 className="text-lg font-medium mb-2">Est-ce que je peux vous contacter pour en discuter ?</h3>
              <p className="text-gray-600">
                Bien sûr ! Notre équipe est disponible pour répondre à vos questions et vous accompagner dans votre
                projet.
              </p>
            </div>
            <div className="ml-4">
              <Button variant="ghost" className="border border-gray-200">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a3a] text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="mr-2">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-amber-500 rounded-full"></div>
                    <div className="absolute inset-2 bg-[#0a0a3a] rounded-full flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="bg-amber-500 h-2 w-2"></div>
                        <div className="bg-amber-500 h-2 w-2"></div>
                        <div className="bg-amber-500 h-2 w-2"></div>
                        <div className="bg-amber-500 h-2 w-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold">
                  <span className="text-amber-500">Snova</span>
                  <span className="text-white">Tech</span>
                </h2>
              </div>
              <p className="text-sm mb-4">Leading Revolution With Innovation</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-amber-500">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-amber-500">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:text-amber-500">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-amber-500">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-amber-500">
                    Avantages
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-amber-500">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-amber-500">
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
                  className="bg-[#1a1a4a] border-0 text-white placeholder:text-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Adresse email"
                  className="bg-[#1a1a4a] border-0 text-white placeholder:text-gray-400"
                />
                <Textarea
                  placeholder="Votre message"
                  className="bg-[#1a1a4a] border-0 text-white placeholder:text-gray-400"
                />
                <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">Envoyer</Button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 SnovaTech. All rights reserved.</p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Siège: 25 rue avenue, 75010 Paris</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>snovatech.innovation@gmail.com</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>01.23.45.67.89</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
