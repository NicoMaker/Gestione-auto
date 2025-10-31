"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
  "Frizione",
  "Freni",
  "Filtri",
  "Altro",
]

export default function EditMaintenanceDialog({ open, onClose, maintenance, onSave }) {
  const [formData, setFormData] = useState({
    type: "",
    dueDate: "",
    dueKm: "",
    notifyDaysBefore: 7,
    notes: "",
  })

  useEffect(() => {
    if (maintenance) {
      // Formatta la data per l'input type="date"
      const formattedDate = maintenance.dueDate ? new Date(maintenance.dueDate).toISOString().split("T")[0] : ""
      setFormData({ ...maintenance, dueDate: formattedDate, dueKm: maintenance.dueKm || "" })
    }
  }, [maintenance])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const maintenanceToSave = {
      ...formData,
      dueKm: formData.dueKm ? Number(formData.dueKm) : null,
      notifyDaysBefore: formData.notifyDaysBefore ? Number(formData.notifyDaysBefore) : 7, // Default a 7 se non specificato
    }
    saveMaintenance(maintenanceToSave)
    onSave() // onSave ora gestirà anche la chiusura
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Modifica Manutenzione</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo di Manutenzione</Label>
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
            <Input id="dueDate" type="date" value={formData.dueDate || ""} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dueKm">Chilometraggio Scadenza (opzionale)</Label>
            <Input id="dueKm" type="number" value={formData.dueKm || ""} onChange={handleChange} placeholder="Es. 150000" />
          </div>
          <div>
            <Label htmlFor="notifyDaysBefore">Giorni di preavviso</Label>
            <Input
              id="notifyDaysBefore"
              type="number"
              value={formData.notifyDaysBefore ?? 7}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Input id="notes" value={formData.notes || ""} onChange={handleChange} placeholder="Aggiungi note..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salva Modifiche
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}