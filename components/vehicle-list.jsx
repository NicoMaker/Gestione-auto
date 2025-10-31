"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Trash2, Plus, Calendar, Gauge } from "lucide-react"
import { deleteVehicle } from "@/lib/storage"
import { useState } from "react"
import VehicleDetailsDialog from "./vehicle-details-dialog"
import AddMaintenanceDialog from "./add-maintenance-dialog"

export default function VehicleList({ vehicles, maintenances, onRefresh }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddMaintenance, setShowAddMaintenance] = useState(false)

  const handleDelete = (vehicleId) => {
    if (confirm("Sei sicuro di voler eliminare questo veicolo?")) {
      deleteVehicle(vehicleId)
      onRefresh()
    }
  }

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowDetails(true)
  }

  const handleAddMaintenance = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowAddMaintenance(true)
  }

  const getVehicleMaintenances = (vehicleId) => {
    return maintenances.filter((m) => m.vehicleId === vehicleId)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => {
          const vehicleMaintenances = getVehicleMaintenances(vehicle.id)

          return (
            <Card key={vehicle.id} className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-slate-600">{vehicle.plate}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Gauge className="w-4 h-4" />
                  <span>{vehicle.currentKm?.toLocaleString() || 0} km</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{vehicleMaintenances.length} manutenzioni</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleViewDetails(vehicle)} variant="outline" className="flex-1">
                  Dettagli
                </Button>
                <Button onClick={() => handleAddMaintenance(vehicle)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Manutenzione
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedVehicle && (
        <>
          <VehicleDetailsDialog
            open={showDetails}
            onClose={() => {
              setShowDetails(false)
              setSelectedVehicle(null)
            }}
            vehicle={selectedVehicle}
            maintenances={getVehicleMaintenances(selectedVehicle.id)}
            onRefresh={onRefresh}
          />

          <AddMaintenanceDialog
            open={showAddMaintenance}
            onClose={() => {
              setShowAddMaintenance(false)
              setSelectedVehicle(null)
            }}
            vehicle={selectedVehicle}
            onSave={onRefresh}
          />
        </>
      )}
    </>
  )
}
