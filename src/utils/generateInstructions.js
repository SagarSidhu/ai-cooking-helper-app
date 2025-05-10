import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // needed if running on client-side
});

export async function generateCookingInstructions(formData) {
  const { surface, tempStyle, weight, cut, doneness, pan } = formData;
  const combinedWeight = `${formData.weightValue} ${formData.weightUnit}`;

  const prompt = `
You're a helpful cooking assistant. Provide beginner-friendly, step-by-step instructions for cooking a ${combinedWeight} ${cut} steak on a ${surface}, aiming for ${doneness} doneness.
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

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI Error:", err);
    return "Something went wrong while fetching instructions.";
  }
}
