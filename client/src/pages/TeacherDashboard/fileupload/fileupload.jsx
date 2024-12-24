import React, { useState, useRef } from "react";
import { Button, IconButton, Grid } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from "@mui/icons-material/Delete";
import "./fileupload.css"; 

const App = () => {
  const [files, setFiles] = useState([]);
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleDeleteAllFiles = () => {
    setFiles([]);
    hiddenFileInput.current.value = null;
  };

  const handleSubmit = () => {
    console.log("Files uploaded:", files);
  };

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
      <div className="app-form" style={{ width: '100%', maxWidth: '600px', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} p={2}>
            <label>Upload Files</label>
            {/* File Upload UI */}
            <div className="file-uploader" style={{ border: '1px solid #ced4da', borderRadius: '3px', display: 'flex', justifyContent: 'space-between' }}>
              <div className="file-div" style={{ display: 'flex', width: '85%' }}>
                <Button className="attachment-icon" onClick={handleClick}>
                  <AttachmentIcon />
                  <input
                    type="file"
                    accept="image/*, .pdf, .doc, .docx"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    hidden
                    multiple
                  />
                  <div className="file-name" style={{ marginLeft: '0.5rem' }}>
                    {files.length > 0 ? (
                      files.map((file, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span>{file.name}</span>
                          <IconButton onClick={() => handleDeleteFile(index)} color="secondary" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      ))
                    ) : (
                      <div>Choose files</div>
                    )}
                  </div>
                </Button>
              </div>
              <div>
                <IconButton aria-label="delete" color="primary" onClick={handleDeleteAllFiles}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} p={2} style={{ textAlign: 'end' }}>
            <Button variant="outlined" onClick={() => setFiles([])}>
              Cancel
            </Button>
            <Button variant="contained" style={{ marginLeft: "1rem" }} onClick={handleSubmit}>
              Upload
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default App;
