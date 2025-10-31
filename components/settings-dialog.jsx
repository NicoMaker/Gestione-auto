"use client"

import { toast } from "react-hot-toast"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { saveSettings } from "@/lib/storage"
import { requestNotificationPermission } from "@/lib/notifications"

export default function SettingsDialog({ open, onClose, settings, onSave }) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.notificationsEnabled) {
      try {
        await requestNotificationPermission()
      } catch (error) {
        toast.error("Impossibile abilitare le notifiche browser.")
      }
    }

    saveSettings(formData)
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Impostazioni</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email per Notifiche</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tua@email.com"
            />
            <p className="text-xs text-slate-500 mt-1">Riceverai notifiche email per le scadenze</p>
          </div>

          <div>
            <Label htmlFor="phone">Numero per SMS</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+39 123 456 7890"
            />
            <p className="text-xs text-slate-500 mt-1">Riceverai notifiche SMS per le scadenze</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="notifications">Notifiche Browser</Label>
              <p className="text-xs text-slate-500">Abilita le notifiche del browser</p>
            </div>
            <Switch
              id="notifications"
              checked={formData.notificationsEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, notificationsEnabled: checked })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Annulla
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Salva Impostazioni
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
