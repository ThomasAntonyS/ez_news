import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NewsContext from './context/NewsContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SingleCategory from './pages/SingleCategory';
import Search from './pages/Search';
import Modal from './components/Modal';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import UserVerification from './pages/UserVerification';
import ForgotPassword from './pages/ForgotPassword';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('seenWelcomePopup');
    if (!hasSeenPopup) {
      setShowModal(true);
      sessionStorage.setItem('seenWelcomePopup', 'true');
    }
  }, []);

  return (
    <div className={showModal ? 'overflow-hidden' : ''}>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
      
      <BrowserRouter>
        <AuthProvider>
          <NewsContext>
            <Routes>
              <Route element={<Home />} path='/' />
              <Route element={<SingleCategory />} path='/:category/:page' /> 
              <Route element={<Search />} path='/search/:q/:page' />
              
              <Route 
                path='/profile' 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path='/login' 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path='/signup' 
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                } 
              />

              <Route
                path='/verify'
                element={
                  <PublicRoute>
                    <UserVerification/>
                  </PublicRoute>
                }  
              />

              <Route
                path='/reset-password'
                element={
                  <PublicRoute>
                    <ForgotPassword/>
                  </PublicRoute>
                }  
              />

              <Route element={<NotFound />} path='/error-not-found' />
              <Route path='*' element={<Navigate to="/error-not-found" replace />} />
            </Routes>
          </NewsContext>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;