"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { Search, MapPin, Phone, Clock, ShoppingCart } from "lucide-react"

// Types pour les pharmacies et produits
interface PharmacyProduct {
  id: string
  name: string
  description?: string
  category: string
  price: number
  inStock: boolean
  quantity: number
}

interface Pharmacy {
  id: string
  name: string
  address: string
  phone: string
  openingHours: string
  products: PharmacyProduct[]
}

export default function PatientPharmaciesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useUser()
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [cart, setCart] = useState<{ product: PharmacyProduct; quantity: number }[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.role !== "patient") {
      router.push(`/dashboard/${user.role}`)
    } else if (user) {
      fetchPharmacies()
    }
  }, [user, isLoading, router])

  const fetchPharmacies = async () => {
    try {
      // Dans une application réelle, nous ferions un appel API
      // Simuler des pharmacies pour l'exemple
      setPharmacies([
        {
          id: "pharmacy-1",
          name: "Pharmacie Centrale",
          address: "123 Rue Principale, Ville",
          phone: "+123456789",
          openingHours: "Lun-Ven: 8h-19h, Sam: 9h-17h, Dim: Fermé",
          products: [
            {
              id: "product-1",
              name: "Paracétamol 500mg",
              description: "Analgésique et antipyrétique",
              category: "Médicament",
              price: 3.5,
              inStock: true,
              quantity: 100,
            },
            {
              id: "product-2",
              name: "Amoxicilline 1g",
              description: "Antibiotique à large spectre",
              category: "Médicament",
              price: 8.2,
              inStock: true,
              quantity: 50,
            },
          ],
        },
        {
          id: "pharmacy-2",
          name: "Pharmacie du Marché",
          address: "45 Place du Marché, Ville",
          phone: "+123456790",
          openingHours: "Lun-Sam: 8h-20h, Dim: 10h-13h",
          products: [
            {
              id: "product-3",
              name: "Ibuprofène 400mg",
              description: "Anti-inflammatoire non stéroïdien",
              category: "Médicament",
              price: 4.8,
              inStock: true,
              quantity: 75,
            },
            {
              id: "product-4",
              name: "Vitamine C 1000mg",
              description: "Complément alimentaire",
              category: "Supplément",
              price: 12.5,
              inStock: true,
              quantity: 30,
            },
          ],
        },
      ])
    } catch (error) {
      console.error("Erreur lors de la récupération des pharmacies:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les pharmacies. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: PharmacyProduct) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }

    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    toast({
      title: "Commande initiée",
      description: "Vous allez être redirigé vers la page de paiement.",
    })

    // Dans une application réelle, nous redirigerions vers la page de paiement
    // router.push("/payment")
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)
  }

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredProducts =
    selectedPharmacy?.products.filter(
      (product) =>
        product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(productSearchQuery.toLowerCase())) ||
        product.category.toLowerCase().includes(productSearchQuery.toLowerCase()),
    ) || []

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pharmacies</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher une pharmacie par nom ou adresse"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedPharmacy ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedPharmacy.name}</h2>
                <Button variant="outline" onClick={() => setSelectedPharmacy(null)}>
                  Retour aux pharmacies
                </Button>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{selectedPharmacy.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{selectedPharmacy.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{selectedPharmacy.openingHours}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un produit"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.length === 0 ? (
                  <p className="text-gray-500 col-span-2">Aucun produit trouvé</p>
                ) : (
                  filteredProducts.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {product.description && <p className="mb-2">{product.description}</p>}
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{product.price.toFixed(2)} €</span>
                          <span className={product.inStock ? "text-emerald-600" : "text-red-500"}>
                            {product.inStock ? "En stock" : "Rupture de stock"}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleAddToCart(product)} disabled={!product.inStock} className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Ajouter au panier
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPharmacies.length === 0 ? (
                <p className="text-gray-500 col-span-2">Aucune pharmacie trouvée</p>
              ) : (
                filteredPharmacies.map((pharmacy) => (
                  <Card key={pharmacy.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{pharmacy.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <span>{pharmacy.address}</span>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <span>{pharmacy.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <span>{pharmacy.openingHours}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => setSelectedPharmacy(pharmacy)} className="w-full">
                        Voir les produits
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Panier</CardTitle>
              <CardDescription>
                {cart.length === 0 ? "Votre panier est vide" : `${cart.length} produit(s) dans votre panier`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500">Ajoutez des produits à votre panier</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.product.price.toFixed(2)} € / unité</p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-semibold pt-2">
                    <span>Total</span>
                    <span>{calculateTotal()} €</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckout} disabled={cart.length === 0} className="w-full">
                Passer la commande
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
