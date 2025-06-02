"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  renewals: number;
}

interface PrescriptionFormProps {
  patientId: string;
  patientName: string;
  onSubmit: (prescription: any) => void;
}

export function PrescriptionForm({ patientId, patientName, onSubmit }: PrescriptionFormProps) {
  const [medications, setMedications] = useState<Medication[]>([{
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    renewals: 0
  }]);

  const [notes, setNotes] = useState("");

  const addMedication = () => {
    setMedications([...medications, {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      renewals: 0
    }]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
    const newMedications = [...medications];
    newMedications[index] = {
      ...newMedications[index],
      [field]: value
    };
    setMedications(newMedications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      patientId,
      patientName,
      medications,
      notes,
      date: new Date().toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle Ordonnance - {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`medication-${index}`}>Médicament</Label>
                    <Input
                      id={`medication-${index}`}
                      value={medication.name}
                      onChange={(e) => updateMedication(index, "name", e.target.value)}
                      placeholder="Nom du médicament"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                    <Input
                      id={`dosage-${index}`}
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      placeholder="ex: 500mg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`frequency-${index}`}>Fréquence</Label>
                    <Select
                      value={medication.frequency}
                      onValueChange={(value) => updateMedication(index, "frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x/jour">1 fois par jour</SelectItem>
                        <SelectItem value="2x/jour">2 fois par jour</SelectItem>
                        <SelectItem value="3x/jour">3 fois par jour</SelectItem>
                        <SelectItem value="4x/jour">4 fois par jour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`duration-${index}`}>Durée</Label>
                    <Input
                      id={`duration-${index}`}
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      placeholder="ex: 7 jours"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`renewals-${index}`}>Renouvellements</Label>
                    <Input
                      id={`renewals-${index}`}
                      type="number"
                      min="0"
                      max="12"
                      value={medication.renewals}
                      onChange={(e) => updateMedication(index, "renewals", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addMedication}>
            Ajouter un médicament
          </Button>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes et recommandations</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes additionnelles, recommandations..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Annuler
            </Button>
            <Button type="submit">
              Valider l'ordonnance
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 