import OpenAI from "openai";
import { getCachedInstructions, cacheInstructions } from "./firestoreCache";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateCookingInstructions(formData) {
  const cached = await getCachedInstructions({ ...formData, type: "steak" });
  if (cached) return cached;

  const {
    surface,
    tempStyle,
    weightValue,
    weightUnit,
    cut,
    customCut,
    doneness,
    pan,
  } = formData;
  const finalCut = cut === "Other" ? customCut : cut;
  const prompt = `You're a helpful cooking assistant. Provide beginner-friendly, step-by-step instructions for cooking a ${weightValue}${weightUnit} ${finalCut} steak on a ${surface}, aiming for ${doneness} doneness.
Temperature guidance style: ${tempStyle}.
${surface === "Stove" ? `Pan type: ${pan}.` : ""}

Be clear and concise.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const result = response.choices[0].message.content.trim();
    await cacheInstructions({ ...formData, type: "steak" }, result);
    return result;
  } catch (err) {
    console.error("OpenAI Error:", err);
    return "Something went wrong while fetching instructions.";
  }
}

export async function generateWingsInstructions(formData) {
  const cached = await getCachedInstructions({ ...formData, type: "wings" });
  if (cached) return cached;

  const {
    surface,
    tempStyle,
    weightValue,
    weightUnit,
    wingSize,
    doneness,
    preSeasoned,
  } = formData;
  const prompt = `You're a helpful cooking assistant. Provide clear, beginner-friendly, step-by-step instructions for cooking ${weightValue}${weightUnit} of ${wingSize?.toLowerCase?.()} chicken wings using a ${surface}.
Aim for a ${doneness?.toLowerCase?.()} finish. Use temperature style: ${tempStyle}.
Wings are ${preSeasoned === "Yes" ? "already seasoned" : "not pre-seasoned, so include basic seasoning"}.

Be practical and concise.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const result = response.choices[0].message.content.trim();
    await cacheInstructions({ ...formData, type: "wings" }, result);
    return result;
  } catch (err) {
    console.error("OpenAI Error:", err);
    return "Something went wrong while fetching wing instructions.";
  }
}
