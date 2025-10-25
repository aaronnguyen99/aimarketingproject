import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import SnapshotSelector from "./SnapshotSelector";


const ConversationModal = ({ isOpen, onClose ,data}) => {
  const [prompt, setPrompt] = useState("");
const models = ["gpt5","gemini"]
  const [selectedModel, setSelectedModel] = useState(models[0]);

const normalizeMarkdown = (text) => {
  return text.replace(/#+(?=\S)/g, (match) => match + " "); 
  // ensures "#Heading" → "# Heading"
};
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-gradient-to-br from-indigo-50 via-white to-teal-50 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden">
    {/* Close button */}
    <button
      onClick={() => {
          onClose();               // close the modal
          setSelectedModel(models[0]); // reset selected model
        }}

      className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
    >
      ×
    </button>

    {/* Scrollable content */}
    <div className="p-8 max-h-[80vh] overflow-y-auto space-y-6">
      
      {/* Prompt */}
      <div className="p-6 border-l-4 border-indigo-500 rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">Prompt</h2>
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {data.content}
        </p>
      </div>
    <div className="p-4">
      <SnapshotSelector
        snapshots={data.snapshots}
        onSelect={setSelectedModel}
      />
    </div>
      {/* Result */}
      <div className="p-6 border-l-4 border-emerald-500 rounded-xl bg-white shadow-sm prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-emerald-600 mb-3">Result</h2>
        <ReactMarkdown      components={{
    a: ({ node, ...props }) => {
      // Extract the domain for the favicon
      const url = props.children || "";
      const domain = (() => {
        try {
          return new URL(url).hostname;
        } catch {
          return url;
        }
      })();

      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-1 rounded-lg border border-blue-200 bg-blue-50 text-black font-bold hover:bg-blue-100 hover:border-blue-300 hover:text-blue-900 transition shadow-sm"
        >
          {/* Favicon */}
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
            alt="favicon"
            className="w-5 h-5 rounded"
          />
          {/* Link text */}
          {props.children}
        </a>
      );
    },
  }}>{normalizeMarkdown(data.snapshots[selectedModel])}</ReactMarkdown>
      </div>
      
    </div>
  </div>
</div>
  );
};

export default ConversationModal;