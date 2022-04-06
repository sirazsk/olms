import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';

import { logout } from './slices/auth';
import Video from './components/Video';

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <Router>
      <div>
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
          <Link to={'../home'} className='navbar-brand'>
            Office Learning Management App
          </Link>
          <div className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link to={'../home'} className='nav-link'>
                Home
              </Link>
            </li>

            {currentUser && (
              <div className='navbar-nav mr-auto'>
                <li>
                  <Link to={'../profile'} className='nav-link'>
                    User
                  </Link>
                </li>
                <li>
                  <Link to={'../video'} className='nav-link'>
                    Video
                  </Link>
                </li>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <Link to={'../profile'} className='nav-link'>
                  {currentUser.username}
                </Link>
              </li>
              <li className='nav-item'>
                <a href='/login' className='nav-link' onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <Link to={'../login'} className='nav-link'>
                  Login
                </Link>
              </li>

              <li className='nav-item'>
                <Link to={'../register'} className='nav-link'>
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className='container mt-3'>
          <Routes>
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/video' element={<Video />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/profile' element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
