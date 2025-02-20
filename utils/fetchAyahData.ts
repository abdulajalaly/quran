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
