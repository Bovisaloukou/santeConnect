import type { Metadata } from "next"
import PharmaciesClient from "./PharmaciesClient"

export const metadata: Metadata = {
  title: "Pharmacies - SantéConnect",
  description: "Trouvez facilement une pharmacie partenaire de SantéConnect près de chez vous.",
}

export default function PharmaciesPage() {
  return <PharmaciesClient />
}
