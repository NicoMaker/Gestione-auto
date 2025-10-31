"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Plus, Car, Bell, AlertTriangle } from "lucide-react"
import { getVehicles, getMaintenances } from "@/lib/storage"
import { checkAllMaintenances, requestNotificationPermission, showBrowserNotification } from "@/lib/notifications"
import VehicleList from "@/components/vehicle-list"
import AddVehicleDialog from "@/components/add-vehicle-dialog"
import MaintenanceAlerts from "@/components/maintenance-alerts"
import SettingsDialog from "@/components/settings-dialog"

export default function HomePage() {
  const [vehicles, setVehicles] = useState([])
  const [maintenances, setMaintenances] = useState([])
  const [alerts, setAlerts] = useState([])
  const [notifiedAlerts, setNotifiedAlerts] = useState(new Set())
  const [showAddVehicle, setShowAddVehicle] = useState(false)

  useEffect(() => {
    loadData()
    requestNotificationPermission()

    // Controlla le scadenze ogni 5 minuti
    const interval = setInterval(
      () => {
        checkMaintenancesAndNotify()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    const vehiclesData = getVehicles()
    const maintenancesData = getMaintenances()

    setVehicles(vehiclesData)
    setMaintenances(maintenancesData)

    const alertsData = checkAllMaintenances(vehiclesData, maintenancesData)
    setAlerts(alertsData)
  }

  const checkMaintenancesAndNotify = () => {
    const vehiclesData = getVehicles() 
    const maintenancesData = getMaintenances() 

    const alertsData = checkAllMaintenances(vehiclesData, maintenancesData)
    setAlerts(alertsData)
    if (alertsData.length > 0) {
      const newNotifiedAlerts = new Set(notifiedAlerts)
      alertsData.forEach((alert) => {
        const alertId = `${alert.vehicle.id}-${alert.maintenance.id}`
        // Invia la notifica solo se non è già stata inviata per questa scadenza
        if (!notifiedAlerts.has(alertId)) {
          showBrowserNotification(
            `Manutenzione in scadenza: ${alert.vehicle.brand} ${alert.vehicle.model}`,
            `${alert.maintenance.type} - ${alert.reason}`,
          )
          newNotifiedAlerts.add(alertId)
        }
      })
      // Aggiorna lo stato delle notifiche inviate
      setNotifiedAlerts(newNotifiedAlerts)
    }
  }

  const stats = {
    totalVehicles: vehicles.length,
    totalMaintenances: maintenances.length,
    activeAlerts: alerts.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestione Auto</h1>
                <p className="text-sm text-slate-600">Sistema di manutenzione veicoli</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Veicoli Totali</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalVehicles}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Manutenzioni</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalMaintenances}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Scadenze Attive</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeAlerts}</p>
              </div>
              <div className={`p-3 rounded-lg ${stats.activeAlerts > 0 ? "bg-red-100" : "bg-slate-100"}`}>
                <AlertTriangle className={`w-6 h-6 ${stats.activeAlerts > 0 ? "text-red-600" : "text-slate-400"}`} />
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && <MaintenanceAlerts alerts={alerts} onRefresh={loadData} />}

        {/* Vehicles Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">I Tuoi Veicoli</h2>
          <Button onClick={() => setShowAddVehicle(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Veicolo
          </Button>
        </div>

        <VehicleList vehicles={vehicles} maintenances={maintenances} onRefresh={loadData} />

        {vehicles.length === 0 && (
          <Card className="p-12 text-center bg-white border-slate-200">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nessun veicolo</h3>
            <p className="text-slate-600 mb-6">Inizia aggiungendo il tuo primo veicolo</p>
            <Button onClick={() => setShowAddVehicle(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Veicolo
            </Button>
          </Card>
        )}
      </main>

      {/* Dialogs */}
      <AddVehicleDialog open={showAddVehicle} onClose={() => setShowAddVehicle(false)} onSave={loadData} />

    </div>
  )
}
