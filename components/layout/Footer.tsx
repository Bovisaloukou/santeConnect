import Link from "next/link";
import { CurrentYear } from "@/components/CurrentYear";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark-gray text-neutral-light-gray py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-white">SantéConnect</h3>
            <p className="text-sm text-neutral-medium-gray">
              Facilitez et accélérez votre prise en charge médicale grâce à notre plateforme intuitive.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-white">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">Accueil</Link></li>
              <li><Link href="/centres-medicaux" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">Centres médicaux</Link></li>
              <li><Link href="/pharmacies" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">Pharmacies</Link></li>
              <li><Link href="/about" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">À propos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-white">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">Conditions d\'utilisation</Link></li>
              <li><Link href="/privacy" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/cookies" className="text-sm text-neutral-medium-gray hover:text-accent-turquoise transition-colors">Politique de cookies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-white">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-neutral-medium-gray">contact@santeconnect.com</li>
              <li className="text-sm text-neutral-medium-gray">+123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-medium-gray/30 pt-8 text-center">
          <p className="text-sm text-neutral-medium-gray">&copy; <CurrentYear /> SantéConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 