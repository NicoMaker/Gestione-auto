import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { to, maintenance, vehicle } = await request.json()

    // Qui dovresti integrare un servizio SMS come Twilio
    // Per ora simuliamo l'invio

    console.log("Invio SMS a:", to)
    console.log("Veicolo:", vehicle.brand, vehicle.model)
    console.log("Manutenzione:", maintenance.type)
    console.log("Scadenza:", maintenance.dueDate)

    // Esempio con Twilio (da configurare)
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: to,
          From: twilioNumber,
          Body: `Manutenzione in scadenza: ${maintenance.type} per ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) il ${new Date(maintenance.dueDate).toLocaleDateString('it-IT')}`
        })
      }
    )
    */

    // Simulazione successo
    return NextResponse.json({
      success: true,
      message: "SMS inviato con successo (simulato)",
    })
  } catch (error) {
    console.error("Errore invio SMS:", error)
    return NextResponse.json({ success: false, error: "Errore invio SMS" }, { status: 500 })
  }
}
