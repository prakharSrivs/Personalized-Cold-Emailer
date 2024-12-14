import { useState } from 'react'
import './App.css'
import Onboarding from '../pages/Onboarding';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Console from '../pages/Console';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Onboarding />} /> 
        <Route path={"/app/*"} element={<Console />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
