import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to='/login' />;
  }

  return (
    <div className='container'>
      <header className='jumbotron'>
        <h3>
          <strong>{currentUser.fullName}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.jwt.substring(0, 20)} ...{' '}
        {currentUser.jwt.substr(currentUser.jwt.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <p>
        <strong>Full Name:</strong> {currentUser.fullName}
      </p>
    </div>
  );
};

export default Profile;
