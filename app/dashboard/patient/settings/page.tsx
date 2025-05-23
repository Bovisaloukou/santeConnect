import { Switch } from "@/components/ui/switch"

export default function PatientSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
      {/* Nouvelle section pour l'authentification à deux facteurs */}
      <div className="flex items-center space-x-2 mt-4">
        <Switch id="two-factor" />
        <label htmlFor="two-factor">Activer l'authentification à deux facteurs</label>
      </div>
    </div>
  );
} 