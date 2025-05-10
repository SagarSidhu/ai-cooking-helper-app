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

            {/* Tab Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <button
                className={`tab-button ${activeTab === "steak" ? "active" : "inactive"}`}
                onClick={() => setActiveTab("steak")}
              >
                Steak
              </button>
              <button
                className={`tab-button ${activeTab === "wings" ? "active" : "inactive"}`}
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
