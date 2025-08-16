import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export default async function EventPage({ params }) {
  await dbConnect();

  const event = await Event.findById(params.id).lean();

  if (!event) {
    return <p className="text-center py-10 text-red-500">Event not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

      <p className="text-gray-700 mb-2">{event.description}</p>

      <p className="text-gray-500 mb-2">
        Date: {new Date(event.date).toLocaleDateString()}
      </p>

      <p className="text-gray-500 mb-2">Time: {event.time}</p>

      <p className="text-blue-600 font-bold mb-2">
        Price: {event.price ? `₦${event.price}` : "Free"}
      </p>

      <span
        className={`text-xs px-2 py-1 rounded-full ${
          event.status === "Upcoming"
            ? "bg-green-100 text-green-700"
            : event.status === "Ongoing"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-600"
        }`}
      >
        {event.status}
      </span>
    </div>
  );
}
