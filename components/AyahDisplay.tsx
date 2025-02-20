"use client";

import { useEffect, useState } from "react";

import AudioPlayer from "./AudioPlayer";
import AyahNavigation from "./AyahNavigation";
import { fetchAyahData, fetchReciters } from "./../utils/fetchAyahData";

type AyahData = {
  text: string;
  surah: { name: string; englishName: string; numberOfAyahs: number };
  audio: string;
  numberInSurah: number;
};

interface AyahDisplayProps {
  params: { surah: string; ayah: string };
}

const AyahDisplay = ({ params }: AyahDisplayProps) => {
  const surah = parseInt(params?.surah as string);
  const ayah = parseInt(params?.ayah as string);

  const [ayahData, setAyahData] = useState<AyahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  // Initialize reciter state from localStorage (if exists) or default to "ar.alafasy"
  const [reciter, setReciter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("reciter") || "ar.alafasy";
    }
    return "ar.alafasy";
  });
  const [font, setFont] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("font") || "Amiri";
    }
    return "Amiri";
  });
  const [reciters, setReciters] = useState<
    {
      id: number;
      name: string;
      identifier: string;
      englishName: string;
      language: string;
    }[]
  >([]);

  // Load mute state from localStorage
  useEffect(() => {
    const savedMuteState = localStorage.getItem("isMuted");
    if (savedMuteState !== null) {
      setIsMuted(savedMuteState === "true");
    }
  }, []);

  // Fetch reciters on mount
  useEffect(() => {
    const fetchReciterList = async () => {
      const result = await fetchReciters();
      if (result.error) {
        setError(result.error);
        return;
      }
      setReciters(result.data);
    };
    fetchReciterList();
  }, []);

  // Fetch ayah data when surah, ayah, or reciter changes
  useEffect(() => {
    const fetchAyah = async () => {
      setLoading(true);
      const result = await fetchAyahData(surah, ayah, reciter);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setAyahData(result.data);
      setLoading(false);
    };
    if (reciter) {
      fetchAyah();
    }
  }, [surah, ayah, reciter]);

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center text-white">
        {error ? (
          <p className="text-red-400 mt-4">{error}</p>
        ) : loading ? (
          <p className="text-xl animate-pulse mt-4">Loading...</p>
        ) : ayahData ? (
          <>
            <p
              className={`text-3xl md:text-4xl leading-loose arabic-text mt-4 ${
                font === "Amiri" ? "amiri" : "aridi"
              }`}
            >
              {ayahData.text}
            </p>
            <div className="mt-6 text-sm text-white/80">
              {ayahData.surah.englishName} (Verse {ayahData.numberInSurah} of{" "}
              {ayahData.surah.numberOfAyahs})
            </div>
          </>
        ) : null}

        {/* Audio Player */}
        {ayahData && (
          <AudioPlayer audioSrc={ayahData.audio} isMuted={isMuted} />
        )}

        {/* Navigation Buttons (with reciter and mute controls) */}
        {ayahData && (
          <AyahNavigation
            surah={surah}
            ayah={ayah}
            totalAyahs={ayahData.surah.numberOfAyahs}
            setMuted={(muted) => {
              setIsMuted(muted);
              localStorage.setItem("isMuted", muted.toString());
            }}
            setReciter={(r) => {
              setReciter(r);
              localStorage.setItem("reciter", r);
            }}
            setFont={(r) => {
              setFont(r);
              localStorage.setItem("font", r);
            }}
            currentReciter={reciter}
            currentFont={font}
            reciters={reciters}
          />
        )}
      </div>
    </div>
  );
};

export default AyahDisplay;
