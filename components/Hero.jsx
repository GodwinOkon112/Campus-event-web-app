// components/Hero.jsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 via-white to-blue-800 overflow-hidden ">
      {/* Background decorative shapes */}
      <div className="absolute -top-40 -right-40 w-96 h-66 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col justify-left md:items-center text-center ">
        <p className="text-[3rem] md:text-center text-left w-3/4 md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          Experience Events Like Never Before
        </p>
        <p className="mt-6 w-3/4 text-left md:text-center  md:text-xl text-gray-600 max-w-2xl">
          Secure your tickets instantly. Easy payments, instant access, and No
          login your campus events, all in one place.
        </p>
        <div className="mt-10 flex gap-4 w-3/4 md:w-full md:justify-center">
        <Link href={'/get-ticket'}>
          <Button className="px-4 py-4 text-sm" size="sm">
            Get Tickets
          </Button>
        </Link>

          {/* Browse Events Button links to Featured Events section */}
          <Link href="#featured" passHref>
            <Button
              variant="outline"
              className="px-4 py-4 text-sm font-bold"
              size="sm"
            >
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
