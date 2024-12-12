import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import './App.css'
import { cleanData } from "../utils";

const App = () => {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(""); 
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an Excel file");
      return;
    }
    setLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const d = e.target.result;
        const workbook = XLSX.read(d, { type: "array" });
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];

        const jsonData = cleanData(XLSX.utils.sheet_to_json(sheet));

        const response = await axios.post("http://localhost:3000/process", {
          data: JSON.stringify(jsonData),
        });

        console.log(response)

        const resp = await axios.get("http://localhost:3000/fetch/data");
        console.log(resp);
        setRows(resp?.data);

      } catch (error) {
        setError("Failed to process the file or communicate with the server.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>Excel File Upload and Data Display</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ marginBottom: "10px" }}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Upload"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {rows.length > 0 && (
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr>
              {/* Dynamically generate table headers from the first row of data */}
              {Object.keys(rows[0]).map((key) => (
                <th
                  key={key}
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td
                    key={idx}
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
