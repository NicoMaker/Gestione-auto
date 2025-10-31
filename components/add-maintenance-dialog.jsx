"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveMaintenance } from "@/lib/storage"

const MAINTENANCE_TYPES = [
  "Collaudo",
  "Cambio Olio",
  "Tagliando",
  "Revisione",
  "Cambio Gomme",
  "Freni",
  "Filtri",
  "Altro",
]

export default function AddMaintenanceDialog({ open, onClose, vehicle, onSave }) {
  const [formData, setFormData] = useState({
    type: "",
    dueDate: "",
    dueKm: "",
    notifyDaysBefore: "7",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const maintenance = {
      vehicleId: vehicle.id,
      type: formData.type,
      dueDate: formData.dueDate,
      dueKm: formData.dueKm ? Number.parseInt(formData.dueKm) : null,
      notifyDaysBefore: Number.parseInt(formData.notifyDaysBefore),
      notes: formData.notes,
      completed: false,
    }

    saveMaintenance(maintenance)
    onSave()
    onClose()

    setFormData({
      type: "",
      dueDate: "",
      dueKm: "",
      notifyDaysBefore: "7",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Aggiungi Manutenzione</DialogTitle>
          <p className="text-sm text-slate-600">
            {vehicle?.brand} {vehicle?.model} - {vehicle?.plate}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo Manutenzione</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>
              <SelectContent>
                {MAINTENANCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate">Data Scadenza</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="dueKm">Km Scadenza (opzionale)</Label>
            <Input
              id="dueKm"
              type="number"
              value={formData.dueKm}
              onChange={(e) => setFormData({ ...formData, dueKm: e.target.value })}
              placeholder="es. 60000"
            />
          </div>

          <div>
            <Label htmlFor="notifyDaysBefore">Avvisa con (giorni di anticipo)</Label>
            <Input
              id="notifyDaysBefore"
              type="number"
              value={formData.notifyDaysBefore}
              onChange={(e) => setFormData({ ...formData, notifyDaysBefore: e.target.value })}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Aggiungi note..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Annulla
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Salva Manutenzione
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
