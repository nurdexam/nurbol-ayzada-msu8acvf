import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      clientEmail,
      name,
      guests,
      attending,
    } = await req.json();

    console.log("RSVP:", {
      clientEmail,
      name,
      guests,
      attending,
    });

    if (!clientEmail || !name || !guests) {
      return Response.json(
        {
          success: false,
          error: "Данные не заполнены",
        },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Neuroshaqyrtu <onboarding@resend.dev>",
      to: [clientEmail],
      subject: `💌 Жаңа қонақ: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px;">
          <h2>💌 Жаңа қонақтың жауабы</h2>

          <p>
            <strong>Аты-жөні:</strong>
            ${name}
          </p>

          <p>
            <strong>Қонақтар саны:</strong>
            ${guests}
          </p>

          <p>
            <strong>Жауабы:</strong>
            ${
              attending
                ? "✅ Иә, келемін"
                : "❌ Келе алмаймын"
            }
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log("RESEND SUCCESS:", data);

    return Response.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("RSVP ERROR:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}