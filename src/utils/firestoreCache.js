import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const collectionRef = collection(db, "cookingInstructions");
const logsRef = collection(db, "instructionLogs");

function normalizeCut(formData) {
  if (!formData.cut) return "";
  return formData.cut === "Other"
    ? formData.customCut?.trim().toLowerCase?.() || ""
    : formData.cut.toLowerCase();
}

function toGrams(value, unit) {
  const v = parseFloat(value);
  switch (unit) {
    case "g":
      return v;
    case "kg":
      return v * 1000;
    case "oz":
      return v * 28.3495;
    case "lbs":
      return v * 453.592;
    default:
      return v;
  }
}

function getWeightTolerance(weightGrams) {
  if (weightGrams <= 500) return 10;
  if (weightGrams <= 1000) return 25;
  return 50;
}

function isValidForm(formData) {
  const { type } = formData;

  if (type === "steak") {
    const requiredFields = [
      "surface",
      "tempStyle",
      "weightValue",
      "weightUnit",
      "cut",
      "doneness",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "")
        return false;
    }

    if (
      formData.cut === "Other" &&
      (!formData.customCut || formData.customCut.trim() === "")
    )
      return false;
    if (
      formData.surface === "Stove" &&
      (!formData.pan || formData.pan.trim() === "")
    )
      return false;
    if (isNaN(parseFloat(formData.weightValue))) return false;

    return true;
  }

  if (type === "wings") {
    const requiredFields = [
      "surface",
      "tempStyle",
      "weightMode",
      "weightValue",
      "weightUnit",
      "doneness",
      "preSeasoned",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "")
        return false;
    }

    if (formData.weightMode === "perWing") {
      if (
        !formData.wingCount ||
        isNaN(parseInt(formData.wingCount)) ||
        parseInt(formData.wingCount) <= 0
      ) {
        return false;
      }
    }

    if (formData.weightMode === "total") {
      if (!formData.wingSize || formData.wingSize.toString().trim() === "") {
        return false;
      }
    }

    if (isNaN(parseFloat(formData.weightValue))) return false;

    return true;
  }

  return false; // Unknown type
}

export async function getCachedInstructions(formData) {
  if (!isValidForm(formData)) {
    console.warn("Invalid form data:", formData);
    return null;
  }

  const cut = normalizeCut(formData);
  const q = query(
    collectionRef,
    where("type", "==", formData.type),
    where("surface", "==", formData.surface),
    where("tempStyle", "==", formData.tempStyle),
    where("cut", "==", cut),
    where("doneness", "==", formData.doneness),
    where("pan", "==", formData.surface === "Stove" ? formData.pan : ""),
    where("weightMode", "==", formData.weightMode || "total"),
    where(
      "wingSize",
      "==",
      formData.weightMode === "total" ? formData.wingSize || "" : ""
    ),
    where(
      "wingCount",
      "==",
      formData.weightMode === "perWing" ? formData.wingCount || "" : ""
    )
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    await addDoc(logsRef, {
      status: "miss",
      matchType: "none",
      formData,
      timestamp: new Date(),
    });
    return null;
  }

  const weightGrams = toGrams(formData.weightValue, formData.weightUnit);
  const tolerance = getWeightTolerance(weightGrams);

  let bestMatch = null;
  let closestDiff = Infinity;
  let matchType = "none";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const cachedWeight = toGrams(data.weightValue, data.weightUnit);
    const diff = Math.abs(cachedWeight - weightGrams);

    if (diff === 0) {
      bestMatch = data.instructions;
      closestDiff = 0;
      matchType = "exact";
    } else if (diff <= tolerance && diff < closestDiff) {
      bestMatch = data.instructions;
      closestDiff = diff;
      matchType = "close";
    }
  });

  await addDoc(logsRef, {
    status: bestMatch ? "hit" : "miss",
    matchType,
    formData,
    timestamp: new Date(),
  });

  return bestMatch;
}

export async function cacheInstructions(formData, instructions) {
  const cut = normalizeCut(formData);
  const existing = await getCachedInstructions(formData);
  if (existing) return;

  await addDoc(collectionRef, {
    type: formData.type,
    surface: formData.surface,
    tempStyle: formData.tempStyle,
    weightMode: formData.weightMode || "total",
    weightValue: formData.weightValue,
    weightUnit: formData.weightUnit,
    cut,
    doneness: formData.doneness,
    pan: formData.surface === "Stove" ? formData.pan : "",
    wingSize: formData.weightMode === "total" ? formData.wingSize || "" : "",
    wingCount:
      formData.weightMode === "perWing" ? formData.wingCount || "" : "",
    instructions,
    createdAt: new Date(),
  });
}

export { toGrams, normalizeCut, getWeightTolerance, isValidForm };
