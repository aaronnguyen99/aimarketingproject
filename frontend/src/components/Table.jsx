import React, { useState } from "react";
import ConversationModal from "./ConversationModal";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Table = (props) => {
  const { token } = useAuth();

const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);

const handleRemoveRow = async (idx) => {
      try {
        const response = await axios.delete(
          "http://localhost:5000/api/prompt/delete/"+idx,
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
            <th className="py-3 px-6">Prompt</th>
            <th className="py-3 px-6">Visibility</th>
            <th className="py-3 px-6">Position</th>
            <th className="py-3 px-6">Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr key={row._id} 

            className="border-b hover:bg-gray-50 transition-colors"  
            >
              <td onClick={() => {
                    setSelectedRow(row);
                    setIsConversationModalOpen(true);
                }}
                className="py-3 px-6">{row.content}</td>
              <td className="py-3 px-6">{row.visibility}</td>
              <td className="py-3 px-6">{row.position}</td>
              <td className={`py-3 px-6 font-medium`}>{row.sentiment}</td>
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