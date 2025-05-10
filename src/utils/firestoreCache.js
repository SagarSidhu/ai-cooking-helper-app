import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const collectionRef = collection(db, "cookingInstructions");

function createKey(data) {
  const keyData = {
    surface: data.surface,
    tempStyle: data.tempStyle,
    weightValue: data.weightValue,
    weightUnit: data.weightUnit,
    cut: data.cut === "Other" ? data.customCut : data.cut,
    doneness: data.doneness,
    pan: data.surface === "Stove" ? data.pan : "",
  };
  return JSON.stringify(keyData);
}

export async function getCachedInstructions(formData) {
  const key = createKey(formData);
  const q = query(collectionRef, where("key", "==", key));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].data().instructions;
  }
  return null;
}

export async function cacheInstructions(formData, instructions) {
  const key = createKey(formData);
  const q = query(collectionRef, where("key", "==", key));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await addDoc(collectionRef, {
      key,
      instructions,
      createdAt: new Date(),
    });
  }
}
