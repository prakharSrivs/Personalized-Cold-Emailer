import MenuIcon from '@mui/icons-material/Menu';
import { Box, ButtonBase } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const styles = {
    container:{
        background:"#000000",
        height:"80px",
        width:"100%",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        padding:"0 10px"
    },
    menuIcon:{
      color:"white",
      fontSize:"34px",
      cursor:"pointer"
    },
    logoutButton:{
      color:"white",
      border:"2px solid white",
      fontFamily:"Montserrat",
      padding:"10px 25px",
      fontSize:"18px",
      borderRadius:"5px",
      marginRight:"30px"
    }
}

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <Box sx={styles.container}>
      <MenuIcon sx={styles.menuIcon} />  
      <ButtonBase sx={styles.logoutButton} onClick={handleLogout}>
        Logout
      </ButtonBase>
    </Box>
  )
}

export default Navbar