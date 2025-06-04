import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Conditions d'utilisation - SantéConnect",
  description: "Consultez les conditions générales d'utilisation de la plateforme SantéConnect.",
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-white via-primary-blue/10 to-primary-blue/20 py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-neutral-dark-gray">
              Conditions d'utilisation
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
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">1. Acceptation des conditions</h2>
                <p className="text-neutral-medium-gray">
                  En accédant et en utilisant SantéConnect, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">2. Description des services</h2>
                <p className="text-neutral-medium-gray mb-4">
                  SantéConnect est une plateforme de santé numérique qui permet :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>La prise de rendez-vous médicaux en ligne</li>
                  <li>L'accès aux informations sur les professionnels de santé</li>
                  <li>La gestion des dossiers médicaux</li>
                  <li>La communication avec les professionnels de santé</li>
                  <li>L'accès aux services de pharmacie</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">3. Inscription et compte utilisateur</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Pour utiliser nos services, vous devez :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Être âgé d'au moins 18 ans</li>
                  <li>Fournir des informations exactes et complètes</li>
                  <li>Maintenir la confidentialité de votre compte</li>
                  <li>Notifier immédiatement toute utilisation non autorisée</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">4. Utilisation du service</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Vous vous engagez à :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Utiliser la plateforme conformément aux lois en vigueur</li>
                  <li>Ne pas usurper l'identité d'autres utilisateurs</li>
                  <li>Ne pas perturber le fonctionnement de la plateforme</li>
                  <li>Respecter la confidentialité des informations médicales</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">5. Responsabilités</h2>
                <p className="text-neutral-medium-gray mb-4">
                  SantéConnect s'engage à :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Assurer la disponibilité de la plateforme</li>
                  <li>Protéger les données personnelles des utilisateurs</li>
                  <li>Maintenir la sécurité du système</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">6. Modifications des conditions</h2>
                <p className="text-neutral-medium-gray">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur la plateforme.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">7. Contact</h2>
                <p className="text-neutral-medium-gray">
                  Pour toute question concernant ces conditions, veuillez nous contacter à contact@santeconnect.com
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
