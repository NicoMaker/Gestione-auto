import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { to, maintenance, vehicle, notificationType } = await request.json()

    // Qui dovresti integrare un servizio SMS come Twilio
    // Per ora simuliamo l'invio

    let body

    if (notificationType === "completion") {
      body = `Manutenzione completata: ${maintenance.type} per ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) in data ${new Date().toLocaleDateString("it-IT")}.`
    } else { // "due_date" o non specificato
      // Messaggio di default per la scadenza
      body = `Manutenzione in scadenza: ${maintenance.type} per ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) il ${new Date(maintenance.dueDate).toLocaleDateString("it-IT")}`
    }

    console.log("Invio SMS a:", to, "Tipo:", notificationType || "scadenza")

    // Esempio con Twilio (da configurare)
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const twilioNumber = process.env.TWILIO_PHONE_NUMBER;


    // if (!accountSid || !authToken || !twilioNumber) {
    //   throw new Error("Credenziali Twilio non configurate");
    // }

    // const response = await fetch(
    //   `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: new URLSearchParams({
    //       To: to,
    //       From: twilioNumber,
    //       Body: body
    //     })
    //   }
    // );
    // if (!response.ok) throw new Error("Errore durante l'invio dell'SMS");

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
