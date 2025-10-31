import { NextResponse } from "next/server"

export async function POST(request) {
  // Funzionalità rimossa
  return NextResponse.json({ success: false, error: "Funzionalità non più disponibile" }, { status: 404 })
}
