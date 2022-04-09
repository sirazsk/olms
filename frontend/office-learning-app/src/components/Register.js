import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { register } from '../slices/auth';
import { clearMessage } from '../slices/message';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .test(
        'len',
        'The fullName must be between 3 and 20 characters.',
        (val) =>
          val && val.toString().length >= 3 && val.toString().length <= 40
      )
      .required('This field is required!'),
    email: Yup.string()
      .email('This is not a valid email.')
      .required('This field is required!'),
    password: Yup.string()
      .test(
        'len',
        'The password must be between 6 and 40 characters.',
        (val) =>
          val && val.toString().length >= 3 && val.toString().length <= 40
      )
      .required('This field is required!'),
  });

  const handleRegister = (formValue) => {
    const { fullName, email, password } = formValue;

    setSuccessful(false);

    dispatch(register({ fullName, email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  if (isLoggedIn) {
    return <Navigate to='/home' />;
  }

  return (
    <div className='col-md-12 signup-form'>
      <div className='card card-container'>
        <img
          src='//ssl.gstatic.com/accounts/ui/avatar_2x.png'
          alt='profile-img'
          className='profile-img-card'
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className='form-group'>
                  <label htmlFor='fullName' className='form-label'>
                    FullName
                  </label>
                  <Field
                    name='fullName'
                    type='text'
                    className='form-control form-label'
                  />
                  <ErrorMessage
                    name='fullName'
                    component='div'
                    className='alert alert-danger'
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='email' className='form-label'>
                    Email
                  </label>
                  <Field
                    name='email'
                    type='email'
                    className='form-control form-label'
                  />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className='alert alert-danger'
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='password' className='form-label'>
                    Password
                  </label>
                  <Field
                    name='password'
                    type='password'
                    className='form-control form-label'
                  />
                  <ErrorMessage
                    name='password'
                    component='div'
                    className='alert alert-danger form-label'
                  />
                </div>

                <div className='form-group text-center form-label'>
                  <button
                    type='submit'
                    className='btn btn-primary btn-block w-100 mb-4'
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>

      {message && (
        <div className='form-group'>
          <div
            className={
              successful ? 'alert alert-success' : 'alert alert-danger'
            }
            role='alert'
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
