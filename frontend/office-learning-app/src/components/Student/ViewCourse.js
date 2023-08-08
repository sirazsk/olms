import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getSections, setVideoUrl } from '../../slices/instructor';
import { getSingleCourse, enrollInCourse } from '../../slices/student';
import { clearMessage } from '../../slices/message';
import { message as antMessage } from 'antd';

const ViewCourse = () => {
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.message);
  const { success, update, videoUrl } = useSelector(
    (state) => state.instructor
  );
  const [course, setCourse] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(setVideoUrl(''));
    dispatch(getSingleCourse({ courseId: id }))
      .unwrap()
      .then((resp) => {
        setCourse(resp);
      });
    dispatch(getSections({ courseId: id }))
      .unwrap()
      .then((resp) => {
        setSections(resp);
      });
  }, []);
  useEffect(() => {
    if (message !== null && message) {
      if (success) {
        antMessage.success(message);
      } else antMessage.error(message);
    }
  }, [message]);

  const enrollInACourse = () => {
    dispatch(enrollInCourse({ courseId: id }))
      .unwrap()
      .then((resp) => console.log('enroll in a course'));
  };

  return (
    <div className='container background-grey p-5'>
      <div className='course-heading'>
        <h1 className='me-5 mt-3'>{course.courseName}</h1>
        <Link to={'/student'} className='btn btn-primary'>
          <h4>Browse All Courses</h4>
        </Link>
      </div>
      <div className='d-flex align-items-end flex-column'>
        <button className='btn btn-secondary' onClick={enrollInACourse}>
          Enroll in this course
        </button>
      </div>
      <h4>{course.courseDescription}</h4>
    </div>
  );
};

export default ViewCourse;
