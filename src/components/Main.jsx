// Main.jsx
import { useState } from "react";
import SteakForm from "../components/SteakForm";
import WingsForm from "../components/WingsForm";

export default function Main() {
  const [activeTab, setActiveTab] = useState("steak");

  return (
    <div className="center-wrapper">
      <div className="form-box">
        <div className="min-h-screen bg-gray-50 text-black py-10 px-4">
          <div className="mx-auto w-full max-w-xl space-y-6">
            <h1 className="text-4xl font-bold text-center">Cooking Helper</h1>

            <div className="flex justify-center gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === "steak"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => setActiveTab("steak")}
              >
                Steak
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === "wings"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => setActiveTab("wings")}
              >
                Chicken Wings
              </button>
            </div>

            {activeTab === "steak" ? <SteakForm /> : <WingsForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
