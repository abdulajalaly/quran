// Fetch list of reciters
export const fetchReciters = async () => {
  try {
    const response = await fetch("/edition.customization.json");
    if (!response.ok) {
      return { error: "Failed to fetch reciters" };
    }
    const data = await response.json();

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
  edition: string
) => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition}`
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

export const fetchSurahName = async (surahNumber: number) => {
  try {
    const response = await fetch("/meta.customization.json");
    if (!response.ok) {
      return { error: "Failed to fetch surah name" };
    }
    const data = await response.json();

    // Find the surah with matching number from the references array
    const surah = data.data.surahs.references.find(
      (s: { number: number }) => s.number === surahNumber
    );

    if (!surah) {
      return { error: "Surah not found" };
    }

    return { name: surah.englishName };
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
  try {
    const res = await fetch("/edition.customization.json");
    const data = await res.json();

    // Check if the response is valid
    if (!data.data) {
      throw new Error("Failed to fetch translations");
    }

    // Filter for translations
    return data.data.filter((edition: any) => edition.type === "translation");
  } catch (error) {
    throw new Error("Failed to fetch translations");
  }
}
