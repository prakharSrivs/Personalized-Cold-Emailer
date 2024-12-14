import { Alert, CircularProgress, Grid2, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const styles = {
  container:{
    width:"100%",
    height:"100%"
  },
  tableStyles:{
    backgroundColor:"black",
    color:"white !important",
    border:"1px solid grey",
    "& th" :{
      color:"white",
      border:"1px solid white"
    },
    "& td": {
      color:"white",
      border:"1px solid white"
    }
  }
}

const DataTable = () => {

  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDataFromAPI = async () => {
    setLoading(true);
    const config = {
      headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem("token")
      }
    }

    try{
      const response = await axios.get("http://localhost:3000/fetch/data", config);
      setRows(response.data); 
    } catch(e) {
      console.log(e.status)
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(()=>{
    fetchDataFromAPI()
  }, [])

  return (
    <Grid2>
      <Snackbar
        open={error.length>0}
        onClose={()=>setError("")}
        autoHideDuration={6000}
      >
        <Alert variant='filled' severity='error' >{error}</Alert>
      </Snackbar>
      { loading && <CircularProgress color='primary' /> }
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={styles.tableStyles}>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Profile Summary</TableCell>
              <TableCell align="left">Cold Email Content</TableCell>
              <TableCell align="left">Mobile Number</TableCell>
              <TableCell align="left">Linked Profile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableStyles}>
            {rows.map((row) => (
              <TableRow
                key={row.name}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.profile_content}</TableCell>
                <TableCell align="left">{row.cold_email_content}</TableCell>
                <TableCell align="left">{row.mobile_number}</TableCell>
                <TableCell align="left">{row.linkedin_profile_url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </TableContainer>
    </Grid2>
  )
}

export default DataTable