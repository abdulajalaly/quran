// components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <div className="absolute bottom-4 w-full text-center text-white/70">
      <p className="text-sm md:text-base font-light">
        &copy; {new Date().getFullYear()} All Rights Reserved | Abdullah Jalaly
      </p>
    </div>
  );
}
