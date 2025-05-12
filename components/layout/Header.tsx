'use client'; // Directive pour marquer comme Client Component

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Image from 'next/image';
import { useAuth } from "@/lib/auth/AuthContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/centres-medicaux", label: "Centres médicaux" },
    { href: "/pharmacies", label: "Pharmacies" },
    { href: "/about", label: "À propos" },
  ];

  return (
    <header className="bg-neutral-white sticky top-0 z-50 border-b border-neutral-medium-gray/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="SantéConnect Logo"
            width={32}
            height={32}
            className="text-primary-blue"
          />
          <span className="text-2xl font-bold text-primary-blue">SantéConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-neutral-dark-gray hover:text-primary-blue transition-colors">
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard/patient" className="text-neutral-dark-gray hover:text-primary-blue transition-colors">
              Tableau de bord
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons / User Info */}
        <div className="hidden md:flex space-x-2">
          {user ? (
            <Button variant="outline" onClick={logout} className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-neutral-white">
              Déconnexion
            </Button>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="outline" className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-neutral-white mr-2">
                  Connexion
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button className="bg-primary-blue text-neutral-white hover:bg-opacity-90">
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-neutral-dark-gray" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0">
              <SheetTitle className="sr-only">Menu de navigation principal</SheetTitle>
              <SheetDescription className="sr-only">
                Contient les liens de navigation principaux du site ainsi que les options de connexion et d'inscription.
              </SheetDescription>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-neutral-medium-gray/20">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image
                      src="/logo.svg"
                      alt="SantéConnect Logo"
                      width={28}
                      height={28}
                      className="text-primary-blue"
                    />
                    <span className="text-xl font-bold text-primary-blue">SantéConnect</span>
                  </Link>
                </div>
                <nav className="flex-grow p-6 space-y-3">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center py-2 text-lg text-neutral-dark-gray hover:text-primary-blue transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  {user && (
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/patient"
                        className="flex items-center py-2 text-lg text-neutral-dark-gray hover:text-primary-blue transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Tableau de bord
                      </Link>
                    </SheetClose>
                  )}
                </nav>
                <div className="p-6 border-t border-neutral-medium-gray/20">
                  {user ? (
                    <SheetClose asChild>
                      <Button variant="outline" onClick={logout} className="w-full border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-neutral-white">
                        Déconnexion
                      </Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" passHref className="w-full">
                          <Button variant="outline" className="w-full border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-neutral-white mb-3">
                            Connexion
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/register" passHref className="w-full">
                          <Button className="w-full bg-primary-blue text-neutral-white hover:bg-opacity-90">
                            Inscription
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 