import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

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

// Récupérer tous les produits
async function getProducts(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pharmacyId = searchParams.get("pharmacyId")
  const search = searchParams.get("search")
  const category = searchParams.get("category")
  const inStock = searchParams.get("inStock")

  let filteredProducts = [...pharmacyProducts]

  // Filtrer par pharmacie
  if (pharmacyId) {
    filteredProducts = filteredProducts.filter((product) => product.pharmacyId === pharmacyId)
  }

  // Filtrer par terme de recherche
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)),
    )
  }

  // Filtrer par catégorie
  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  // Filtrer par disponibilité
  if (inStock !== null) {
    const inStockBool = inStock === "true"
    filteredProducts = filteredProducts.filter((product) => product.inStock === inStockBool)
  }

  return NextResponse.json(filteredProducts)
}

// Ajouter un produit
async function addProduct(req: NextRequest, user: any) {
  // Vérifier les permissions
  if (user.role !== "admin" && user.role !== "pharmacy") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const productData = await req.json()

  // Validation des données
  if (!productData.pharmacyId || !productData.name || !productData.price || productData.quantity === undefined) {
    return NextResponse.json({ error: "Données de produit incomplètes" }, { status: 400 })
  }

  // Créer un nouveau produit
  const newProduct = {
    id: `product-${pharmacyProducts.length + 1}`,
    pharmacyId: productData.pharmacyId,
    name: productData.name,
    description: productData.description || "",
    category: productData.category || "Autre",
    price: productData.price,
    inStock: productData.quantity > 0,
    quantity: productData.quantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Dans une application réelle, nous ajouterions le produit à la base de données
  pharmacyProducts.push(newProduct)

  return NextResponse.json({
    product: newProduct,
    message: "Produit ajouté avec succès",
  })
}

// Mettre à jour un produit
async function updateProduct(req: NextRequest, user: any) {
  // Vérifier les permissions
  if (user.role !== "admin" && user.role !== "pharmacy") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de produit manquant" }, { status: 400 })
  }

  const productData = await req.json()

  // Trouver le produit
  const productIndex = pharmacyProducts.findIndex((product) => product.id === id)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
  }

  // Vérifier que l'utilisateur est autorisé à modifier ce produit
  if (user.role === "pharmacy" && user.id !== pharmacyProducts[productIndex].pharmacyId.replace("pharmacy-", "user-")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  // Mettre à jour le produit
  const updatedProduct = {
    ...pharmacyProducts[productIndex],
    ...productData,
    inStock: productData.quantity > 0,
    updatedAt: new Date(),
  }

  // Dans une application réelle, nous mettrions à jour le produit dans la base de données
  pharmacyProducts[productIndex] = updatedProduct

  return NextResponse.json({
    product: updatedProduct,
    message: "Produit mis à jour avec succès",
  })
}

export const GET = getProducts
export const POST = withAuth(addProduct, ["admin", "pharmacy"])
export const PUT = withAuth(updateProduct, ["admin", "pharmacy"])
