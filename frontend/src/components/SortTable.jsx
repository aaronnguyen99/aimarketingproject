import React from 'react'

const SortTable = ({ 
  data, 
  columns,
  defaultSort,
  className = "",
  headerClassName = "bg-gray-50",
  rowClassName = "hover:bg-gray-50",
  cellClassName = "",
  emptyMessage = "No data available",
  promptCount,
  loading
}) => {
  const [sortConfig, setSortConfig] = React.useState(defaultSort);

const sortedData = React.useMemo(() => {
  if (!sortConfig.key) return data;

  const parseValue = (val) => {
    if (typeof val === 'string' && val.endsWith('%')) {
      return parseFloat(val.replace('%', ''));
    }
    if (!isNaN(val)) return Number(val);
    return String(val).toLowerCase();
  };

  return [...data].sort((a, b) => {
    const aValue = parseValue(a[sortConfig.key]);
    const bValue = parseValue(b[sortConfig.key]);

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
<div className="flex justify-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-b-4 border-gray-300"></div>
  </div>      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={headerClassName}>
          <tr>
            <th></th><th></th>
            {columns.map((column, index) => (
              <th 
                key={column.key || index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title || column.key}</span>
                  {sortConfig.key === column.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, rowIndex) => (
            <tr key={row._id || rowIndex} className={rowClassName}>
              <td>{rowIndex+1}</td>
              <td>
                <div className="flex p-4 gap-3 font-bold">
                  <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${row.url||row.domain}`}
                    alt=""
                    className="w-6 h-6"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                               <span>{row.name || row.companyName}</span>
                         {row.isYour && (
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center">
            You
          </span>
        )}           
                  </div>
 
                </td>
              {columns.map((column, colIndex) => (
                
                <td 
                  key={`${rowIndex}-${column.key || colIndex}`}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${cellClassName}`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                  
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default SortTable