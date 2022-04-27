import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.min.css';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Student from './components/Student';
import Video from './components/Video';
import Instructor from './components/Instructor';
import EditCourse from './components/Instructor/EditCourse';
import NewCourse from './components/Instructor/NewCourse';

import { logout, setIsInstructor, setIsStudent } from './slices/auth';
import AddSection from './components/Instructor/AddSection';

const App = () => {
  const { user: currentUser, isInstructor } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const setInstructor = useCallback(() => {
    dispatch(setIsInstructor());
  }, [isInstructor]);

  const setStudent = useCallback(() => {
    dispatch(setIsStudent());
  }, [isInstructor]);

  console.count('rendered App');
  return (
    <Router>
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
              {isInstructor ? (
                <Link
                  className='nav-link'
                  to={'../student'}
                  onClick={setStudent}
                >
                  Go To Student
                </Link>
              ) : (
                <Link
                  className='nav-link'
                  to={'../instructor'}
                  onClick={setInstructor}
                >
                  Go To Instructor
                </Link>
              )}
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

      <main className='container-fluid mt-3'>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/video' element={<Video />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/instructor' element={<Instructor />} />
          <Route exact path='/student' element={<Student />} />
          <Route exact path='/instructor/course/:id' element={<EditCourse />} />
          <Route exact path='/instructor/newcourse' element={<NewCourse />} />
          <Route
            exact
            path='/instructor/course/:courseId/section'
            element={<AddSection />}
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
