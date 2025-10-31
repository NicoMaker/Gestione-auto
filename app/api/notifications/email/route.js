import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { to, maintenance, vehicle, notificationType } = await request.json()

    // Qui dovresti integrare un servizio email come SendGrid, Resend, o Nodemailer
    // Per ora simuliamo l'invio

    let subject, body

    if (notificationType === "completion") {
      subject = `Manutenzione Completata: ${vehicle.brand} ${vehicle.model}`
      body = `La manutenzione "${maintenance.type}" per il veicolo ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) è stata completata in data ${new Date().toLocaleDateString("it-IT")}.`
    } else { // "due_date" o non specificato
      // Messaggio di default per la scadenza
      subject = `Manutenzione in scadenza: ${vehicle.brand} ${vehicle.model}`
      body = `La manutenzione "${maintenance.type}" per il veicolo ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) è in scadenza il ${new Date(maintenance.dueDate).toLocaleDateString("it-IT")}.`
    }

    console.log("Invio email a:", to, "Tipo:", notificationType || "scadenza")

    // Esempio con fetch a un servizio email (da configurare)
    // const apiKey = process.env.SENDGRID_API_KEY;
    // if (!apiKey) {
    //   throw new Error("SENDGRID_API_KEY non è configurata");
    // }

    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: to }] }],
    //     from: { email: 'noreply@tuodominio.com', name: 'Gestione Auto' },
    //     subject: subject,
    //     content: [{
    //       type: 'text/plain', 
    //       value: body
    //     }]
    //   })
    // });
    // if (!response.ok) throw new Error("Errore durante l'invio dell'email");

    // Simulazione successo
    return NextResponse.json({
      success: true,
      message: "Email inviata con successo (simulato)",
    })
  } catch (error) {
    console.error("Errore invio email:", error)
    return NextResponse.json({ success: false, error: "Errore invio email" }, { status: 500 })
  }
}
