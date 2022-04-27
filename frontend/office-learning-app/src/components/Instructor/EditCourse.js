import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { message as antMessage } from 'antd';

import { updateCourse } from '../../slices/instructor';
import { clearMessage } from '../../slices/message';

const EditCourse = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.message);
  const { editingCourse } = useSelector((state) => state.instructor);

  const successRef = useRef(false);

  const initialValues = {
    courseName: editingCourse.courseName,
    courseDescription: editingCourse.courseDescription,
  };

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (message !== null && message) {
      if (successRef.current) antMessage.success(message);
      else antMessage.error(message);
    }
  }, [message]);

  const validationSchema = Yup.object().shape({
    courseName: Yup.string()
      .test(
        'len',
        'The courseName must be between 3 and 40 characters.',
        (val) =>
          val && val.toString().length >= 3 && val.toString().length <= 40
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

  const handleUpdateCourse = (formValue) => {
    const { courseName, courseDescription } = formValue;
    dispatch(updateCourse({ courseName, courseDescription, id }))
      .unwrap()
      .then(() => {
        successRef.current = true;
      })
      .catch((error) => {
        successRef.current = false;
        console.log(error);
      });
  };

  return (
    <div className='background-grey form-main go-back'>
      <div>
        <Link to={'/instructor'} className='btn btn-primary mx-2'>
          <h4>Go To My Courses</h4>
        </Link>
        <Link
          to={`/instructor/course/${editingCourse.id}/section`}
          className='btn btn-primary mx-2'
        >
          <h4>Add sections</h4>
        </Link>
      </div>

      <h1 className='m-5'>Update Course</h1>
      <div className='form'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleUpdateCourse}
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

export default EditCourse;
