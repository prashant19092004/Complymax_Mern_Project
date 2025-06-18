import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({ options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        {selected || "Select status"}
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="dropdown-list">
          {options.map((opt, index) => (
            <div
              key={index}
              className={`dropdown-item ${
                selected === opt ? "selected" : ""
              }`}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
