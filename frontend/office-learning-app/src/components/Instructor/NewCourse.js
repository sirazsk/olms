import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { message as antMessage } from 'antd';

import { newCourse } from '../../slices/instructor';
import { clearMessage } from '../../slices/message';

const NewCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = useSelector((state) => state.message);
  const { course } = useSelector((state) => state.instructor);
  const successRef = useRef(false);

  const initialValues = {
    courseName: '',
    courseDescription: '',
  };

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    //console.log(successRef.current);
    setTimeout(() => {
      console.log(successRef.current);
      if (message !== null && message) {
        if (successRef.current) {
          antMessage.success(message, onClose);
        } else antMessage.error(message);
      }
    }, 10);
  }, [message]);

  const onClose = () => {
    console.log('on close called');
    console.log(course);
    navigate(`/instructor/course/${course.id}/section`);
  };

  const validationSchema = Yup.object().shape({
    courseName: Yup.string()
      .test(
        'len',
        'The courseName must be between 3 and 20 characters.',
        (val) =>
          val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required('This field is required!'),
    courseDescription: Yup.string()
      .test(
        'len',
        'The courseDescription must be between 10 and 100 characters.',
        (val) =>
          val && val.toString().length >= 10 && val.toString().length <= 100
      )
      .required('This field is required!'),
  });

  const handleNewCourse = (formValue) => {
    const { courseName, courseDescription } = formValue;
    dispatch(newCourse({ courseName, courseDescription }))
      .unwrap()
      .then(() => {
        successRef.current = true;
        console.log('in unwrap');
      })
      .catch((error) => {
        successRef.current = false;
        console.log(error);
      });
  };

  return (
    <div className='background-grey form-main go-back'>
      <Link to={'/instructor'} className='btn btn-primary'>
        <h4>Go To My Courses</h4>
      </Link>
      <h1 className='m-5'>Add New Course</h1>
      <div className='form'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleNewCourse}
        >
          <Form>
            <div>
              <div className='form-group'>
                <label htmlFor='courseName' className='form-label'>
                  courseName
                </label>
                <Field
                  name='courseName'
                  type='text'
                  className='form-control form-label'
                />
                <ErrorMessage
                  name='courseName'
                  component='div'
                  className='alert alert-danger'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='courseDescription' className='form-label'>
                  courseDescription
                </label>
                <Field
                  component='textarea'
                  rows='4'
                  name='courseDescription'
                  type='text'
                  className='form-control form-label'
                />
                <ErrorMessage
                  name='courseDescription'
                  component='div'
                  className='alert alert-danger'
                />
              </div>

              <div className='form-group text-center form-label'>
                <button
                  type='submit'
                  className='btn btn-primary btn-block w-25 my-3'
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default NewCourse;
