import { useEffect } from "react";

// Enhanced DropdownMenu component
const DropdownMenu = ({ 
  data = [], 
  setData, 
  displayKey , // Which property to display
  valueKey , // Which property to use as value
  selectedItem = null, // Pass the full selected object
  className = ""
}) => {
  const selectedValue = selectedItem ? selectedItem[valueKey] : (data.length > 0 ? data[0][valueKey] : "");

  // Auto-select first item when data loads and no item is selected
  useEffect(() => {
    if (data.length > 0 && !selectedItem) {
      setData(data[0]);
    }
  }, [data, selectedItem, setData]);

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Company:
      </label>
      <select
        value={selectedValue}
        onChange={(e) => {
          const selected = data.find(item => item[valueKey] === e.target.value);
          setData(selected);
        }}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {data.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[displayKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;