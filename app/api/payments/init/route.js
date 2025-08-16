import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function POST(req) {
  await dbConnect();
  const { eventId, email, name, phone } = await req.json();

  const event = await Event.findById(eventId).lean();
  if (!event) {
    return new Response(JSON.stringify({ error: "Event not found" }), {
      status: 404,
    });
  }

  const amount = Number(event.price) * 100; // kobo
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount,
      metadata: { name, phone, eventId },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}?reference=${Date.now()}`,
    }),
  });
  const data = await res.json();
  if (!data.status) {
    return new Response(JSON.stringify({ error: data.message }), {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ accessCode: data.data.access_code }), {
    status: 200,
  });
}
