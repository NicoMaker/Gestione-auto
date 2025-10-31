// Sistema di notifiche

export const checkMaintenanceDue = (maintenance, currentKm) => {
  const now = new Date()
  const dueDate = new Date(maintenance.dueDate)
  const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  let isDue = false
  let reason = ""
  let kmUntil = null

  // Controlla la data
  if (daysUntil <= maintenance.notifyDaysBefore && daysUntil > 0) {
    isDue = true
    reason = `Scadenza tra ${daysUntil} giorni`
  } else if (daysUntil === 0) {
    isDue = true
    reason = `Scade oggi`
  } else if (daysUntil === 1) {
    isDue = true
    reason = `Scade domani`
  }else if (daysUntil < 0) {
    isDue = true
    reason = `Scaduto da ${Math.abs(daysUntil)} giorni`
  }

  // Controlla i km se applicabile
  if (maintenance.dueKm && currentKm) {
    kmUntil = maintenance.dueKm - currentKm
    if (kmUntil <= 1000 && kmUntil >= 0) {
      isDue = true
      reason = reason ? `${reason} e ${kmUntil} km` : `Mancano ${kmUntil} km`
    } else if (kmUntil < 0) {
      isDue = true
      reason = reason ? `${reason} e superato di ${Math.abs(kmUntil)} km` : `Superato di ${Math.abs(kmUntil)} km`
    }
  }

  return { isDue, daysUntil, kmUntil, reason }
}

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser non supporta le notifiche")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export const showBrowserNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/car-maintenance-icon.png", // Assicurati che questa icona esista in /public
      badge: "/notification-badge.png", // Assicurati che questo badge esista in /public
    })
  }
}

export const checkAllMaintenances = (vehicles, maintenances) => {
  const alerts = []

  vehicles.forEach((vehicle) => {
    const vehicleMaintenances = maintenances.filter((m) => m.vehicleId === vehicle.id)

    vehicleMaintenances.forEach((maintenance) => {
      // Salta le manutenzioni già completate
      if (maintenance.completed) return

      const check = checkMaintenanceDue(maintenance, vehicle.currentKm)

      if (check.isDue) {
        alerts.push({
          vehicle,
          maintenance,
          ...check,
        })
      }
    })
  })

  return alerts
}
