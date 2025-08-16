import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import cloudinary from "@/utils/cloudinary";
import { Readable } from "stream";

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ date: 1 });
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const date = formData.get("date");
    const time = formData.get("time");
    const price = formData.get("price");
    const status = formData.get("status");
    const imageFile = formData.get("image");

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !price ||
      !status ||
      !imageFile
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

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

    // Create event in MongoDB
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      price,
      status,
      image: uploadRes.secure_url,
    });

    return new Response(JSON.stringify(newEvent), { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
