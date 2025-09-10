// components/Hero.jsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-green-50 via-white to-green-700 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute -top-40 -right-40 w-96 h-66 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col justify-left md:items-center text-center">
        <p className="text-[3rem] md:text-center text-left w-3/4 md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Feel the Thrill of Live Football
        </p>
        <p className="mt-6 w-3/4 text-left md:text-center md:text-xl text-gray-700 max-w-2xl">
          Book your football match tickets online. Fast payments, instant
          access, and your favorite teams — all in one place.
        </p>
        <div className="mt-10 flex gap-4 w-3/4 md:w-full md:justify-center">
          <Link href={"/get-ticket"}>
            <Button
              className="px-4 py-4 text-sm font-bold bg-green-600 hover:bg-green-700"
              size="sm"
            >
              Get Tickets
            </Button>
          </Link>

          {/* Browse Matches Button links to Featured section */}
          <Link href="#featured" passHref>
            <Button
              variant="outline"
              className="px-4 py-4 text-sm font-bold border-green-600 text-green-700 hover:bg-green-50"
              size="sm"
            >
              Browse Matches
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
