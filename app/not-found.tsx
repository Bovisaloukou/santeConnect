import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-light-gray text-center px-4">
      <div className="max-w-md">
        <h1 className="text-6xl md:text-9xl font-bold text-primary-blue">404</h1>
        <h2 className="mt-4 text-2xl md:text-4xl font-semibold text-neutral-dark-gray">
          Page non trouvée
        </h2>
        <p className="mt-3 text-base md:text-lg text-neutral-medium-gray">
          Désolé, la page que vous recherchez semble s'être égarée dans le cyberespace.
          Elle n'existe peut-être plus ou l'URL a été mal saisie.
        </p>
        <div className="mt-8">
          <Link href="/" passHref>
            <Button 
              size="lg" 
              className="bg-primary-blue text-neutral-white hover:bg-opacity-90 transition-all text-lg px-8 py-4 rounded-full font-semibold tracking-wide"
            >
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
        <div className="mt-12">
          {/* Vous pouvez ajouter une illustration SVG ou une image ici si vous le souhaitez */}
          {/* Exemple: <img src="/images/404-illustration.svg" alt="Illustration page non trouvée" className="w-64 h-auto mx-auto" /> */}
        </div>
      </div>
    </div>
  )
} 