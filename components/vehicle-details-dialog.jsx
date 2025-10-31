"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar, Gauge, Trash2, CheckCircle2, Circle } from "lucide-react"
import { saveVehicle, deleteMaintenance, saveMaintenance } from "@/lib/storage"
import { checkMaintenanceDue } from "@/lib/notifications"

export default function VehicleDetailsDialog({ open, onClose, vehicle, maintenances, onRefresh }) {
  const [currentKm, setCurrentKm] = useState(vehicle.currentKm || 0)

  const handleUpdateKm = () => {
    const updatedVehicle = {
      ...vehicle,
      currentKm: Number.parseInt(currentKm),
    }
    saveVehicle(updatedVehicle)
    onRefresh()
  }

  const handleDeleteMaintenance = (maintenanceId) => {
    if (confirm("Sei sicuro di voler eliminare questa manutenzione?")) {
      deleteMaintenance(maintenanceId)
      onRefresh()
    }
  }

  const handleToggleComplete = (maintenance) => {
    const updatedMaintenance = {
      ...maintenance,
      completed: !maintenance.completed,
      completedAt: !maintenance.completed ? new Date().toISOString() : null,
    }
    saveMaintenance(updatedMaintenance)
    onRefresh()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle.brand} {vehicle.model}
          </DialogTitle>
          <p className="text-sm text-slate-600">
            {vehicle.plate} - Anno {vehicle.year}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Update KM */}
          <Card className="p-4 bg-slate-50 border-slate-200">
            <Label htmlFor="updateKm" className="mb-2 block">
              Aggiorna Chilometraggio
            </Label>
            <div className="flex gap-2">
              <Input
                id="updateKm"
                type="number"
                value={currentKm}
                onChange={(e) => setCurrentKm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUpdateKm} className="bg-blue-600 hover:bg-blue-700">
                Aggiorna
              </Button>
            </div>
          </Card>

          {/* Maintenances List */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Manutenzioni Programmate</h3>

            {maintenances.length === 0 ? (
              <Card className="p-6 text-center bg-slate-50 border-slate-200">
                <p className="text-slate-600">Nessuna manutenzione programmata</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {maintenances.map((maintenance) => {
                  const check = checkMaintenanceDue(maintenance, vehicle.currentKm)
                  const isOverdue = check.daysUntil < 0

                  return (
                    <Card
                      key={maintenance.id}
                      className={`p-4 ${
                        maintenance.completed
                          ? "bg-green-50 border-green-200"
                          : check.isDue
                            ? "bg-red-50 border-red-200"
                            : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => handleToggleComplete(maintenance)} className="flex-shrink-0">
                              {maintenance.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                            <h4
                              className={`font-bold ${maintenance.completed ? "line-through text-slate-500" : "text-slate-900"}`}
                            >
                              {maintenance.type}
                            </h4>
                          </div>

                          <div className="space-y-1 ml-7">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              <span>Scadenza: {formatDate(maintenance.dueDate)}</span>
                              {!maintenance.completed && (
                                <span className={isOverdue ? "text-red-600 font-medium" : "text-slate-500"}>
                                  (
                                  {check.daysUntil >= 0
                                    ? `tra ${check.daysUntil} giorni`
                                    : `scaduto da ${Math.abs(check.daysUntil)} giorni`}
                                  )
                                </span>
                              )}
                            </div>

                            {maintenance.dueKm && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Gauge className="w-4 h-4" />
                                <span>Km: {maintenance.dueKm.toLocaleString()}</span>
                                {check.kmUntil !== null && !maintenance.completed && (
                                  <span className={check.kmUntil < 0 ? "text-red-600 font-medium" : "text-slate-500"}>
                                    (
                                    {check.kmUntil >= 0
                                      ? `mancano ${check.kmUntil} km`
                                      : `superato di ${Math.abs(check.kmUntil)} km`}
                                    )
                                  </span>
                                )}
                              </div>
                            )}

                            {maintenance.notes && <p className="text-sm text-slate-500 italic">{maintenance.notes}</p>}

                            {maintenance.completed && maintenance.completedAt && (
                              <p className="text-sm text-green-600">
                                Completata il {formatDate(maintenance.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMaintenance(maintenance.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
