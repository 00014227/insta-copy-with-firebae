import { BrowserRouter,  Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';


function App() {


  return (

    <div className=" bg-white">

     
        <BrowserRouter>
        
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Home/>} />
            <Route path='/profile/:id' element={<Profile />} />
        
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
