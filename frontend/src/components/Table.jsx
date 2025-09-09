import React, { useState,useEffect } from "react";
import ConversationModal from "./ConversationModal";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useCallback } from "react";

const Table = (props) => {
  const { token } = useAuth();
  const backendUrl=import.meta.env.VITE_BACKEND_URL
const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);
const [scores, setScores] = useState({});
const [position, setPosition] = useState({});

useEffect(() => {
  const fetchAllScores = async () => {
    try {
      const scorePromises = props.data.map(async (item) => {
        const score = await props.fetchScore(item._id);
        return { id: item._id, score };
      });

      const scoreResults = await Promise.all(scorePromises);
                console.log('Full response:', scoreResults);

      const newScores = scoreResults.reduce((acc, { id, score }) => {
        acc[id] = score[0];
        return acc;
      }, {});
    console.log('Full:', newScores);
          const newPosition = scoreResults.reduce((acc, { id, score }) => {
        acc[id] = score[1];
        return acc;
      }, {});
      setScores(newScores);
      setPosition(newPosition);
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  };

  if (props.data && props.data.length > 0) {
    fetchAllScores();
  }
}, []);

const handleRemoveRow = async (idx) => {
      try {
        const response = await axios.delete(
          backendUrl+"/"+props.type+"/delete/"+idx,
          { 
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
      
      props.fetchData();
};
  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-md">
      <table className="w-full bg-white items-center">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
            <th className="py-3 px-6">{props.type}</th>
            <th className="py-3 px-6">
              {props.isPrompt ? null : "DOMAIN"}
            </th>
            <th className="py-3 px-6"> {!props.isPrompt ? "Visibility"  : null}</th>
            <th className="py-3 px-6">{!props.isPrompt ? "Position"  : null}</th>
            {/* <th className="py-3 px-6">Sentiment</th> */}
            <th className="py-3 px-6">Options</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr key={row._id} 

            className="border-b hover:bg-gray-50 transition-colors"  
            >
              <td onClick={
                  props.isPrompt
                    ? () => {
                        setSelectedRow(row);
                        setIsConversationModalOpen(true);
                      }
                    : undefined
}
                  className="py-3 px-6">  {props.isPrompt ? (
                  row.content
                ) : (
                <div className="flex items-center justify-center gap-3 font-bold">
                  <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${row.domain}`}
                    alt=""
                    className="w-6 h-6"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span>{row.name}</span>
                </div>
                )}</td>
              <td className="py-3 px-6">{props.isPrompt ? null : row.domain}</td>
              <td className="py-3 px-6 flex items-center justify-center">
                <span>{!props.isPrompt ? scores[row._id] +"%" : null}</span>
              </td>
              <td className={`py-3 px-6 font-medium items-center`}>  <span>{!props.isPrompt ? position[row._id]  : null}</span></td>
              <td className="py-3 px-6 flex items-center justify-center"> 

                <button
                  onClick={() => handleRemoveRow(row._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <ConversationModal
        isOpen={isConversationModalOpen}
        onClose={() => setIsConversationModalOpen(false)}
        data={selectedRow} // pass data to modal
        />
    </div>
  );
};

export default Table;