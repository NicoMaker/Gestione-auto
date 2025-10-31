"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveVehicle } from "@/lib/storage"

const INITIAL_STATE = {
  brand: "",
  model: "",
  plate: "",
  year: "",
  currentKm: "",
}

export default function AddVehicleDialog({ open, onClose, onSave, vehicleToEdit }) {
  const [formData, setFormData] = useState(INITIAL_STATE)

  const isEditing = !!vehicleToEdit

  useEffect(() => {
    if (isEditing) {
      setFormData(vehicleToEdit)
    } else {
      setFormData(INITIAL_STATE)
    }
  }, [vehicleToEdit, open])

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const vehicle = {
      ...formData,
      id: isEditing ? vehicleToEdit.id : undefined, // Mantieni l'ID se stiamo modificando
      year: Number(formData.year),
      currentKm: Number(formData.currentKm) || 0,
    }

    saveVehicle(vehicle)
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifica Veicolo" : "Aggiungi Nuovo Veicolo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="es. Fiat"
              required
            />
          </div>

          <div>
            <Label htmlFor="model">Modello</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="es. Panda"
              required
            />
          </div>

          <div>
            <Label htmlFor="plate">Targa</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
              placeholder="es. AB123CD"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Anno</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2020"
                required
              />
            </div>

            <div>
              <Label htmlFor="currentKm">Km Attuali</Label>
              <Input
                id="currentKm"
                type="number"
                value={formData.currentKm}
                onChange={(e) => setFormData({ ...formData, currentKm: e.target.value })}
                placeholder="50000"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Annulla
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">              
              Salva Veicolo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
