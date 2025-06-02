import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const HdfcStatement = () => {
  const [currentBalance, setCurrentBalance] = useState(null); // Store current balance here

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Read sheet as a 2D array

        let balanceFound = false;
        let lastBalanceRowIndex = -1;

        // Iterate over rows and find all "Closing Bal" matches in G column (index 6)
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];

          // Check if the value in G column (index 6) contains "Closing Bal"
          if (row[6] && row[6].toString().includes("Closing Bal")) {
            lastBalanceRowIndex = i; // Track the last match of "Closing Bal" in G column
          }
        }

        // If a "Closing Bal" match is found, extract the value from the next row in G column
        if (lastBalanceRowIndex !== -1 && lastBalanceRowIndex + 1 < jsonData.length) {
          const nextRow = jsonData[lastBalanceRowIndex + 1]; // Get the next row (below)
          setCurrentBalance(nextRow[6]); // Get the balance from the G column of the next row
          balanceFound = true;
        }

        if (!balanceFound) {
          alert("Couldn't find 'Closing Bal' in the G column.");
        }
      };

      reader.readAsBinaryString(file); // Read the file as binary
    } else {
      alert('Please upload a valid XLS or XLSX file!');
    }
  };

  return (
    <div className="HdfcStatement">
      <div className="file-upload-container">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </div>

      {/* Display 'Current Balance' */}
      {currentBalance !== null && (
        <div className="current-balance">
          <h3>Current Balance: {currentBalance}</h3>
        </div>
      )}
    </div>
  );
};

export default HdfcStatement;
