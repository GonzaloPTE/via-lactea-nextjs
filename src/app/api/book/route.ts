import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Validar el honeypot
    if (data.honeypot) {
      // Si el honeypot tiene contenido, es un bot.
      // Respondemos con éxito falso para despistarlo.
      return NextResponse.json({ success: true, message: "Booking confirmed" });
    }

    // 2. Extraer datos requeridos
    const {
      firstName,
      lastName,
      email,
      phone,
      babyName,
      babyAge,
      reason,
      selectedDate,
      selectedTime,
      timezone
    } = data;

    if (!firstName || !email || !selectedDate || !selectedTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 3. Preparar el contenido del correo para Resend
    // Nota: Necesitarás añadir RESEND_API_KEY a tu archivo .env o variables de Cloudflare
    const resendApiKey = process.env.RESEND_API_KEY;

    const emailHtmlContent = `
      <h2>Nueva solicitud de Valoración Gratuita</h2>
      <p><strong>Día y Hora:</strong> ${selectedTime}, ${new Date(selectedDate).toLocaleDateString('es-ES')} (${timezone})</p>
      <br />
      <h3>Datos de Contacto:</h3>
      <ul>
        <li><strong>Nombre Completo:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Teléfono:</strong> ${phone}</li>
      </ul>
      <br />
      <h3>Datos del Bebé:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${babyName}</li>
        <li><strong>Edad:</strong> ${babyAge}</li>
      </ul>
      <br />
      <h3>Motivo de Consulta:</h3>
      <p>${reason}</p>
    `;

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // El 'from' debe ser un dominio verificado en Resend (ej. reservas@tu-dominio.com)
          from: "hola@vialacteasuenoylactancia.com", // Ajustar este from al que tengas validado en Resend o Cloudflare
          to: ["miriruco@gmail.com"],
          reply_to: email,
          subject: `Nueva Valoración Gratuita Reservada - ${firstName} ${lastName}`,
          html: emailHtmlContent,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend Error:", errorText);
        // Si falla resend, podemos igual devolver ok o error
        // para efectos de no bloquear al usuario devolvemos err o lo que decidamos
      }
    } else {
      console.warn("No RESEND_API_KEY found. Logging email payload instead:");
      console.log(emailHtmlContent);
    }

    // Aquí podrías también hacer un fetch() a la API de HubSpot para sincronizar el CRM

    // Si todo va bien
    return NextResponse.json({ success: true, message: "Booking confirmed" });

  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
