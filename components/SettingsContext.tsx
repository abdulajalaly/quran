"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type SettingsContextType = {
  reciter: string;
  setReciter: (reciter: string) => void;
  font: string;
  setFont: (font: string) => void;
  selectedSurah: number;
  setSelectedSurah: (surah: number) => void;
  selectedAyah: number;
  setSelectedAyah: (ayah: number) => void;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  selectedTranslation: string;
  setSelectedTranslation: (translation: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
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

  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [isMuted, setMuted] = useState<boolean>(false);
  const [selectedTranslation, setSelectedTranslation] = useState<string>("");

  return (
    <SettingsContext.Provider
      value={{
        reciter,
        setReciter,
        font,
        setFont,
        selectedSurah,
        setSelectedSurah,
        selectedAyah,
        setSelectedAyah,
        isMuted,
        setMuted,
        selectedTranslation,
        setSelectedTranslation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  console.log("useSettings called", context);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
