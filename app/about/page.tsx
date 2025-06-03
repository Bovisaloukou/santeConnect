import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Clock, MapPin, Shield, Brain } from "lucide-react"

export const metadata: Metadata = {
  title: "À propos - SantéConnect",
  description: "En savoir plus sur la mission et l'équipe de SantéConnect.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-white via-primary-blue/10 to-primary-blue/20 py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-neutral-dark-gray">
              SantéConnect : L'innovation au service de l'accès aux soins au Bénin
            </h1>
            <p className="text-xl text-center text-neutral-medium-gray max-w-3xl mx-auto">
              Nous croyons que chaque Béninois, où qu'il soit, mérite un accès rapide et efficace aux soins de santé.
            </p>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-16 bg-neutral-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Notre Histoire</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-neutral-medium-gray mb-6">
                Né d'un constat simple : l'inégalité d'accès aux soins au Bénin. Dans les zones reculées, les patients parcourent des kilomètres pour accéder aux soins, retardant leur prise en charge.
              </p>
              <p className="text-lg text-neutral-medium-gray">
                SantéConnect est née de cette volonté de rapprocher les patients des professionnels de santé, en utilisant la technologie pour faciliter et accélérer le parcours de soins.
              </p>
            </div>
          </div>
        </section>

        {/* Notre Innovation */}
        <section className="py-16 bg-neutral-light-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Notre Innovation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="h-10 w-10 text-primary-blue mr-4" />
                    <h3 className="text-xl font-semibold text-neutral-dark-gray">Interrogatoire Automatisé</h3>
                  </div>
                  <p className="text-neutral-medium-gray">
                    Notre système d'interrogatoire automatisé permet de recueillir les informations essentielles du patient avant sa consultation, optimisant le temps médical.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-10 w-10 text-secondary-green mr-4" />
                    <h3 className="text-xl font-semibold text-neutral-dark-gray">Gain de Temps</h3>
                  </div>
                  <p className="text-neutral-medium-gray">
                    Réduction significative du temps d'attente et d'observation, permettant aux médecins de se concentrer sur le diagnostic et le traitement.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-10 w-10 text-accent-turquoise mr-4" />
                    <h3 className="text-xl font-semibold text-neutral-dark-gray">Qualité des Soins</h3>
                  </div>
                  <p className="text-neutral-medium-gray">
                    Amélioration de la qualité des soins grâce à une meilleure préparation de la consultation et une communication optimisée.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Notre Équipe */}
        <section className="py-16 bg-neutral-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Notre Équipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-10 w-10 text-primary-blue mr-4" />
                    <h3 className="text-xl font-semibold text-neutral-dark-gray">Bovis ALOUKOU</h3>
                  </div>
                  <p className="text-neutral-medium-gray">
                    Fondateur et Directeur Technique
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-10 w-10 text-primary-blue mr-4" />
                    <h3 className="text-xl font-semibold text-neutral-dark-gray">Yannick VISSOH</h3>
                  </div>
                  <p className="text-neutral-medium-gray">
                    Co-fondateur et Directeur des Opérations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Notre Vision */}
        <section className="py-16 bg-neutral-light-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Notre Vision</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-neutral-medium-gray mb-6">
                Nous aspirons à devenir la référence en matière d'accès aux soins au Bénin, en connectant chaque patient aux meilleurs professionnels de santé, où qu'il se trouve.
              </p>
              <p className="text-lg text-neutral-medium-gray">
                Notre mission est de démocratiser l'accès aux soins de qualité, en utilisant la technologie pour briser les barrières géographiques et améliorer l'efficacité du système de santé.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
