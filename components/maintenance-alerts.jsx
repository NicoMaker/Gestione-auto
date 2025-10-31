"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { saveMaintenance } from "@/lib/storage"

export default function MaintenanceAlerts({ alerts, onRefresh }) {
  const [loadingStates, setLoadingStates] = useState({})

  const handleMarkComplete = async (alert) => {
    const alertId = alert.maintenance.id
    setLoadingStates((prev) => ({ ...prev, [alertId]: true }))

    const updatedMaintenance = {
      ...alert.maintenance,
      completed: true,
      completedAt: new Date().toISOString(),
    }
    saveMaintenance(updatedMaintenance)
    toast.success("Manutenzione completata!")
    onRefresh()
    setLoadingStates((prev) => ({ ...prev, [alertId]: false }))
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-bold text-slate-900">Scadenze in Arrivo</h2>
        </div>
        <Card className="p-6 text-center bg-slate-50">
          <p className="text-slate-600">Nessuna scadenza imminente. Ottimo lavoro!</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-bold text-slate-900">Scadenze in Arrivo</h2>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <Card key={index} className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">
                    {alert.vehicle.brand} {alert.vehicle.model}
                  </h3>
                  <span className="text-sm text-slate-600">({alert.vehicle.plate})</span>
                </div>
                <p className="text-sm font-medium text-red-700 mb-1">{alert.maintenance.type}</p>
                <p className="text-sm text-slate-600">{alert.reason}</p>
                {alert.maintenance.notes && (
                  <p className="text-sm text-slate-500 mt-1 italic">{alert.maintenance.notes}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleMarkComplete(alert)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loadingStates[alert.maintenance.id]}>
                  Completata
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
