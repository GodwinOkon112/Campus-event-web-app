import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const date = formData.get("date");
    const time = formData.get("time");
    const price = formData.get("price");
    const status = formData.get("status");
    const imageFile = formData.get("image"); // optional

    // Find event
    const event = await Event.findById(id);
    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    let imageUrl = event.image; // Keep existing image if not updated

    if (imageFile && typeof imageFile !== "string") {
      // Convert image to buffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

      imageUrl = uploadRes.secure_url;
    }

    // Update event
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.price = price || event.price;
    event.status = status || event.status;
    event.image = imageUrl;

    const updatedEvent = await event.save();

    return new Response(JSON.stringify(updatedEvent), { status: 200 });
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Event.findByIdAndDelete(params.id);
  return Response.json({ message: "Event deleted" });
}

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// put and delete