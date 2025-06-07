import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/Homepage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import bgImage from './assets/bgImage.svg';

const App = () => {
  const { authUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-white flex justify-center items-center min-h-screen">Loading...</div>;x``
    
  }

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;



// import React, { useContext } from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import LoginPage from './pages/LoginPage'
// import HomePage from './pages/Homepage'
// import ProfilePage from './pages/ProfilePage'
// import {Toaster} from "react-hot-toast";
// import { AuthContext } from '../context/AuthContext'
// import bgImage from './assets/bgImage.svg';


// const App = () => {
//   const {authUser} = useContext(AuthContext)

//   return (
//     <div className="bg-[url('./src/assets/bgImage.svg')]
//     bg-contain">
//       <Toaster/>
//       <Routes>
//         <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/>}/>
        
//         <Route path='/login' element={authUser ? <LoginPage /> : <Navigate to="/"/>}/>
        
//         <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login"/>}/>
//       </Routes>
//     </div>
//   )
// }

// export default App