import { Box, Grid2 } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Navbar from './components/navbar'
import FileInputForm from './components/FileInputForm'
import DataTable from '../Table'
import { useNavigate } from 'react-router-dom'

const styles = {
    container:{
        width: "100vw",
        height: "100vh",
        overflow:"hidden",
    },
    boxContainer:{
        height:"100%",
    },
    leftBox:{
        width:"100%",
        height:"100%"
    },
}

const Console = () => {

    const [showTable, setShowTable] = useState(false);
    const pathname = window.location.pathname;
    const navigate = useNavigate();

    useEffect(()=>{
        if(pathname.includes("data")) setShowTable(true);
        if(!localStorage.getItem("token") || !localStorage.getItem("username")) navigate("/")
    }, [pathname])
    

  return (
    <Grid2 sx={styles.container}>
        <Navbar />
        <Box sx={styles.boxContainer}>
            { showTable ? <DataTable /> : <FileInputForm /> }
        </Box>
    </Grid2>
  )
}

export default Console