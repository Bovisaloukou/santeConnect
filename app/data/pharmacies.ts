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
    prix: 2.50,
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
    prix: 3.20,
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
    prix: 5.80,
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
    prix: 3.90,
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
    prix: 4.20,
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
    prix: 6.50,
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
    nom: "Pharmacie du Centre",
    adresse: "15 rue de la Paix",
    ville: "Paris",
    codePostal: "75001",
    telephone: "01 23 45 67 89",
    email: "contact@pharmacieducentre.fr",
    horaires: {
      lundi: "09:00-19:00",
      mardi: "09:00-19:00",
      mercredi: "09:00-19:00",
      jeudi: "09:00-19:00",
      vendredi: "09:00-19:00",
      samedi: "09:00-12:00",
      dimanche: "Fermé"
    },
    services: ["Livraison", "Garde", "Conseil pharmaceutique"],
    position: {
      lat: 48.8566,
      lng: 2.3522
    }
  },
  {
    id: "2",
    nom: "Pharmacie de la Gare",
    adresse: "25 avenue de la République",
    ville: "Paris",
    codePostal: "75011",
    telephone: "01 98 76 54 32",
    email: "contact@pharmaciedelagare.fr",
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
      lat: 48.8566,
      lng: 2.3522
    }
  },
  {
    id: "3",
    nom: "Pharmacie Saint-Michel",
    adresse: "8 boulevard Saint-Michel",
    ville: "Paris",
    codePostal: "75005",
    telephone: "01 43 54 65 76",
    email: "contact@pharmaciesaintmichel.fr",
    horaires: {
      lundi: "08:30-20:00",
      mardi: "08:30-20:00",
      mercredi: "08:30-20:00",
      jeudi: "08:30-20:00",
      vendredi: "08:30-20:00",
      samedi: "09:00-19:00",
      dimanche: "Fermé"
    },
    services: ["Livraison", "Garde", "Conseil pharmaceutique", "Vaccination", "Test COVID"],
    position: {
      lat: 48.8534,
      lng: 2.3488
    }
  },
  {
    id: "4",
    nom: "Pharmacie des Batignolles",
    adresse: "12 rue des Batignolles",
    ville: "Paris",
    codePostal: "75017",
    telephone: "01 42 63 74 85",
    email: "contact@pharmaciedesbatignolles.fr",
    horaires: {
      lundi: "09:00-19:30",
      mardi: "09:00-19:30",
      mercredi: "09:00-19:30",
      jeudi: "09:00-19:30",
      vendredi: "09:00-19:30",
      samedi: "09:00-19:00",
      dimanche: "Fermé"
    },
    services: ["Livraison", "Garde", "Conseil pharmaceutique", "Test COVID", "Médecine naturelle"],
    position: {
      lat: 48.8841,
      lng: 2.3219
    }
  }
]; 