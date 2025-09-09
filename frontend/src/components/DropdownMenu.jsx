import { useState,useEffect } from 'react';

const DropdownMenu = (props) => {
  const [selectedCompany, setSelectedCompany] = useState('');

  const companies = props.data;
 
  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    const company = companies.find(c => c._id === companyId);
    setSelectedCompany(company);
    props.setData(company);
    console.log('Selected company:', company);
  };

  return (
      <div className="w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">          
          <div className="mb-6">
            <label htmlFor="company-select" className="block text-sm font-semibold text-gray-700 mb-3">
              Company Selection
            </label>
            <div className="relative">
              <select
                id="company-select"
                value={selectedCompany?._id || ''}
                onChange={handleCompanyChange}
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer text-gray-700 font-medium"
              >
                {companies.map((company) => (
                  <option key={company._id} value={company._id} className="text-gray-700 py-2">
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DropdownMenu;