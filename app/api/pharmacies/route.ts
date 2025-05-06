import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// Simuler une base de données de pharmacies
const pharmacies = [
  {
    id: "pharmacy-1",
    userId: "user-3",
    name: "Pharmacie Centrale",
    address: "123 Rue Principale, Ville",
    phone: "+123456789",
    openingHours: "Lun-Ven: 8h-19h, Sam: 9h-17h, Dim: Fermé",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "pharmacy-2",
    userId: "user-5",
    name: "Pharmacie du Marché",
    address: "45 Place du Marché, Ville",
    phone: "+123456790",
    openingHours: "Lun-Sam: 8h-20h, Dim: 10h-13h",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
]

// Simuler une base de données de produits pharmaceutiques
const pharmacyProducts = [
  {
    id: "product-1",
    pharmacyId: "pharmacy-1",
    name: "Paracétamol 500mg",
    description: "Analgésique et antipyrétique",
    category: "Médicament",
    price: 3.5,
    inStock: true,
    quantity: 100,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "product-2",
    pharmacyId: "pharmacy-1",
    name: "Amoxicilline 1g",
    description: "Antibiotique à large spectre",
    category: "Médicament",
    price: 8.2,
    inStock: true,
    quantity: 50,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "product-3",
    pharmacyId: "pharmacy-2",
    name: "Ibuprofène 400mg",
    description: "Anti-inflammatoire non stéroïdien",
    category: "Médicament",
    price: 4.8,
    inStock: true,
    quantity: 75,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "product-4",
    pharmacyId: "pharmacy-2",
    name: "Vitamine C 1000mg",
    description: "Complément alimentaire",
    category: "Supplément",
    price: 12.5,
    inStock: true,
    quantity: 30,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
]

// Récupérer toutes les pharmacies
async function getPharmacies(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  let filteredPharmacies = [...pharmacies]

  // Filtrer les pharmacies si un terme de recherche est fourni
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPharmacies = pharmacies.filter(
      (pharmacy) =>
        pharmacy.name.toLowerCase().includes(searchLower) || pharmacy.address.toLowerCase().includes(searchLower),
    )
  }

  // Ajouter les produits à chaque pharmacie
  const pharmaciesWithProducts = filteredPharmacies.map((pharmacy) => ({
    ...pharmacy,
    products: pharmacyProducts.filter((product) => product.pharmacyId === pharmacy.id),
  }))

  return NextResponse.json(pharmaciesWithProducts)
}

// Récupérer une pharmacie par ID
async function getPharmacyById(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de pharmacie manquant" }, { status: 400 })
  }

  const pharmacy = pharmacies.find((p) => p.id === id)

  if (!pharmacy) {
    return NextResponse.json({ error: "Pharmacie non trouvée" }, { status: 404 })
  }

  // Ajouter les produits à la pharmacie
  const pharmacyWithProducts = {
    ...pharmacy,
    products: pharmacyProducts.filter((product) => product.pharmacyId === pharmacy.id),
  }

  return NextResponse.json(pharmacyWithProducts)
}

// Ajouter une pharmacie
async function addPharmacy(req: NextRequest, user: any) {
  // Vérifier les permissions
  if (user.role !== "admin" && user.role !== "pharmacy") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const pharmacyData = await req.json()

  // Validation des données
  if (!pharmacyData.name || !pharmacyData.address || !pharmacyData.phone || !pharmacyData.openingHours) {
    return NextResponse.json({ error: "Données de pharmacie incomplètes" }, { status: 400 })
  }

  // Créer une nouvelle pharmacie
  const newPharmacy = {
    id: `pharmacy-${pharmacies.length + 1}`,
    userId: user.id,
    name: pharmacyData.name,
    address: pharmacyData.address,
    phone: pharmacyData.phone,
    openingHours: pharmacyData.openingHours,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Dans une application réelle, nous ajouterions la pharmacie à la base de données
  pharmacies.push(newPharmacy)

  return NextResponse.json({
    pharmacy: newPharmacy,
    message: "Pharmacie ajoutée avec succès",
  })
}

export const GET = getPharmacies
export const POST = withAuth(addPharmacy, ["admin", "pharmacy"])
