import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { studentName, studentEmail } = body;

    if (!studentName || !studentEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Name and email are required",
        }),
        { status: 400 }
      );
    }

    // Find tickets by name & email
    const tickets = await Ticket.find({
      studentName: { $regex: new RegExp(studentName, "i") }, // case-insensitive match
      studentEmail: studentEmail.toLowerCase(),
    }).populate("event");

    return new Response(JSON.stringify({ success: true, tickets }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
