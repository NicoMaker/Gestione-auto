"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function SettingsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Impostazioni</DialogTitle>
        </DialogHeader>
        <p className="text-slate-600">Questa sezione è stata rimossa.</p>
      </DialogContent>
    </Dialog>
  )
}
