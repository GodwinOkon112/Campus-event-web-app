import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Remove cookie
  response.cookies.set("adminAuth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // expired
  });

  return response;
}
