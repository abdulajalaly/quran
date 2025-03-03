"use client";

import { useEffect, useState } from "react";

import AudioPlayer from "./AudioPlayer";
import AyahNavigation from "./AyahNavigation";
import {
  fetchAyahData,
  fetchReciters,
  saveLastReadAyah,
  getTranslations,
} from "./../utils/fetchAyahData";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useSettings } from "./SettingsContext"; // Import the context

type AyahData = {
  text: string;
  surah: { name: string; englishName: string; numberOfAyahs: number };
  audio: string;
  numberInSurah: number;
};

type Translation = {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
};

interface AyahDisplayProps {
  params: { surah: string; ayah: string };
}

const AyahDisplay = ({ params }: AyahDisplayProps) => {
  const {
    selectedSurah,
    selectedAyah,
    setSelectedSurah,
    setSelectedAyah,
    selectedTranslation,
    setSelectedTranslation,
  } = useSettings(); // Use the context

  // Replace local state for reciter and font with context values
  const { reciter, setReciter, font, setFont, isMuted, setMuted } =
    useSettings();

  const surah = parseInt(params?.surah as string);
  const ayah = parseInt(params?.ayah as string);

  const [ayahData, setAyahData] = useState<AyahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showVerseSelection, setShowVerseSelection] = useState(false);
  const [reciters, setReciters] = useState<
    {
      id: number;
      name: string;
      identifier: string;
      englishName: string;
      language: string;
    }[]
  >([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [translationText, setTranslationText] = useState<string>("");

  // Load mute state from localStorage
  useEffect(() => {
    const savedMuteState = localStorage.getItem("isMuted");
    if (savedMuteState !== null) {
      setMuted(savedMuteState === "true");
    }
  }, [setMuted]);
  useEffect(() => {
    setSelectedSurah(surah);
    setSelectedAyah(ayah);
  }, [surah, ayah, setSelectedSurah, setSelectedAyah]);
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

      // Save the last read Ayah and Surah
      saveLastReadAyah(surah, ayah);
    };
    if (reciter) {
      fetchAyah();
    }
  }, [surah, ayah, reciter]);

  // Fetch translations on mount
  useEffect(() => {
    const fetchTranslations = async () => {
      const result = await getTranslations();
      if (result.error) {
        setError(result.error);
        return;
      }
      setTranslations(result);
    };
    fetchTranslations();
  }, []);

  // Fetch translation when selectedTranslation changes
  useEffect(() => {
    const fetchTranslation = async () => {
      if (selectedTranslation) {
        const translation = await fetchAyahData(
          surah,
          ayah,
          selectedTranslation
        );
        if (translation.error) {
          setError(translation.error);
          setLoading(false);
          return;
        }

        setTranslationText(translation?.data?.text);
      } else {
        // Clear the translation text if "None" is selected
        setTranslationText("");
      }
    };
    fetchTranslation();
  }, [selectedTranslation, surah, ayah]);

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center text-white">
        {error ? (
          <p className="text-red-400 mt-4">{error}</p>
        ) : loading ? (
          <p className="text-xl animate-pulse mt-4">Loading...</p>
        ) : ayahData ? (
          <>
            {surah !== 1 && ayahData.numberInSurah === 1 ? (
              // Split Bismillah and remaining text for first ayah of each surah (except Surah Al-Fatiha)
              <>
                <p
                  className={`text-2xl md:text-3xl leading-loose arabic-text mt-4 mb-6 ${
                    font === "Amiri" ? "amiri" : "aridi"
                  }`}
                >
                  {ayahData.text.split(" ").slice(0, 4).join(" ")}
                </p>
                <p
                  className={`text-3xl md:text-4xl leading-loose arabic-text mt-4 ${
                    font === "Amiri" ? "amiri" : "aridi"
                  }`}
                >
                  {ayahData.text.split(" ").slice(4).join(" ")}
                </p>
              </>
            ) : (
              // Regular display for all other ayahs
              <p
                className={`text-3xl md:text-4xl leading-loose arabic-text mt-4 ${
                  font === "Amiri" ? "amiri" : "aridi"
                }`}
              >
                {ayahData.text}
              </p>
            )}
            {translationText && (
              <p className="text-lg mt-6 text-white/80">{translationText}</p>
            )}
            <div
              onClick={() => {
                setShowVerseSelection(true);
              }}
              className="mt-12 text-sm text-white/80 flex cursor-pointer"
            >
              {ayahData.surah.englishName} ({ayahData.numberInSurah} of{" "}
              {ayahData.surah.numberOfAyahs}){" "}
              <ChevronDownIcon className="ml-1 h-6 w-6" />
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
            surah={selectedSurah}
            ayah={selectedAyah}
            totalAyahs={ayahData.surah.numberOfAyahs}
            setMuted={setMuted}
            setReciter={setReciter}
            setFont={setFont}
            currentReciter={reciter}
            currentFont={font}
            reciters={reciters}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            showVerseSelection={showVerseSelection}
            setShowVerseSelection={setShowVerseSelection}
            selectedTranslation={selectedTranslation}
            setSelectedTranslation={setSelectedTranslation}
            translations={translations}
          />
        )}
      </div>
    </div>
  );
};

export default AyahDisplay;
