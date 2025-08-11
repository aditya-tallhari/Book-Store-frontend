import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Routes,Route } from 'react-router-dom'
import Allbooks from './pages/Allbooks'
import Login from './pages/Login'
import Signup from './pages/Signup'
const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/all-books' element={<Allbooks/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App