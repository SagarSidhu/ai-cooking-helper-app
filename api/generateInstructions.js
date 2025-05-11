import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight handled
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const {
      type,
      surface,
      tempStyle,
      weightValue,
      weightUnit,
      cut,
      customCut,
      doneness,
      pan,
      preSeasoned,
      wingSize,
      wingCount,
      weightMode,
    } = req.body;

    if (
      !type ||
      !surface ||
      !tempStyle ||
      !weightValue ||
      isNaN(weightValue) ||
      !weightUnit ||
      !doneness
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let prompt = "";

    if (type === "steak") {
      const finalCut = cut === "Other" ? customCut : cut;
      if (!finalCut || (surface === "Stove" && !pan)) {
        return res.status(400).json({ error: "Missing steak cut or pan" });
      }

      prompt = `You're a helpful cooking assistant. Provide step-by-step instructions for cooking a ${weightValue}${weightUnit} ${finalCut} steak on a ${surface}, aiming for ${doneness} doneness.
Use ${tempStyle} temperature style.
${surface === "Stove" ? `Pan type: ${pan}.` : ""}
${preSeasoned === "Yes" ? "The steak is pre-seasoned." : "Include basic seasoning instructions."}
Be clear and concise.`;
    } else if (type === "wings") {
      if (
        !weightMode ||
        !wingSize ||
        (weightMode === "perWing" && !wingCount)
      ) {
        return res.status(400).json({ error: "Missing wing details" });
      }

      const wingDescription =
        weightMode === "perWing"
          ? `${wingCount} wings, each ${weightValue}${weightUnit}`
          : `${weightValue}${weightUnit} of ${wingSize.toLowerCase()} wings`;

      prompt = `You're a helpful cooking assistant. Provide beginner-friendly, step-by-step instructions for cooking ${wingDescription} using a ${surface}, aiming for ${doneness}.
Temperature style: ${tempStyle}.
Wings are ${preSeasoned === "Yes" ? "pre-seasoned" : "not pre-seasoned — include basic seasoning."}
Be practical and concise.`;
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const instructions = response.choices[0].message.content.trim();
    res.status(200).json({ instructions });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI call failed" });
  }
}
