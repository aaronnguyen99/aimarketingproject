import React, { useState,useEffect } from "react";
import ConversationModal from "./ConversationModal";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import OptionModal from "./OptionModal";
import EditModal from "./EditModal";
import api from "../services/api";

const Table = (props) => {
const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

const openModal  = (id) => {
  setSelectedId(id);
  setModalOpen(true);
};
  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };
  const confirmDelete = () => {
    if (selectedId) {
      handleRemoveRow(selectedId);
      closeModal();
    }
  };
const handleRemoveRow = async (idx) => {
      try {
        const response = await api.delete("/"+props.type+"/delete/"+idx);
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
      
      props.fetchData();
};
  const openEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedRow(null);
  };
    const handleSave = (updatedRow) => {
    handleEditRow(updatedRow);
    closeEdit();
  };
const handleEditRow = async (updatedData) => {
      try {
        const response = await api.put("/"+props.type+"/update/"+updatedData._id,
          updatedData);
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
      
      props.fetchData();
};
if(props.loading) return     <div className="flex justify-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-b-4 border-gray-300"></div>
  </div>
  return (
    <div className="w-full text-left rounded-2xl shadow-md">
      <table className="w-full bg-white ">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm ">
            <th className="py-3 px-6">{props.type}</th>
            {!props.isPrompt&&(<th className="py-3 px-6">
              {"DOMAIN"}
            </th>)}
            <th className="py-3 px-6">{!props.isPrompt ? "Date added" :"Created"}</th>
            <th className="py-3 px-6">Options</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr key={row._id} 

            className="border-b-1 border-b-gray-100 hover:bg-gray-50 transition-colors"  
            >
              <td className="py-3 px-6 border-r-1 border-solid border-gray-200">  {props.isPrompt ? (
                  row.content
                ) : (
                <div className="flex gap-3 font-bold">
                  <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${row.domain}`}
                    alt=""
                    className="w-6 h-6"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span>{row.name}</span>
                  {row.isYour && (
                    <span className="inline-flex items-center justify-center text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Your School
                    </span>
                  )}                
                  </div>
                )}</td>
                
              {!props.isPrompt&&(<td className="py-3 px-6  border-r-1 border-solid border-gray-200">{row.domain}</td>)}
              <td className="py-3 px-6  border-r-1 border-solid border-gray-200">  
                {new Date(row.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
              })}</td>
              <td className="py-3 px-6 flex items-center gap-2"> 
                { props.isPrompt &&(
                  <div className="relative group inline-block">
                <button
                  onClick={() => {
                        setSelectedRow(row);
                        setIsConversationModalOpen(true);
                      }
                  }
                  className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                  👁️‍🗨️
                </button>  
                <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block 
                   bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg">
                  View
                </span></div>)
                }
                <div className="relative group inline-block">
                <button
                  onClick={() => openEdit(row)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                  🖊️
                </button>                
                <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block 
                   bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg">
                  Edit
                </span></div>
                <div className="relative group inline-block">
                    <button
                    onClick={() => openModal (row._id)}
                    className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                    🗑️
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block 
                    bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg">
                    Delete
                  </span>
                </div>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
            {modalOpen && (

        <OptionModal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Confirm Removal"
        actions={[
          { label: "Cancel", onClick: () => setModalOpen(false) },
          { label: "Remove", onClick: confirmDelete, variant: "danger" },
        ]}
        >        
      Are you sure you want to remove this? All of your data associated with this may be lost.
      </OptionModal>
            )}
          {editOpen && selectedRow && (
        <EditModal
          isOpen={editOpen}
          onClose={closeEdit}
          data={selectedRow}
          onSave={handleSave}
        />
      )}
        <ConversationModal
        isOpen={isConversationModalOpen}
        onClose={() => setIsConversationModalOpen(false)}
        data={selectedRow} // pass data to modal
        />
    </div>
  );
};

export default Table;