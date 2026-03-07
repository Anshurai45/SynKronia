import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    // User ko confirmation email
    await resend.emails.send({
      from: "SynKronia <onboarding@resend.dev>",
      to: email,
      subject: "You're on the SynKronia list! 🎉",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0d0d1a;color:#fff;border-radius:16px;">
          <h2 style="color:#a78bfa;margin-bottom:8px;">Welcome to SynKronia 🎊</h2>
          <p style="color:#9ca3af;font-size:14px;line-height:1.6;">
            You're officially on the list! We'll send you the best events happening in your city every week.
          </p>
          <p style="color:#6b7280;font-size:12px;margin-top:24px;">— Team SynKronia</p>
        </div>
      `,
    });

    // Tujhe notification email
   await resend.emails.send({
  from: "Team SynKronia <onboarding@resend.dev>",
  to: email,
  subject: "Welcome to SynKronia — You're Subscribed 🎉",
  templateId: process.env.RESEND_NEWSLETTER_TEMPLATE_ID,  // ← yeh
});

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}