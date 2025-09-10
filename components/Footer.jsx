"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between md:flex-row flex-col md:items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-green-700 no-underline"
        >
          Evently
        </Link>

        {/* Copyright */}
        <p className="text-sm font-bold text-gray-600">
          &copy; {new Date().getFullYear()} Evently. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
