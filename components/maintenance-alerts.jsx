"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Mail, MessageSquare } from "lucide-react"
import { saveMaintenance, getSettings } from "@/lib/storage"
import { sendEmailNotification, sendSmsNotification } from "@/lib/notifications"

export default function MaintenanceAlerts({ alerts, onRefresh }) {
  const handleMarkComplete = (alert) => {
    const updatedMaintenance = {
      ...alert.maintenance,
      completed: true,
      completedAt: new Date().toISOString(),
    }
    saveMaintenance(updatedMaintenance)
    onRefresh()
  }

  const handleSendEmail = async (alert) => {
    const settings = getSettings()
    if (!settings.email) {
      alert("Configura la tua email nelle impostazioni")
      return
    }

    const success = await sendEmailNotification(settings.email, alert.maintenance, alert.vehicle)
    if (success) {
      alert("Email inviata con successo")
    } else {
      alert("Errore invio email. Verifica le impostazioni.")
    }
  }

  const handleSendSms = async (alert) => {
    const settings = getSettings()
    if (!settings.phone) {
      alert("Configura il tuo numero nelle impostazioni")
      return
    }

    const success = await sendSmsNotification(settings.phone, alert.maintenance, alert.vehicle)
    if (success) {
      alert("SMS inviato con successo")
    } else {
      alert("Errore invio SMS. Verifica le impostazioni.")
    }
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
                <Button size="sm" variant="outline" onClick={() => handleSendEmail(alert)} title="Invia Email">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSendSms(alert)} title="Invia SMS">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => handleMarkComplete(alert)} className="bg-green-600 hover:bg-green-700">
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
