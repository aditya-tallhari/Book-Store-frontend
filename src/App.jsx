import React from 'react'
import Navbar from './components/Layouts/Navbar'
import Footer from './components/Layouts/Footer'
import Home from './pages/Home'
import { Routes,Route } from 'react-router-dom'
import Allbooks from './pages/Allbooks'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ViewBookDetails from './components/Book-details/ViewBookDetails'
const App = () => {
  return (
    // Apply min-h-screen and flex flex-col to the root div to enable sticky footer
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      {/* The main content area should flex-grow to push the footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/all-books' element={<Allbooks/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/view-details/:id' element={<ViewBookDetails/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App