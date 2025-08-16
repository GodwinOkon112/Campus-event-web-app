import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date().toISOString() },
    });
    const completedEvents = await Event.countDocuments({
      date: { $lt: new Date().toISOString() },
    });
    const ticketsSold = await Ticket.countDocuments();

    const revenueData = await Ticket.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenueGenerated = revenueData[0]?.total || 0;

    const activeUsers = await User.countDocuments();

    return new Response(
      JSON.stringify({
        totalEvents,
        upcomingEvents,
        completedEvents,
        ticketsSold,
        revenueGenerated,
        activeUsers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
    });
  }
}
