import { Alert, Box, Button, Grid, Grid2, Input, Snackbar, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = {
  container:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    width:"100vw",
    height:"100vh"
  },
  headerText:{
    fontFamily:"Montserrat",
    color:"white",
    fontSize:"34px",
    fontWeight:"600",
    display:"flex",
    justifyContent:"center",
    flexDirection:"column",
    alignItems:"center",
    lineHeight:"18px",
    marginBottom:"25px"
  },
  blueText:{
    color:"#3399FF"
  },
  loginBoxContainer:{
    background:"#040404",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:"10px",
    padding:"60px 80px",
    flexDirection:"column",
    gap:"25px"
  },
  inputBox:{
    background: "#18191B",
    padding: "15px 15px",
    fontFamily:"Montserrat",
    fontSize:"18px",
    color:"#CDCDCD",
    borderRadius:"5px"
  },
  submitButton:{
    background:"#3399FF",
    color:"white",
    maxWidth:"200px",
    fontFamily:"Montserrat",
    fontSize:"14px",
    padding:"10px 20px",
    marginTop:"20px",
    fontWeight:"600"
  }
}

const LoginBox = ({ children }) => {
  return (
    <Grid2 sx={styles.loginBoxContainer}> 
      {children}
    </Grid2>
  )
}



const Onboarding = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if( !username.length || !password.length ) {
      setError("Empty Fields");
      return;
    } 
    setLoading(true);
    try{
      const response = await axios.post("http://localhost:3000/user/access", {username, password}) 
      const data = response.data;
      localStorage.setItem("username",username);
      localStorage.setItem("token",data.token);
      navigate("/app")
    } catch(e) {
      setError(e.message)
    } 
    setLoading(false);
  }
  

  return (
    <Box sx={styles.container}>
      <Snackbar  
        open={error.length > 0}
        onClose={()=>setError("")}
        autoHideDuration={6000}
      >
        <Alert severity='error' variant='filled' >{error}</Alert>
      </Snackbar>
      <LoginBox>
        <Typography sx={styles.headerText}>
          <span style={styles.blueText}>Personalized</span> <br/> Cold Emails
        </Typography>
        <input 
          style={styles.inputBox} 
          placeholder='Username' 
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />  
        <input 
          style={styles.inputBox} 
          placeholder='Password' 
          value={password}
          type='password'
          onChange={(e)=>setPassword(e.target.value)}  
        />
        <Button 
          sx={styles.submitButton} 
          type='submit' 
          onClick={handleSubmit}
          disabled={loading}
        >
          { loading ? "Loading..." : "Login / Signup" }
        </Button>
      </LoginBox>
    </Box>
  )
}

export default Onboarding