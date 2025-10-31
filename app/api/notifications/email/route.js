import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { to, maintenance, vehicle } = await request.json()

    // Qui dovresti integrare un servizio email come SendGrid, Resend, o Nodemailer
    // Per ora simuliamo l'invio

    console.log("Invio email a:", to)
    console.log("Veicolo:", vehicle.brand, vehicle.model)
    console.log("Manutenzione:", maintenance.type)
    console.log("Scadenza:", maintenance.dueDate)

    // Esempio con fetch a un servizio email (da configurare)
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: { email: 'noreply@tuodominio.com' },
        subject: `Manutenzione in scadenza: ${vehicle.brand} ${vehicle.model}`,
        content: [{
          type: 'text/plain',
          value: `La manutenzione "${maintenance.type}" per il veicolo ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) è in scadenza il ${new Date(maintenance.dueDate).toLocaleDateString('it-IT')}.`
        }]
      })
    })
    */

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
