import { useState } from "react";
import { generateCookingInstructions } from "../utils/generateInstructions";
import ResultsModal from "../components/ResultsModal";

export default function Main() {
  const [formData, setFormData] = useState({
    surface: "Stove",
    tempStyle: "Knob",
    weightValue: "",
    weightUnit: "g",
    cut: "Striploin",
    doneness: "Medium",
    pan: "Cast Iron",
  });

  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setInstructions("");
    const result = await generateCookingInstructions(formData);
    setInstructions(result);
    setLoading(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center">Cooking Helper</h1>

        <div className="bg-gray-900 p-6 rounded-2xl shadow space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Surface */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Cooking Surface
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="surface"
                    value="Stove"
                    checked={formData.surface === "Stove"}
                    onChange={handleChange}
                  />
                  Stove
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="surface"
                    value="BBQ"
                    checked={formData.surface === "BBQ"}
                    onChange={handleChange}
                  />
                  BBQ
                </label>
              </div>
            </div>

            {/* Temp Style */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Cooking Temperature Style
              </label>
              <p className="helper-text">
                This tells us how you refer to heat when cooking — either using
                knobs like “medium heat,” or exact temperatures like 375°F.
              </p>
              <div className="temp-options">
                <label
                  className={`temp-option ${formData.tempStyle === "Knob" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="tempStyle"
                    value="Knob"
                    checked={formData.tempStyle === "Knob"}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Knob Style</strong>
                    <div className="temp-desc">
                      Use Low / Medium / High heat based on your stove or BBQ
                      knob.
                    </div>
                  </div>
                </label>

                <label
                  className={`temp-option ${formData.tempStyle === "Exact" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="tempStyle"
                    value="Exact"
                    checked={formData.tempStyle === "Exact"}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Exact Temperature</strong>
                    <div className="temp-desc">
                      You’ll enter the temperature in °F or °C for precision.
                    </div>
                  </div>
                </label>
              </div>
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
              </select>
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

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
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
      </div>
    </div>
  );
}
