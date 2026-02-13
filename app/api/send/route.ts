import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend with the key from your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Form Data Received:", body); // Logs what the form is sending

    const { name, tel, email, event, date, time, description } = body;

    const data = await resend.emails.send({
      // Match the format that worked in your manual test
      from: 'Jiffy Booth <onboarding@resend.dev>', 
      to: ['morganchin@1utar.my'], 
      subject: `New Quotation Request: ${event} - ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>New Booking Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${tel}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Event Type:</strong> ${event}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Event Time:</strong> ${time}</p>
          <hr />
          <p><strong>Description:</strong></p>
          <p>${description}</p>
        </div>
      `,
    });

    console.log("Resend API Response:", data);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    // MODIFICATION: This will show you the EXACT error in your VS Code terminal
    console.error("CRITICAL SEND ERROR:", error); 
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}