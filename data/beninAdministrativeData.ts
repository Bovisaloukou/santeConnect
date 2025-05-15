// Interfaces pour les données administratives du Bénin
export interface DepartementData {
  departement: string;
  communes: string[];
}

// Données des départements et communes du Bénin
export const beninAdministrativeData: DepartementData[] = [
  {
    "departement": "Alibori",
    "communes": ["Banikoara", "Gogounou", "Kandi", "Karimama", "Malanville", "Segbana"]
  },
  {
    "departement": "Atacora",
    "communes": ["Boukoumbé", "Cobly", "Kérou", "Kouandé", "Matéri", "Natitingou", "Péhunco", "Tanguiéta", "Toucountouna"]
  },
  {
    "departement": "Atlantique",
    "communes": ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "Sô-Ava", "Toffo", "Tori-Bossito", "Zè"]
  },
  {
    "departement": "Borgou",
    "communes": ["Bembéréké", "Kalalé", "N'Dali", "Nikki", "Parakou", "Pèrèrè", "Sinendé", "Tchaourou"]
  },
  {
    "departement": "Collines",
    "communes": ["Bantè", "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savalou", "Savè"]
  },
  {
    "departement": "Couffo",
    "communes": ["Aplahoué", "Djakotomey", "Dogbo", "Klouékanmè", "Lalo", "Toviklin"]
  },
  {
    "departement": "Donga",
    "communes": ["Bassila", "Copargo", "Djougou", "Ouaké"]
  },
  {
    "departement": "Littoral",
    "communes": ["Cotonou"]
  },
  {
    "departement": "Mono",
    "communes": ["Athiémé", "Bopa", "Comè", "Grand-Popo", "Houéyogbé", "Lokossa"]
  },
  {
    "departement": "Ouémé",
    "communes": ["Adjarra", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Porto-Novo", "Sèmè-Kpodji"]
  },
  {
    "departement": "Plateau",
    "communes": ["Adja-Ouèrè", "Ifangni", "Kétou", "Pobè", "Sakété"]
  },
  {
    "departement": "Zou",
    "communes": ["Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", "Ouinhi", "Zagnanado", "Za-Kpota", "Zogbodomey"]
  }
]; 