import React, { useState } from 'react';
import './LiveSearchSelect.css';

const LiveSearchSelect = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFocused, setIsFocused] = useState(false); // Track input focus state

  const statesOfIndia = [
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'delhi', label: 'Delhi'}
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSearchTerm(option.label);
    console.log(option.label); // Clear search after selecting an option
    setIsFocused(false); // Close dropdown after selecting
  };

  // Filter options based on search term
  const filteredOptions = statesOfIndia.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container1 mt-4">
      <div className='d-flex gap-3 align-items-center'>
        <div className="form-group w-full">
          <input
            type="text"
            className="form-control"
            placeholder="Search Jobs by state..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)} // Show dropdown when input is focused
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay hide to allow click
          />
        </div>
        <button className="search_button" onClick={() => props.searchJobByState(selectedOption)}>Find Job</button>
      </div>

      {isFocused && (
        <div className="dropdown">
          <ul className="list-group">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option.value}
                  className="list-group-item"
                  onMouseDown={() => handleSelect(option)} // Use onMouseDown to prevent blur
                  style={{ cursor: 'pointer' }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="list-group-item">No options found</li>
            )}
          </ul>
        </div>
      )}

      {/* {selectedOption && (
        <div className="mt-3">
          <h4>Selected State:</h4>
          <p>{selectedOption.label}</p>
        </div>
      )} */}
    </div>
  );
};

export default LiveSearchSelect;
