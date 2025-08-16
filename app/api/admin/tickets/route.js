import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

export async function GET() {
  await dbConnect();
  try {
    const tickets = await Ticket.find().populate("event", "title");
    return new Response(JSON.stringify(tickets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch tickets" }), {
      status: 500,
    });
  }
}
