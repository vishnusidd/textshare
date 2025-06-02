import React, { useState } from 'react';
import * as XLSX from 'xlsx';


function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [fileData, setFileData] = useState([]);

  
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    // Allow both .xls and .xlsx file extensions internally
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert the sheet to JSON data
        setFileData(jsonData); // Store the parsed data in state
      };

      reader.readAsBinaryString(file); // Read the file as binary
    } else {
      alert('Please upload a valid XLS or XLSX file!');
    }
  };
  const handlePost = () => {
    if (text.trim() === '') return;

    const newPost = {
      id: Date.now(),
      content: text,
      createdAt: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]);
    setText('');
  };

  return (
    <div>
      <div className="post-box">
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>
      <div className="App">
      <div className="file-upload-container">
        {/* Only show .xlsx files in file input, but support .xls and .xlsx internally */}
        <input
          type="file"
          accept=".xls" // Only show .xlsx in the input dialog
          onChange={handleFileUpload}
        />
      </div>

      {/* Display parsed data in a table */}
      {fileData.length > 0 && (
        <div className="data-display">
          <table>
            <thead>
              <tr>
                {Object.keys(fileData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
      <div className="feed">
        {posts.length === 0 ? (
          <p>No posts yet. Start the conversation!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <p>{post.content}</p>
              <small>{post.createdAt}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
