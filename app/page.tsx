"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 text-center text-white">
        <p className="text-3xl md:text-4xl font-light leading-loose mt-4">
          Discover the Quran this Ramadan.
        </p>
        <p className="text-xl md:text-2xl mt-2 font-light text-white/70">
          A journey of reward with every verse.
        </p>

        <button
          onClick={() => router.push("/1/1")}
          className="mt-6 p-2 px-5 rounded-2xl text-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}
