// WingsForm.jsx
import { useState } from "react";
import { generateWingsInstructions } from "../utils/generateInstructions";
import ResultsModal from "./ResultsModal";

export default function WingsForm() {
  const [formData, setFormData] = useState({
    surface: "Air Fryer",
    tempStyle: "Knob",
    weightMode: "total",
    weightValue: "",
    weightUnit: "g",
    wingSize: "Medium",
    doneness: "Crispy",
    preSeasoned: "No",
    wingCount: "",
  });

  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [weightMode, setWeightMode] = useState("total"); // or "perWing"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidForm = () => {
    const requiredFields = [
      "surface",
      "tempStyle",
      "weightValue",
      "weightUnit",
      "wingSize",
      "doneness",
      "preSeasoned",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "")
        return false;
    }
    if (isNaN(parseFloat(formData.weightValue))) return false;
    return true;
  };

  const handleGenerate = async () => {
    if (!isValidForm()) {
      setErrorMessage(
        "Please fill in all fields correctly. Weight must be a number."
      );
      return;
    }

    setErrorMessage("");
    setLoading(true);
    setInstructions("");
    const result = await generateWingsInstructions(formData);
    setInstructions(result);
    setLoading(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 bg-gray-900 p-6 rounded-2xl shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Cooking Surface</label>
          <div className="radio-group">
            {["Air Fryer", "Oven", "BBQ"].map((surface) => (
              <label key={surface} className="radio-label">
                <input
                  type="radio"
                  name="surface"
                  value={surface}
                  checked={formData.surface === surface}
                  onChange={handleChange}
                />
                {surface}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Temperature Style</label>
          <select
            name="tempStyle"
            value={formData.tempStyle}
            onChange={handleChange}
            className="p-2 text-black rounded"
          >
            <option value="Knob">Low / Medium / High</option>
            <option value="Exact">Exact Temp (°F or °C)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            How would you like to enter weight?
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="weightMode"
                value="total"
                checked={weightMode === "total"}
                onChange={() => setWeightMode("total")}
              />
              Total Wings Weight
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="weightMode"
                value="perWing"
                checked={weightMode === "perWing"}
                onChange={() => setWeightMode("perWing")}
              />
              Individual Wing Weight × Count
            </label>
          </div>
        </div>

        {weightMode === "total" ? (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Total Wings Weight
            </label>
            <div className="weight-row">
              <input
                type="number"
                name="weightValue"
                value={formData.weightValue}
                onChange={handleChange}
                placeholder="e.g. 500"
                min="0"
              />
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleChange}
              >
                <option value="g">g</option>
                <option value="oz">oz</option>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
            <small className="helper-text">
              Based on the total amount you’ll cook at once on the{" "}
              {formData.surface}.
            </small>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Individual Wing Weight
              </label>
              <div className="weight-row">
                <input
                  type="number"
                  name="weightValue"
                  value={formData.weightValue}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  min="0"
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                >
                  <option value="g">g</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Number of Wings
              </label>
              <input
                type="number"
                name="wingCount"
                value={formData.wingCount || ""}
                onChange={handleChange}
                placeholder="e.g. 6"
                min="1"
              />
            </div>
          </>
        )}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Wing Size</label>
          <select
            name="wingSize"
            value={formData.wingSize}
            onChange={handleChange}
            className="p-2 text-black rounded"
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Doneness</label>
          <select
            name="doneness"
            value={formData.doneness}
            onChange={handleChange}
            className="p-2 text-black rounded"
          >
            <option>Juicy</option>
            <option>Crispy</option>
            <option>Extra Crispy</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Pre-seasoned?</label>
          <select
            name="preSeasoned"
            value={formData.preSeasoned}
            onChange={handleChange}
            className="p-2 text-black rounded"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-600 font-semibold text-sm mb-2">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="generate-btn w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        {loading ? "🔥 Generating..." : "Generate Instructions"}
      </button>

      {showModal && (
        <ResultsModal onClose={() => setShowModal(false)}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            🍗 Cooking Instructions
          </h2>
          <div>
            {instructions
              .split(/\d+\.\s/)
              .filter(Boolean)
              .map((step, i) => (
                <p key={i}>
                  <strong>Step {i + 1}:</strong> {step.trim()}
                </p>
              ))}
          </div>
        </ResultsModal>
      )}
    </div>
  );
}
