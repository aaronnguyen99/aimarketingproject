import React, { useState } from "react";
import CountrySelect from "./CountrySelect";

const AddPromptModal = ({ isOpen, onClose, onAdd }) => {
  const [prompt, setPrompt] = useState("");
const countries = [
  { name: "Canada", code: "CA" },
  { name: "United States", code: "US" },
];
const getFlag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  const handleAdd = () => {
    if (!prompt.trim()) return; // don't add empty prompt
    onAdd(prompt);
    setPrompt(""); // reset textarea
    onClose(); // close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8">
       
        {/* Title */}
        <h2 className="text-lg font-semibold mb-2">Add Prompt</h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a competitive prompt without mentioning your own brand.
        </p>

        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          maxLength={200}
          className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                     text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition duration-200 resize-none break-words"
        />
        <CountrySelect/>
        <div className="flex mt-9 ">
          {/* Add button */}
          <button
            onClick={handleAdd}
            className="bg-neutral-900 mt-4 px-4 py-2 hover:bg-black text-white font-medium rounded-lg shadow transition"
          >
            + Add
          </button>
          {/* Close button */}
                  <button
            onClick={onClose}
            className="ml-auto mt-4 px-4 py-2 bg-red-400 text-white px-3 py-1 hover:bg-red-600 transition-colors font-medium rounded-lg shadow transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPromptModal;