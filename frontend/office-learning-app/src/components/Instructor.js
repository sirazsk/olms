import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message as antMessage } from 'antd';
import { Link } from 'react-router-dom';

import {
  getMyCourses,
  setEditingCourse,
  deleteCourse,
} from '../slices/instructor';
import { clearMessage } from '../slices/message';

const Instructor = () => {
  const dispatch = useDispatch();

  const { course, myCourses } = useSelector((state) => state.instructor);
  const { message } = useSelector((state) => state.message);
  const [my_courses, setMy_courses] = useState([]);

  console.count('rendered Instructor componenet');

  useEffect(() => {
    setMy_courses(myCourses);
    console.log('use effect for mycourses redux state ');
    //console.log(myCourses);
  }, [myCourses]);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(getMyCourses());
  }, [dispatch]);

  useEffect(() => {
    if (message !== null && message) {
      antMessage.info(message);
    }
  }, [message]);

  const handleCourseDelete = (id) => {
    console.log('deleting course with id: ' + id);
    dispatch(deleteCourse({ id }));
    dispatch(clearMessage());
    dispatch(getMyCourses())
      .unwrap()
      .then(() => {
        console.log('hello in unwrap');
        console.log(myCourses);
        setMy_courses(myCourses);
      })
      .catch((error) => {
        console.log(error);
      });

    //location.reload();
  };

  const handleEdit = (course) => {
    //console.log(course);
    dispatch(setEditingCourse(course));
  };

  const CourseComponent = (obj) => {
    const { id, courseName, courseDescription, myUser } = obj.course;
    return (
      <div className='course col-lg-3'>
        <h2>{courseName}</h2>
        <h5>
          ID:{id}
          <br></br>
          {courseDescription}
        </h5>
        <p>Author: {myUser.fullName}</p>
        <Link
          to={`/instructor/course/${id}`}
          onClick={() => {
            handleEdit(obj.course);
          }}
          className='btn btn-primary m-2'
        >
          Edit Course
        </Link>
        <button
          onClick={() => handleCourseDelete(id)}
          className='btn btn-danger m-2'
        >
          Delete Course
        </button>
      </div>
    );
  };

  return (
    <>
      <section className='container add-course'>
        <Link to={'/instructor/newcourse'}>
          <h4 className='btn btn-primary w-10'>Add New Course</h4>{' '}
        </Link>
      </section>
      <section className='container course-section'>
        <h1>My courses:</h1>
        <div className='course-center row'>
          {my_courses.map((course, index) => {
            return <CourseComponent key={index} course={course} />;
          })}
        </div>
      </section>
      <h1>Instructor here!</h1>
    </>
  );
};

export default Instructor;
