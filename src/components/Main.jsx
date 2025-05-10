import { useState } from "react";
import { generateCookingInstructions } from "../utils/generateInstructions";

export default function Main() {
  const [formData, setFormData] = useState({
    surface: "Stove",
    tempStyle: "Knob",
    weight: "",
    cut: "Striploin",
    doneness: "Medium",
    pan: "Cast Iron",
  });

  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateCookingInstructions(formData);
    setInstructions(result);
    setLoading(false);
  };

  return (
    <div className="grid gap-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Steak Cooking Helper</h1>

      <label>
        Cooking Surface
        <select
          name="surface"
          value={formData.surface}
          onChange={handleChange}
          className="w-full p-2 mt-1 text-black rounded"
        >
          <option>Stove</option>
          <option>BBQ</option>
        </select>
      </label>

      <label>
        Temperature Tips
        <select
          name="tempStyle"
          value={formData.tempStyle}
          onChange={handleChange}
          className="w-full p-2 mt-1 text-black rounded"
        >
          <option value="Knob">Low / Medium / High</option>
          <option value="Exact">Exact Temp (°F or °C)</option>
        </select>
      </label>

      <label>
        Steak Weight (e.g. 340g)
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-2 mt-1 text-black rounded"
        />
      </label>

      <label>
        Steak Cut
        <select
          name="cut"
          value={formData.cut}
          onChange={handleChange}
          className="w-full p-2 mt-1 text-black rounded"
        >
          <option>Striploin</option>
          <option>Sirloin</option>
          <option>Ribeye</option>
          <option>Tenderloin</option>
        </select>
      </label>

      <label>
        Doneness Level
        <select
          name="doneness"
          value={formData.doneness}
          onChange={handleChange}
          className="w-full p-2 mt-1 text-black rounded"
        >
          <option>Rare</option>
          <option>Medium Rare</option>
          <option>Medium</option>
          <option>Medium Well</option>
          <option>Well Done</option>
        </select>
      </label>

      {formData.surface === "Stove" && (
        <label>
          Pan Type
          <select
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            className="w-full p-2 mt-1 text-black rounded"
          >
            <option>Cast Iron</option>
            <option>Non-stick</option>
            <option>Stainless Steel</option>
          </select>
        </label>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? "Generating..." : "Generate Instructions"}
      </button>

      {instructions && (
        <div className="mt-6 whitespace-pre-wrap bg-gray-800 p-4 rounded-lg">
          {instructions}
        </div>
      )}
    </div>
  );
}
