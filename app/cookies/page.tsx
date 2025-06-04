import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Politique de cookies - SantéConnect",
  description: "Consultez la politique de gestion des cookies de SantéConnect.",
}

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-white via-primary-blue/10 to-primary-blue/20 py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-neutral-dark-gray">
              Politique de cookies
            </h1>
            <p className="text-xl text-center text-neutral-medium-gray max-w-3xl mx-auto">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </section>

        {/* Contenu */}
        <section className="py-16 bg-neutral-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">1. Qu'est-ce qu'un cookie ?</h2>
                <p className="text-neutral-medium-gray">
                  Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, mobile ou tablette) lors de votre visite sur notre site. Il permet de stocker des informations relatives à votre navigation et de vous offrir une expérience personnalisée.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">2. Types de cookies utilisés</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Nous utilisons différents types de cookies :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>
                    <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site
                  </li>
                  <li>
                    <strong>Cookies de performance :</strong> Pour analyser l'utilisation du site
                  </li>
                  <li>
                    <strong>Cookies de fonctionnalité :</strong> Pour mémoriser vos préférences
                  </li>
                  <li>
                    <strong>Cookies de ciblage :</strong> Pour personnaliser votre expérience
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">3. Finalité des cookies</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Les cookies sont utilisés pour :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Assurer le bon fonctionnement du site</li>
                  <li>Améliorer la sécurité</li>
                  <li>Personnaliser votre expérience</li>
                  <li>Analyser l'utilisation du site</li>
                  <li>Optimiser les performances</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">4. Durée de conservation</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Les cookies sont conservés pour des durées variables :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                  <li>Cookies persistants : conservés jusqu'à leur expiration</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">5. Gestion des cookies</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Vous pouvez gérer vos préférences de cookies :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Via les paramètres de votre navigateur</li>
                  <li>En utilisant notre bannière de consentement</li>
                  <li>En nous contactant directement</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">6. Impact du refus</h2>
                <p className="text-neutral-medium-gray">
                  Le refus de certains cookies peut limiter certaines fonctionnalités du site. Les cookies essentiels ne peuvent pas être désactivés car ils sont nécessaires au fonctionnement du site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">7. Contact</h2>
                <p className="text-neutral-medium-gray">
                  Pour toute question concernant notre politique de cookies, contactez-nous à privacy@santeconnect.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
