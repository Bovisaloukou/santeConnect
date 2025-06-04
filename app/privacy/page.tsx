import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Politique de confidentialité - SantéConnect",
  description: "Consultez la politique de confidentialité de SantéConnect.",
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-white via-primary-blue/10 to-primary-blue/20 py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-neutral-dark-gray">
              Politique de confidentialité
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
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">1. Collecte des données</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Nous collectons les informations suivantes :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Informations d'identification (nom, prénom, date de naissance)</li>
                  <li>Coordonnées (adresse, email, téléphone)</li>
                  <li>Informations médicales nécessaires aux soins</li>
                  <li>Données de connexion et d'utilisation</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">2. Utilisation des données</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Vos données sont utilisées pour :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Fournir et améliorer nos services</li>
                  <li>Faciliter la communication avec les professionnels de santé</li>
                  <li>Assurer la sécurité de votre compte</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">3. Protection des données</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Chiffrement des données sensibles</li>
                  <li>Accès restreint aux informations médicales</li>
                  <li>Surveillance continue de la sécurité</li>
                  <li>Formation du personnel à la protection des données</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">4. Partage des données</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Vos données peuvent être partagées avec :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Les professionnels de santé que vous consultez</li>
                  <li>Les pharmacies partenaires</li>
                  <li>Les autorités compétentes sur demande légale</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">5. Vos droits</h2>
                <p className="text-neutral-medium-gray mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 text-neutral-medium-gray space-y-2">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la portabilité</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">6. Conservation des données</h2>
                <p className="text-neutral-medium-gray">
                  Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Les données médicales sont conservées conformément aux exigences légales en matière de santé.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark-gray">7. Contact</h2>
                <p className="text-neutral-medium-gray">
                  Pour toute question concernant la protection de vos données, contactez notre délégué à la protection des données à dpo@santeconnect.com
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
