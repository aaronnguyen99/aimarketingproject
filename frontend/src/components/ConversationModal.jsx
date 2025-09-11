import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';


const ConversationModal = ({ isOpen, onClose ,data}) => {
  const [prompt, setPrompt] = useState("");
const normalizeMarkdown = (text) => {
  console.log(text);
  return text.replace(/#+(?=\S)/g, (match) => match + " "); 
  // ensures "#Heading" → "# Heading"
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto ">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl max-w-6xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold"
        >
          ×
        </button>
        {/* Scrollable content */}
        <div className="p-6 max-h-[80vh] overflow-auto space-y-4">

            {/* Prompt */}
            <div className="p-4 border rounded-lg bg-gray-50">
            <p className="font-bold text-lg mb-2">Prompt:</p>
            <p className="text-gray-700 whitespace-pre-wrap">{data.content}</p>
            </div>

            {/* Result */}
            <div className="p-4 border rounded-lg bg-gray-50 prose">
            <p className="font-bold text-lg mb-2">Result:</p>
            <ReactMarkdown>{normalizeMarkdown(data.snapshot)}</ReactMarkdown>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ConversationModal;