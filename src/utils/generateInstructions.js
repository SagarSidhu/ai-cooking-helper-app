import { getCachedInstructions, cacheInstructions } from "./firestoreCache";

const API_URL = import.meta.env.PROD ? "https://fromzerotochef.com" : "";

export async function generateCookingInstructions(formData) {
  const cached = await getCachedInstructions({ ...formData, type: "steak" });
  if (cached) return cached;

  try {
    const response = await fetch(`api/generateInstructions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    const result = data.instructions;

    await cacheInstructions({ ...formData, type: "steak" }, result);
    return result;
  } catch (err) {
    console.error("API Error:", err);
    return "Something went wrong while fetching instructions.";
  }
}

export async function generateWingsInstructions(formData) {
  const cacheKey = {
    ...formData,
    type: "wings",
    weightMode: formData.weightMode,
    wingSize: formData.weightMode === "total" ? formData.wingSize : "",
    wingCount: formData.weightMode === "perWing" ? formData.wingCount : "",
  };

  const cached = await getCachedInstructions(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`api/generateInstructions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    const result = data.instructions;

    await cacheInstructions(cacheKey, result);
    return result;
  } catch (err) {
    console.error("API Error:", err);
    return "Something went wrong while fetching wing instructions.";
  }
}
