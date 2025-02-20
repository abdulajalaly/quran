"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CogIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

type AyahNavigationProps = {
  surah: number;
  ayah: number;
  totalAyahs: number;
  setMuted: (muted: boolean) => void;
  setReciter: (reciter: string) => void;
  setFont: (reciter: string) => void;
  currentReciter: string;
  currentFont: string;
  reciters: any[];
};

const AyahNavigation = ({
  surah,
  ayah,
  totalAyahs,
  setMuted,
  setReciter,
  setFont,
  currentReciter,
  currentFont,
  reciters,
}: AyahNavigationProps) => {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(surah);
  const [selectedAyah, setSelectedAyah] = useState(ayah);
  const [maxAyahs, setMaxAyahs] = useState(totalAyahs);

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedSurah(surah);
    setSelectedAyah(ayah);
    setMaxAyahs(totalAyahs);
    const savedMuteState = localStorage.getItem("isMuted");
    if (savedMuteState !== null) {
      setIsMuted(savedMuteState === "true");
    }
  }, [surah, ayah, totalAyahs]);

  const goToPreviousAyah = () => {
    if (ayah > 1) {
      router.push(`/${surah}/${ayah - 1}`);
    } else if (surah > 1) {
      router.push(`/${surah - 1}/1`);
    }
  };

  const goToNextAyah = () => {
    if (ayah < totalAyahs) {
      router.push(`/${surah}/${ayah + 1}`);
    } else if (surah < 114) {
      router.push(`/${surah + 1}/1`);
    }
  };

  const handleSaveSettings = () => {
    setShowSettings(false);
    router.push(`/${selectedSurah}/${selectedAyah}`);
  };

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSurah = parseInt(e.target.value);
    setSelectedSurah(newSurah);
    setSelectedAyah(1);
    fetch(`https://api.alquran.cloud/v1/surah/${newSurah}`)
      .then((res) => res.json())
      .then((data) => setMaxAyahs(data.data.ayahs.length));
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setMuted(newMutedState);
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
      <div className="mt-6 flex items-center gap-6 relative">
        {/* Previous Button */}
        <button
          onClick={goToPreviousAyah}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
          disabled={surah === 1 && ayah === 1}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="relative p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
        >
          <CogIcon className="h-6 w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNextAyah}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
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

            {/* Surah Selection */}
            <div className="mt-4">
              <label className="block text-sm">Select Surah</label>
              <select
                value={selectedSurah}
                onChange={handleSurahChange}
                className="mt-2 p-2 w-full bg-white/10 border border-white/20 text-white rounded-md outline-none"
              >
                {Array.from({ length: 114 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="text-black">
                    Surah {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Ayah Selection */}
            <div className="mt-4">
              <label className="block text-sm">Select Ayah</label>
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
    </>
  );
};

export default AyahNavigation;
