'use client';

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Pill, Bell, CreditCard, FileText, MessageSquare, ArrowRight } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  const isFullyAuthenticated = session?.user && (!session.user.is2FAEnabled || session.user.is2FAVerified);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1">
        {/* Hero Section Apple Style */}
        <section className="relative bg-gradient-to-br from-neutral-white via-primary-blue/10 to-primary-blue/20 py-36 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none">
            <svg width="100%" height="100%" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full opacity-60">
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary-blue-light)" />
                  <stop offset="100%" stopColor="var(--color-neutral-white)" />
                </linearGradient>
              </defs>
              <ellipse cx="720" cy="200" rx="700" ry="200" fill="url(#heroGradient)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 flex flex-col items-center text-center gap-10 relative z-10">
            <img src="/placeholder.svg" alt="SantéConnect" className="w-40 h-40 mb-6 drop-shadow-2xl rounded-3xl bg-neutral-white/70 backdrop-blur-lg border border-primary-blue/30 object-cover" />
            <h1 className="text-6xl md:text-8xl font-extralight tracking-tight mb-6 text-neutral-dark-gray" style={{letterSpacing: '-0.04em'}}>
              Votre santé, <span className="font-bold text-primary-blue">simplement</span>.
            </h1>
            <p className="text-2xl md:text-3xl text-neutral-medium-gray mb-10 max-w-2xl mx-auto font-light">
              Découvrez une nouvelle expérience de soins, élégante, fluide et connectée.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!session || (session.user.is2FAEnabled && !session.user.is2FAVerified) ? (
                <Button size="lg" className="bg-neutral-white text-primary-blue shadow-xl hover:bg-accent-turquoise hover:text-neutral-white hover:bg-opacity-90 transition-all text-xl px-12 py-6 rounded-full font-semibold tracking-wide">
                  <Link href="/register" className="flex items-center">
                    S'inscrire maintenant <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              <Button size="lg" className="bg-accent-turquoise text-neutral-white shadow-xl hover:bg-neutral-white hover:text-primary-blue hover:bg-opacity-90 transition-all text-xl px-12 py-6 rounded-full font-semibold tracking-wide">
                <Link href="/register-center" className="flex items-center">
                  Inscrire un centre <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-neutral-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary-blue" />}
                title="Gestion des Utilisateurs"
                description="Créez votre profil patient ou professionnel de santé pour accéder à tous nos services."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-primary-blue" />}
                title="Rendez-vous Médicaux"
                description="Prenez rendez-vous avec des professionnels de santé et gérez votre calendrier médical."
              />
              <FeatureCard
                icon={<Pill className="h-10 w-10 text-secondary-green" />}
                title="Gestion des Médicaments"
                description="Consultez la disponibilité des médicaments dans les pharmacies proches de chez vous."
              />
              <FeatureCard
                icon={<Bell className="h-10 w-10 text-accent-orange" />}
                title="Alertes et Notifications"
                description="Recevez des rappels pour vos rendez-vous et prises de médicaments."
              />
              <FeatureCard
                icon={<CreditCard className="h-10 w-10 text-primary-blue" />}
                title="Paiements Sécurisés"
                description="Effectuez des paiements sécurisés pour vos consultations et médicaments."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-primary-blue" />}
                title="Dossier Médical"
                description="Accédez à votre dossier médical et partagez-le avec vos professionnels de santé."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-neutral-light-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Comment ça marche</h2>
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
        <section className="py-16 bg-neutral-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark-gray">Témoignages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Marie Koné"
                role="Patiente"
                quote="Grâce à cette plateforme, j'ai pu trouver rapidement un médecin disponible près de chez moi et prendre rendez-vous en quelques clics."
                avatarSrc="/avatar.jpg"
              />
              <TestimonialCard
                name="Dr. Amadou Diallo"
                role="Médecin généraliste"
                quote="La gestion des rendez-vous et des dossiers patients est devenue beaucoup plus simple. Je peux me concentrer davantage sur mes patients."
                avatarSrc="/avatar.jpg"
              />
              <TestimonialCard
                name="Fatou Sow"
                role="Pharmacienne"
                quote="Nous pouvons maintenant informer facilement les patients de la disponibilité de leurs médicaments, ce qui a considérablement amélioré notre service."
                avatarSrc="/avatar.jpg"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-blue text-neutral-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à améliorer votre expérience de santé ?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Rejoignez notre plateforme dès aujourd'hui et bénéficiez d'un accès simplifié aux soins de santé.
            </p>
            {!session || (session.user.is2FAEnabled && !session.user.is2FAVerified) ? (
              <Button size="lg" className="bg-neutral-white text-primary-blue hover:bg-neutral-light-gray hover:text-opacity-90">
                <Link href="/register" className="flex items-center">
                  S'inscrire maintenant <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="bg-neutral-white text-primary-blue hover:bg-neutral-light-gray hover:text-opacity-90">
                <Link href="/dashboard/patient" className="flex items-center">
                  Accéder à mon tableau de bord <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="h-full bg-neutral-white/70 backdrop-blur-lg shadow-2xl border-0 rounded-3xl transition-transform hover:scale-105 hover:shadow-primary-blue/20 duration-300">
      <CardContent className="pt-8 pb-6 flex flex-col items-center text-center gap-2">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-blue/10 shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-neutral-dark-gray">{title}</h3>
        <p className="text-neutral-medium-gray">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl font-bold text-primary-blue mr-4 bg-primary-blue/10 px-3 py-1 rounded-md">{number}</span>
          <h3 className="text-xl font-semibold text-neutral-dark-gray">{title}</h3>
        </div>
        <p className="text-neutral-medium-gray">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ name, role, quote, avatarSrc }: { name: string; role: string; quote: string; avatarSrc: string }) {
  return (
    <Card className="bg-neutral-white shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img src={avatarSrc} alt={name} className="w-12 h-12 rounded-full mr-4" />
          <h3 className="text-xl font-semibold text-neutral-dark-gray">{name}</h3>
        </div>
        <p className="italic text-neutral-medium-gray mb-4">"{quote}"</p>
        <p className="text-sm text-primary-blue">{role}</p>
      </CardContent>
    </Card>
  )
}
