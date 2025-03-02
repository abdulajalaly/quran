"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CogIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useSettings } from "./SettingsContext"; // Import the context
import { fetchSurahName } from "./../utils/fetchAyahData"; // Import the new function

type Reciter = {
  id: number;
  name: string;
  identifier: string;
  englishName: string;
  language: string;
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

type AyahNavigationProps = {
  surah: number;
  ayah: number;
  totalAyahs: number;
  setMuted: (muted: boolean) => void;
  setReciter: (reciter: string) => void;
  setFont: (reciter: string) => void;
  currentReciter: string;
  currentFont: string;
  reciters: Reciter[];
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showVerseSelection: boolean;
  setShowVerseSelection: (show: boolean) => void;
  selectedTranslation: string;
  setSelectedTranslation: (translation: string) => void;
  translations: Translation[];
};

const AyahNavigation = ({
  surah,
  ayah,
  totalAyahs,
  setReciter,
  setFont,
  currentReciter,
  currentFont,
  reciters,
  showSettings,
  setShowSettings,
  showVerseSelection,
  setShowVerseSelection,
  selectedTranslation,
  setSelectedTranslation,
  translations,
}: AyahNavigationProps) => {
  const router = useRouter();
  const {
    selectedSurah,
    setSelectedSurah,
    selectedAyah,
    setSelectedAyah,
    isMuted,
    setMuted: setMutedContext,
  } = useSettings(); // Use the context
  const [maxAyahs, setMaxAyahs] = useState(totalAyahs);
  const [surahNames, setSurahNames] = useState<string[]>([]);

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedSurah(surah);
    setSelectedAyah(ayah);
    setMaxAyahs(totalAyahs);
    const savedMuteState = localStorage.getItem("isMuted");
    if (savedMuteState !== null) {
      setMutedContext(savedMuteState === "true");
    }
    const fetchNames = async () => {
      const namesPromises = Array.from({ length: 114 }, (_, i) =>
        fetchSurahName(i + 1)
      );
      const resolvedNames = await Promise.all(namesPromises);
      const validNames = resolvedNames
        .filter((result): result is { name: string } => "name" in result)
        .map((result) => result.name);
      setSurahNames(validNames);
    };

    fetchNames();
  }, [
    surah,
    ayah,
    totalAyahs,
    setSelectedSurah,
    setSelectedAyah,
    setMutedContext,
  ]);

  const goToPreviousAyah = () => {
    if (ayah > 1) {
      setSelectedAyah(ayah - 1);
      router.push(`/${surah}/${ayah - 1}`);
    } else if (surah > 1) {
      setSelectedSurah(surah - 1);
      setSelectedAyah(1);
      router.push(`/${surah - 1}/1`);
    }
  };

  const goToNextAyah = () => {
    if (ayah < totalAyahs) {
      setSelectedAyah(ayah + 1);
      router.push(`/${surah}/${ayah + 1}`);
    } else if (surah < 114) {
      setSelectedSurah(surah + 1);
      setSelectedAyah(1);
      router.push(`/${surah + 1}/1`);
    }
  };

  const handleSaveSettings = () => {
    setShowSettings(false);
    // router.push(`/${selectedSurah}/${selectedAyah}`);
  };

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSurah = parseInt(e.target.value);
    setSelectedSurah(newSurah);
    setSelectedAyah(1);
    // The totalAyahs for the new surah should be passed down as a prop
    // or handled through the context/state management
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setMutedContext(newMutedState);
    localStorage.setItem("isMuted", newMutedState.toString());
  };

  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReciter(e.target.value);
  };
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition z-50"
      >
        <CogIcon className="h-6 w-6" />
      </button>
      <div className="mt-3 flex items-center gap-6 relative">
        {/* Previous Button */}
        <button
          onClick={goToPreviousAyah}
          className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
          disabled={surah === 1 && ayah === 1}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNextAyah}
          className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
          disabled={surah === 114 && ayah === totalAyahs}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Settings Popup (Centered Above the Button) */}
        {showSettings && (
          <div
            ref={settingsRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 rounded-2xl shadow-lg w-72"
          >
            {/* Close Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-white hover:text-gray-300 transition"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mute Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <label className="text-sm">Mute Audio</label>
              <input
                type="checkbox"
                checked={isMuted}
                onChange={handleMuteToggle}
                className="cursor-pointer h-5 w-5"
              />
            </div>

            {/* Reciter Selection */}
            <div className="mt-4">
              <label className="block text-sm">Select Reciter</label>
              <select
                value={currentReciter}
                onChange={handleReciterChange}
                className="mt-2 p-2 w-full bg-white/10 border border-white/20 text-white rounded-md outline-none"
              >
                {reciters.map((reciter, index) => (
                  <option
                    key={index}
                    value={reciter.identifier}
                    className="text-black"
                  >
                    {reciter.englishName} ({reciter.language})
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm">Select Font</label>
              <select
                value={currentFont}
                onChange={handleFontChange}
                className="mt-2 p-2 w-full bg-white/10 border border-white/20 text-white rounded-md outline-none"
              >
                {["Amiri", "aridi"].map((font, index) => (
                  <option key={index} value={font} className="text-black">
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Translation Selection */}
            <div className="mt-4">
              <label className="block text-sm">Select Translation</label>
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="mt-2 p-2 w-full bg-white/10 border border-white/20 text-white rounded-md outline-none"
              >
                <option value="" className="text-black">
                  None
                </option>
                {translations && translations.length > 0 ? (
                  translations.map((translation) => (
                    <option
                      key={translation.identifier}
                      value={translation.identifier}
                      className="text-black"
                    >
                      {translation.englishName} ({translation.language})
                    </option>
                  ))
                ) : (
                  <option disabled>No translations available</option>
                )}
              </select>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-md hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verse Selection Popup */}
      {showVerseSelection && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 rounded-2xl shadow-lg w-72">
          <h3 className="text-lg font-semibold">Select Surah and Ayah</h3>
          <div className="flex gap-4">
            {/* Surah Selection */}
            <div className="mt-4">
              <select
                value={selectedSurah}
                onChange={handleSurahChange}
                className="mt-2 p-2 w-full bg-white/10 border border-white/20 text-white rounded-md outline-none"
              >
                {Array.from({ length: 114 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="text-black">
                    {surahNames[i] || `Surah ${i + 1}`} {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Ayah Selection */}
            <div className="mt-4">
              <select
                value={selectedAyah}
                onChange={(e) => setSelectedAyah(parseInt(e.target.value))}
                className="mt-2 p-2 w-full bg-white/10 border border-white/20 text-white rounded-md outline-none"
              >
                {Array.from({ length: maxAyahs }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="text-black">
                    Ayah {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setShowVerseSelection(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-md hover:bg-white/20 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowVerseSelection(false);
                router.push(`/${selectedSurah}/${selectedAyah}`);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AyahNavigation;
