import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection, where, query } from 'firebase/firestore';
import NavBar from './components/NavBar';
import { getPosts } from './firebaseFunctions';
import Profile from './pages/Profile';

function App() {


  return (

    <div className=" bg-white">

     
        <BrowserRouter>
        
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Home/>} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
