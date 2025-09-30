import { useState } from "react";

const SnapshotSelector = ({ snapshots, onSelect }) => {
  const models = Object.keys(snapshots); // e.g., ["gpt5", "gemini"]
  const [selected, setSelected] = useState(models[0]);

  const handleClick = (model) => {
    setSelected(model);
    if (onSelect) onSelect(model); // notify parent which model is selected
  };

  return (
    <div className="flex space-x-2">
      {models.map((model) => (
        <button
          key={model}
          onClick={() => handleClick(model)}
          className={`px-3 py-1 rounded font-medium transition-colors ${
            selected === model
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {model.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
export default SnapshotSelector;