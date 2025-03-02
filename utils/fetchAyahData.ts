// Fetch list of reciters
export const fetchReciters = async () => {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/edition");
    if (!response.ok) {
      return { error: "Failed to fetch reciters" };
    }
    const data = await response.json();
    if (data.code !== 200) {
      return { error: "Error fetching reciters" };
    }

    // Filter out reciters with format "audio" and type "versebyverse"
    const filteredReciters = data.data.filter(
      (reciter: { format: string; type: string }) =>
        reciter.format === "audio" || reciter.type === "versebyverse"
    );

    return { data: filteredReciters };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message || "Failed to load reciters" };
    }
    return { error: "Failed to load reciters" };
  }
};

// Fetch Ayah data with reciter as input (default is "ar.alafasy")
export const fetchAyahData = async (
  surah: number,
  ayah: number,
  reciter: string
) => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${reciter}`
    );
    if (!response.ok) {
      return { error: "Failed to fetch ayah" };
    }
    const data = await response.json();
    if (data.code !== 200) {
      return { error: "Error fetching ayah data" };
    }
    return { data: data.data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message || "Failed to load verse" };
    }
    return { error: "Failed to load verse" };
  }
};

// Fetch Surah name based on Surah number
export const fetchSurahName = async (surahNumber: number) => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}`
    );
    if (!response.ok) {
      return { error: "Failed to fetch surah name" };
    }
    const data = await response.json();
    if (data.code !== 200) {
      return { error: "Error fetching surah name" };
    }
    return { name: data.data.englishName }; // Return the name of the Surah
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message || "Failed to load surah name" };
    }
    return { error: "Failed to load surah name" };
  }
};

// Function to save last read Ayah and Surah in local storage
export const saveLastReadAyah = (surah: number, ayah: number) => {
  const lastRead = { surah, ayah };
  localStorage.setItem("lastRead", JSON.stringify(lastRead));
};

export async function getTranslations() {
  const res = await fetch("https://api.alquran.cloud/v1/edition");
  const data = await res.json();

  // Check if the response is valid
  if (data.code !== 200) {
    throw new Error("Failed to fetch translations");
  }

  // Filter for translations
  return data.data.filter((edition: any) => edition.type === "translation");
}

// export async function getTafsirs() {
//   const res = await fetch("https://api.alquran.cloud/v1/edition");
//   const data = await res.json();

//   return data.data.filter((edition: any) => edition.type === "tafsir");
// }

// Fetch Ayah translation based on Surah, Ayah, and selected edition
export async function getAyahTranslation(
  surah: number,
  ayah: number,
  edition: string
) {
  const response = await fetch(
    `http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  // Extract the text from the response
  return data.data.text;
}
