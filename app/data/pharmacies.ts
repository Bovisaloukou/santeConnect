export interface Medicament {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image: string;
  necessiteOrdonnance: boolean;
  stock: number;
  categorie: string;
  pharmacies: string[]; // IDs des pharmacies où le médicament est disponible
}

export interface Pharmacie {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  horaires: {
    lundi: string;
    mardi: string;
    mercredi: string;
    jeudi: string;
    vendredi: string;
    samedi: string;
    dimanche: string;
  };
  services: string[];
  position: {
    lat: number;
    lng: number;
  };
}

export const medicaments: Medicament[] = [
  {
    id: "1",
    nom: "Paracétamol 500mg",
    description: "Antidouleur et antipyrétique",
    prix: 150,
    image: "/medicaments/paracetamol.jpg",
    necessiteOrdonnance: false,
    stock: 100,
    categorie: "Antidouleur",
    pharmacies: ["1", "2", "3", "4"]
  },
  {
    id: "2",
    nom: "Ibuprofène 400mg",
    description: "Anti-inflammatoire non stéroïdien",
    prix: 250,
    image: "/medicaments/ibuprofene.jpg",
    necessiteOrdonnance: false,
    stock: 75,
    categorie: "Anti-inflammatoire",
    pharmacies: ["1", "2", "4"]
  },
  {
    id: "3",
    nom: "Amoxicilline 500mg",
    description: "Antibiotique à large spectre",
    prix: 3500,
    image: "/medicaments/amoxicilline.jpg",
    necessiteOrdonnance: true,
    stock: 50,
    categorie: "Antibiotique",
    pharmacies: ["1", "3"]
  },
  {
    id: "4",
    nom: "Doliprane 1000mg",
    description: "Antidouleur et antipyrétique à forte dose",
    prix: 300,
    image: "/medicaments/doliprane.jpg",
    necessiteOrdonnance: false,
    stock: 120,
    categorie: "Antidouleur",
    pharmacies: ["2", "3", "4"]
  },
  {
    id: "5",
    nom: "Spasfon",
    description: "Antispasmodique",
    prix: 450,
    image: "/medicaments/spasfon.jpg",
    necessiteOrdonnance: false,
    stock: 85,
    categorie: "Antispasmodique",
    pharmacies: ["1", "2", "3"]
  },
  {
    id: "6",
    nom: "Ventoline",
    description: "Bronchodilatateur",
    prix: 8500,
    image: "/medicaments/ventoline.jpg",
    necessiteOrdonnance: true,
    stock: 45,
    categorie: "Respiratoire",
    pharmacies: ["2", "3", "4"]
  }
];

export const pharmacies: Pharmacie[] = [
  {
    id: "1",
    nom: "Pharmacie Camp Ghézo",
    adresse: "08 BP 795 Cotonou",
    ville: "Cotonou",
    codePostal: "08 BP 795",
    telephone: "21 31 35 35",
    email: "contact@pharmaciecampguezo.net",
    horaires: {
      lundi: "24h/24",
      mardi: "24h/24",
      mercredi: "24h/24",
      jeudi: "24h/24",
      vendredi: "24h/24",
      samedi: "24h/24",
      dimanche: "24h/24"
    },
    services: ["Allopathie", "Cosmétique", "Génériques", "Homéopathie", "Hygiène", "Produits vétérinaires", "Zone assurance", "Zone bébé", "Zone cosmétique", "Zone orthopédique"],
    position: {
      lat: 6.3667,
      lng: 2.4333
    }
  },
  {
    id: "2",
    nom: "Pharmacie La Béninoise",
    adresse: "Cotonou",
    ville: "Cotonou",
    codePostal: "BP 40",
    telephone: "60 50 29 56",
    email: "pharmacielabeninoise40@gmail.com",
    horaires: {
      lundi: "08:00-20:00",
      mardi: "08:00-20:00",
      mercredi: "08:00-20:00",
      jeudi: "08:00-20:00",
      vendredi: "08:00-20:00",
      samedi: "08:00-20:00",
      dimanche: "09:00-13:00"
    },
    services: ["Livraison", "Conseil pharmaceutique", "Vaccination"],
    position: {
      lat: 6.3667,
      lng: 2.4333
    }
  },
  {
    id: "3",
    nom: "Pharmacie de la Paix",
    adresse: "BP 8065 Cotonou",
    ville: "Cotonou",
    codePostal: "BP 8065",
    telephone: "21 33 11 44",
    email: "contact@pharmaciedelapaix.bj",
    horaires: {
      lundi: "08:00-20:00",
      mardi: "08:00-20:00",
      mercredi: "08:00-20:00",
      jeudi: "08:00-20:00",
      vendredi: "08:00-20:00",
      samedi: "08:00-20:00",
      dimanche: "09:00-13:00"
    },
    services: ["Livraison", "Garde", "Conseil pharmaceutique"],
    position: {
      lat: 6.3667,
      lng: 2.4333
    }
  },
  {
    id: "4",
    nom: "Pharmacie Adéchina",
    adresse: "BP 2269 Cotonou",
    ville: "Cotonou",
    codePostal: "BP 2269",
    telephone: "21 32 15 65",
    email: "contact@pharmacieadechina.bj",
    horaires: {
      lundi: "08:00-20:00",
      mardi: "08:00-20:00",
      mercredi: "08:00-20:00",
      jeudi: "08:00-20:00",
      vendredi: "08:00-20:00",
      samedi: "08:00-20:00",
      dimanche: "09:00-13:00"
    },
    services: ["Livraison", "Garde", "Conseil pharmaceutique", "Vaccination"],
    position: {
      lat: 6.3667,
      lng: 2.4333
    }
  },
  {
    id: "5",
    nom: "Pharmacie Agla",
    adresse: "BP 7012 Cotonou",
    ville: "Cotonou",
    codePostal: "BP 7012",
    telephone: "21 38 07 63",
    email: "contact@pharmacieagla.bj",
    horaires: {
      lundi: "08:00-20:00",
      mardi: "08:00-20:00",
      mercredi: "08:00-20:00",
      jeudi: "08:00-20:00",
      vendredi: "08:00-20:00",
      samedi: "08:00-20:00",
      dimanche: "09:00-13:00"
    },
    services: ["Livraison", "Garde", "Conseil pharmaceutique", "Test COVID"],
    position: {
      lat: 6.3667,
      lng: 2.4333
    }
  }
]; 