import OpenAI from "openai";
import { getCachedInstructions, cacheInstructions } from "./firestoreCache";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateCookingInstructions(formData) {
  const cached = await getCachedInstructions(formData);
  if (cached) return cached;

  const {
    surface,
    tempStyle,
    weightValue,
    weightUnit,
    cut,
    doneness,
    pan,
    customCut,
  } = formData;
  const actualCut = cut === "Other" ? customCut : cut;

  const prompt = `
    You're a helpful cooking assistant. Provide beginner-friendly, step-by-step instructions for cooking a ${weightValue}${weightUnit} ${actualCut} steak on a ${surface}, aiming for ${doneness} doneness.
    Temperature guidance style: ${tempStyle}.
    ${surface === "Stove" ? `Pan type: ${pan}.` : ""}
    Be clear and concise.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = response.choices[0].message.content.trim();
    await cacheInstructions(formData, result);
    return result;
  } catch (err) {
    console.error("OpenAI Error:", err);
    return "Something went wrong while fetching instructions.";
  }
}
