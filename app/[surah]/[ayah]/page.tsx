"use client";

import { useEffect, useState } from "react";
import AyahDisplay from "@/components/AyahDisplay";

interface AyahPageProps {
  params: Promise<{ surah: string; ayah: string }>;
}

export default function AyahPage({ params }: AyahPageProps) {
  const [ayahData, setAyahData] = useState<{
    surah: string;
    ayah: string;
  } | null>(null);

  useEffect(() => {
    params.then((data) => setAyahData(data));
  }, [params]);

  if (!ayahData) {
    return <div>Loading...</div>;
  }

  return <AyahDisplay params={ayahData} />;
}
