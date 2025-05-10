// SteakForm.jsx
import { useState } from "react";
import { generateCookingInstructions } from "../utils/generateInstructions";
import ResultsModal from "./ResultsModal";

export default function SteakForm() {
  const [formData, setFormData] = useState({
    surface: "Stove",
    tempStyle: "Knob",
    weightValue: "",
    weightUnit: "g",
    cut: "Striploin",
    customCut: "",
    doneness: "Medium",
    pan: "Cast Iron",
  });

  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const result = await generateCookingInstructions(formData);
    setInstructions(result);
    setLoading(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 bg-gray-900 p-6 rounded-2xl shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Surface */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Cooking Surface</label>
          <div className="radio-group">
            {["Stove", "BBQ"].map((surface) => (
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

        {/* Temp Style */}
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

        {/* Weight */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Steak Weight</label>
          <div className="weight-row">
            <input
              type="number"
              name="weightValue"
              value={formData.weightValue}
              onChange={handleChange}
              placeholder="Enter weight"
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
        </div>

        {/* Cut */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Steak Cut</label>
          <select
            name="cut"
            value={formData.cut}
            onChange={handleChange}
            className="p-2 text-black rounded"
          >
            <option>Striploin</option>
            <option>Sirloin</option>
            <option>Ribeye</option>
            <option>Tenderloin</option>
            <option>Porterhouse</option>
            <option>Flank</option>
            <option>Skirt</option>
            <option>Hanger</option>
            <option>Flat Iron</option>
            <option>Tri-Tip</option>
            <option value="Other">Other</option>
          </select>
          {formData.cut === "Other" && (
            <input
              type="text"
              name="customCut"
              value={formData.customCut}
              onChange={handleChange}
              className="mt-2 p-2 text-black rounded"
              placeholder="Enter custom steak cut"
            />
          )}
        </div>

        {/* Doneness */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Doneness Level</label>
          <select
            name="doneness"
            value={formData.doneness}
            onChange={handleChange}
            className="p-2 text-black rounded"
          >
            <option>Rare</option>
            <option>Medium Rare</option>
            <option>Medium</option>
            <option>Medium Well</option>
            <option>Well Done</option>
          </select>
        </div>

        {/* Pan (only if using Stove) */}
        {formData.surface === "Stove" && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Pan Type</label>
            <select
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              className="p-2 text-black rounded"
            >
              <option>Cast Iron</option>
              <option>Non-stick</option>
              <option>Stainless Steel</option>
            </select>
          </div>
        )}
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
            🍽 Cooking Instructions
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
