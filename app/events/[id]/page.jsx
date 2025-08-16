import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import EventDetails from "@/components/EventDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function EventPage({ params }) {
  const { id } = params;

  await dbConnect();
  const event = await Event.findById(id).lean();

  if (!event) {
    return <p className="text-center py-10 text-red-500">Event not found.</p>;
  }

  // Convert MongoDB _id to string for client component
  return(
    <>
    <Navbar />
   <EventDetails event={{ ...event, _id: event._id.toString() }} />;
  </>
  )

}
