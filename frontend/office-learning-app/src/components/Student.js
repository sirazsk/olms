import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllCourses, searchCourse } from '../slices/student';
import { clearMessage } from '../slices/message';
import { message as antMessage } from 'antd';

const Student = () => {
  const [courses, setCourses] = useState([]);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const inpRef = useRef('');

  const fetchData = () => {
    dispatch(getAllCourses())
      .unwrap()
      .then((resp) => {
        setCourses(resp);
      });
  };

  useEffect(() => {
    dispatch(clearMessage());
    fetchData();
  }, []);

  useEffect(() => {
    console.log(courses);
  }, [courses]);

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
        <Link to={`/student/courses/${id}`} className='btn btn-primary m-2'>
          View course
        </Link>
      </div>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const s = inpRef.current.value;
    if (s === '') {
      antMessage.warn('input cannot be empty');
    } else {
      dispatch(searchCourse({ s }))
        .unwrap()
        .then((resp) => {
          setCourses(resp);
        });
    }
  };

  return (
    <section className='container'>
      <div className='background-grey'>
        <div className='search-section'>
          <h1>Search Course:</h1>
          <Link to={'/enrollments'} className='btn btn-primary'>
            View enrolled courses
          </Link>
        </div>

        <form className='form mb-3' onSubmit={handleSearch}>
          <label htmlFor=''>search : </label>
          <input className='mx-3' ref={inpRef}></input>
          <button className='btn btn-primary' type='submit'>
            search
          </button>
        </form>
        <button onClick={fetchData}>get all courses</button>
      </div>
      <h1 className='d-flex justify-content-center mb-5 mt-5'>Courses:</h1>
      <section className='container course-section'>
        <div className='course-center row'>
          {courses.map((course, index) => {
            return <CourseComponent key={index} course={course} />;
          })}
        </div>
      </section>
    </section>
  );
};

export default Student;
