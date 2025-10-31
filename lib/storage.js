// Database locale usando localStorage

export const DB_KEYS = {
  VEHICLES: "vehicles",
  MAINTENANCES: "maintenances",
}

// Funzioni per gestire i veicoli
export const getVehicles = () => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(DB_KEYS.VEHICLES)
  return data ? JSON.parse(data) : []
}

export const saveVehicle = (vehicle) => {
  const vehicles = getVehicles()
  const existingIndex = vehicles.findIndex((v) => v.id === vehicle.id)

  if (existingIndex >= 0) {
    vehicles[existingIndex] = vehicle
  } else {
    vehicle.id = Date.now().toString()
    vehicle.createdAt = new Date().toISOString()
    vehicles.push(vehicle)
  }

  localStorage.setItem(DB_KEYS.VEHICLES, JSON.stringify(vehicles))
  return vehicle
}

export const deleteVehicle = (vehicleId) => {
  const vehicles = getVehicles().filter((v) => v.id !== vehicleId)
  localStorage.setItem(DB_KEYS.VEHICLES, JSON.stringify(vehicles))

  // Elimina anche le manutenzioni associate
  const maintenances = getMaintenances().filter((m) => m.vehicleId !== vehicleId)
  localStorage.setItem(DB_KEYS.MAINTENANCES, JSON.stringify(maintenances))
}

// Funzioni per gestire le manutenzioni
export const getMaintenances = () => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(DB_KEYS.MAINTENANCES)
  return data ? JSON.parse(data) : []
}

export const saveMaintenance = (maintenance) => {
  const maintenances = getMaintenances()
  const existingIndex = maintenances.findIndex((m) => m.id === maintenance.id)

  if (existingIndex >= 0) {
    maintenances[existingIndex] = maintenance
  } else {
    maintenance.id = Date.now().toString()
    maintenance.createdAt = new Date().toISOString()
    maintenances.push(maintenance)
  }

  localStorage.setItem(DB_KEYS.MAINTENANCES, JSON.stringify(maintenances))
  return maintenance
}

export const deleteMaintenance = (maintenanceId) => {
  const maintenances = getMaintenances().filter((m) => m.id !== maintenanceId)
  localStorage.setItem(DB_KEYS.MAINTENANCES, JSON.stringify(maintenances))
}

export const getMaintenancesByVehicle = (vehicleId) => {
  return getMaintenances().filter((m) => m.vehicleId === vehicleId)
}
