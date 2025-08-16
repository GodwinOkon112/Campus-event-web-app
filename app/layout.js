import { Open_Sans } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

// ✅ Add Open Sans font
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // choose weights you need
});

export const metadata = {
  title: "Student AI Ticketing System",
  description:
    "A modern online ticketing system for campus events, built with Next.js. Includes secure payments, event management, and AI-powered features.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load external scripts properly */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://js.paystack.co/v2/inline.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${openSans.variable} font-sans`}>
        {/* Optional: Navbar and Footer here */}
        {/* <Navbar /> */}
        <div className="min-h-screen text-gray-900 w-full max-w-7xl mx-auto pb-6 no-underline">
          {children}
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
