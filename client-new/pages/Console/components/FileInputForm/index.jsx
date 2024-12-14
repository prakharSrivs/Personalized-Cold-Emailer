import { Alert, Button, ButtonBase, Grid2, Snackbar } from '@mui/material'
import axios from 'axios';
import * as XLSX from "xlsx";
import React, { useState } from 'react'
import { cleanData } from '../../../../utils';
import { styles } from './styles';
import { useNavigate } from 'react-router-dom';

const FileInputForm = () => {

    const [file, setFile] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
          setError(""); 
        }
    };

    const handleUpload = async (e) => {
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
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("token")
                }
            }

            const response = await axios.post("http://localhost:3000/process", {
              data: JSON.stringify(jsonData),
            }, config);

            if( response.status == 201 ) {
              setOpenSnackbar(true);
              setMessage("Data has been fetched please move over to the data page to access the data")
            }
    
          } catch (error) {
            if( error?.status == 401 ) navigate("/")

            setError("Failed to process the file or communicate with the server.");
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
    };

  return (
    <Grid2 sx={styles.container}>
        <Snackbar 
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={message}
        />
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity='error' variant='filled' >{error}</Alert>
        </Snackbar>
        <label style={styles.fileInputLabel} htmlFor='file-input'>Click to Upload an Excel File</label>
        <input 
            style={styles.fileInput} 
            id='file-input' 
            type='file' 
            accept=".xlsx,.xls"
            onChange={handleFileChange}
        />
        <ButtonBase sx={styles.submitButton} onClick={handleUpload} disabled={loading}>
          { loading ? "Loading..." : "Submit" }
        </ButtonBase>
        <Button color='success' style={styles.accessDataButton} onClick={()=>navigate("/app/data")}>
          Access Data
        </Button>
    </Grid2>
  )
}

export default FileInputForm