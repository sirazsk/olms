import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getEnrollments } from '../../slices/instructor';
import { getSingleCourse } from '../../slices/student';
import { clearMessage } from '../../slices/message';
import SingleEnrollment from './SingleEnrollment';
import { message as antMessage } from 'antd';

const Enrollment = () => {
  const { id } = useParams();
  const { message } = useSelector((state) => state.message);
  const { success, update, videoUrl } = useSelector(
    (state) => state.instructor
  );
  const dispatch = useDispatch();
  const [enrollment, setEnrollment] = useState([]);
  const [course, setCourse] = useState([]);
  useEffect(() => {
    if (message !== null && message) {
      if (success) {
        antMessage.success(message);
      } else antMessage.error(message);
    }
  }, [message]);
  useEffect(() => {
    dispatch(getEnrollments({ courseId: id }))
      .unwrap()
      .then((resp) => {
        setEnrollment(resp);
        console.log(resp);
      })
      .catch((error) => console.log(error));

    dispatch(getSingleCourse({ courseId: id }))
      .unwrap()
      .then((resp) => {
        setCourse(resp);
        console.log(resp);
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <>
      <div className='container background-grey'>
        <div className='course-heading'>
          <div className='me-5 mt-3'>
            <h1>
              Enrollments for <strong>{course.courseName}</strong> course
            </h1>
            <h6 className='ps-2'>ID:{course.id}</h6>
          </div>
          <Link to={'/instructor'} className='btn btn-primary'>
            <h4>Go To My Courses</h4>
          </Link>
        </div>

        <div>
          {enrollment.map((enrollment) => {
            return (
              <SingleEnrollment key={Enrollment.id} enrollment={enrollment} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Enrollment;
