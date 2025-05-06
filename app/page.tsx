import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Pill, Bell, CreditCard, FileText, MessageSquare, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-600">SantéConnect</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-emerald-600">
              Accueil
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-emerald-600">
              Services
            </Link>
            <Link href="/pharmacies" className="text-gray-700 hover:text-emerald-600">
              Pharmacies
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-emerald-600">
              À propos
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Link href="/login" passHref>
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/register" passHref>
              <Button>Inscription</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Accédez facilement aux soins de santé</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Une plateforme intuitive qui connecte patients et professionnels de santé pour une prise en charge
              médicale optimisée.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Trouver un médecin
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-700">
                Consulter les pharmacies
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-emerald-600" />}
                title="Gestion des Utilisateurs"
                description="Créez votre profil patient ou professionnel de santé pour accéder à tous nos services."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-emerald-600" />}
                title="Rendez-vous Médicaux"
                description="Prenez rendez-vous avec des professionnels de santé et gérez votre calendrier médical."
              />
              <FeatureCard
                icon={<Pill className="h-10 w-10 text-emerald-600" />}
                title="Gestion des Médicaments"
                description="Consultez la disponibilité des médicaments dans les pharmacies proches de chez vous."
              />
              <FeatureCard
                icon={<Bell className="h-10 w-10 text-emerald-600" />}
                title="Alertes et Notifications"
                description="Recevez des rappels pour vos rendez-vous et prises de médicaments."
              />
              <FeatureCard
                icon={<CreditCard className="h-10 w-10 text-emerald-600" />}
                title="Paiements Sécurisés"
                description="Effectuez des paiements sécurisés pour vos consultations et médicaments."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-emerald-600" />}
                title="Dossier Médical"
                description="Accédez à votre dossier médical et partagez-le avec vos professionnels de santé."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                title="Créez votre compte"
                description="Inscrivez-vous en tant que patient ou professionnel de santé et complétez votre profil."
              />
              <StepCard
                number="2"
                title="Accédez aux services"
                description="Prenez rendez-vous, consultez les disponibilités des médicaments ou gérez vos patients."
              />
              <StepCard
                number="3"
                title="Bénéficiez du suivi"
                description="Recevez des notifications, accédez à votre historique médical et communiquez facilement."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Témoignages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Marie Koné"
                role="Patiente"
                quote="Grâce à cette plateforme, j'ai pu trouver rapidement un médecin disponible près de chez moi et prendre rendez-vous en quelques clics."
              />
              <TestimonialCard
                name="Dr. Amadou Diallo"
                role="Médecin généraliste"
                quote="La gestion des rendez-vous et des dossiers patients est devenue beaucoup plus simple. Je peux me concentrer davantage sur mes patients."
              />
              <TestimonialCard
                name="Fatou Sow"
                role="Pharmacienne"
                quote="Nous pouvons maintenant informer facilement les patients de la disponibilité de leurs médicaments, ce qui a considérablement amélioré notre service."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-emerald-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à améliorer votre expérience de santé ?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Rejoignez notre plateforme dès aujourd'hui et bénéficiez d'un accès simplifié aux soins de santé.
            </p>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/register" className="flex items-center">
                S'inscrire maintenant <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SantéConnect</h3>
              <p className="text-gray-300">
                Facilitez et accélérez votre prise en charge médicale grâce à notre plateforme intuitive.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-white">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/pharmacies" className="text-gray-300 hover:text-white">
                    Pharmacies
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    À propos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-300 hover:text-white">
                    Politique de cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-300">contact@santeconnect.com</li>
                <li className="text-gray-300">+123 456 789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} SantéConnect. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="h-full transition-transform hover:scale-[1.02]">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <MessageSquare className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-gray-600 italic mb-4 flex-grow">"{quote}"</p>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
