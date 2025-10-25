// src/pages/BulkUploadPage.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import "./BulkRegister.css"; // We'll add styling below

const BulkRegister = () => {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [previewReady, setPreviewReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState(null);

  // 🧩 Parse CSV file
  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        handleParsedData(results.data);
      },
      error: (err) => alert("File parsing error: " + err.message),
    });
  };

  // 🧩 Parse Excel file
  const parseXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      handleParsedData(data);
    };
    reader.readAsBinaryString(file);
  };

  // 🧩 Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") parseCSV(file);
    else if (["xls", "xlsx"].includes(ext)) parseXLSX(file);
    else alert("Please upload a CSV or Excel file");
  };

  // 🧩 Validate rows
  const validateRows = (data) => {
    const newErrors = data.map((row) => {
      const err = [];
      if (!row.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(row.pan.trim()))
        err.push("Invalid PAN");
      if (!row.fullname) err.push("Missing Full Name");
      if (!row.dob) err.push("Missing DOB");
      return err;
    });
    setErrors(newErrors);
  };

  const handleParsedData = (data) => {
  const normalized = data.map((item) => {
    const row = {};

    // Normalize all keys: lowercase + remove spaces
    for (let key in item) {
      const cleanKey = key.toLowerCase().replace(/\s+/g, "");
      row[cleanKey] = item[key];
    }

    // 🔧 Smart mapping (handles multiple possible header names)
    return {
      pan: row.pan || row.pannumber || "",
      fullname: row.fullname || row.full_name || row.name || "",
      fathername: row.fathername || row.father_name || "",
      dob: row.dob || row.dateofbirth || row.birthdate || "",
      email: row.email || "",
      phone: row.phone || "",
    };
  });

  console.log("✅ Normalized Data:", normalized); // Debug

  setRows(normalized);
  validateRows(normalized);
  setPreviewReady(true);
  setReport(null);
};


  // 🧩 Send valid rows to backend
  const handleSubmit = async () => {
    const validRows = rows.filter((_, i) => errors[i].length === 0);
    if (validRows.length === 0) {
      alert("No valid rows to register!");
      return;
    }

    if (!window.confirm(`Proceed to register ${validRows.length} users?`))
      return;

    setUploading(true);
    try {
      const { data } = await axios.post("/api/users/bulk-register", {
        users: validRows,
      });
      setReport(data.results);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 🧩 Helper for UI
  const validCount = errors.filter((e) => e.length === 0).length;

  return (
    <div className="bulk-container">
      <h2>Bulk User Registration</h2>

      <div className="upload-box">
        <label className="upload-label">
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
          />
          <span>Select CSV / Excel File</span>
        </label>
      </div>

      {previewReady && (
        <>
          <div className="summary">
            <p>
              Total Rows: <b>{rows.length}</b>
            </p>
            <p>
              Valid Rows: <b>{validCount}</b>
            </p>
            <p>
              Invalid Rows: <b>{rows.length - validCount}</b>
            </p>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>PAN</th>
                  <th>Full Name</th>
                  <th>Father Name</th>
                  <th>DOB</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={errors[i].length ? "invalid-row" : "valid-row"}
                  >
                    <td>{i + 1}</td>
                    <td>{row.pan}</td>
                    <td>{row.fullname}</td>
                    <td>{row.fathername}</td>
                    <td>{row.dob}</td>
                    <td>{errors[i].join(", ") || "✅"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="action-bar">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="register-btn"
            >
              {uploading
                ? "Registering..."
                : `Register ${validCount} Valid Users`}
            </button>
          </div>
        </>
      )}

      {report && (
        <div className="report-section">
          <h3>Upload Report</h3>
          <table>
            <thead>
              <tr>
                <th>PAN</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={i}>
                  <td>{r.pan}</td>
                  <td>{r.success ? "✅ Success" : "❌ Failed"}</td>
                  <td>{r.errors?.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkRegister;
