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
  weight: ["400", "600", "700"],
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
        {/* Other external scripts */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://js.paystack.co/v2/inline.js"
          strategy="afterInteractive"
        />

        {/* ✅ FRAUD0 Main Tag */}
        <Script
          src="https://api.fraud0.com/api/v2/fz.js?cid=e682c0ef-f725-4237-83fd-ad8a60719d01"
          strategy="afterInteractive"
        />
        <Script id="fraud0-pixel" strategy="afterInteractive">
          {`
            (function(){
              var i=document.createElement('img');
              i.alt=' ';
              i.src='https://api.fraud0.com/api/v2/pixel?cid=e682c0ef-f725-4237-83fd-ad8a60719d01&cb='
                + Math.random() + '.' + (new Date()).getTime();
              i.width=i.height=1;
              i.style='width:1px;height:1px;display:inline;position:absolute;margin-top:-1px;';
              document.body.append(i);
            })();
          `}
        </Script>
        {/* ✅ End of FRAUD0 Main Tag */}
      </head>
      <body className={`${openSans.variable} font-sans`}>
        <div className="min-h-screen text-gray-900 w-full max-w-7xl mx-auto pb-6 no-underline ">
          {children}
        </div>
      </body>
    </html>
  );
}
