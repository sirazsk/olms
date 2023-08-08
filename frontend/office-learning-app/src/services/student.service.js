import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

//get single course details
const getSingleCourse = (courseId) => {
  return axios.get(API_URL + `student/courses/${courseId}`, {
    headers: authHeader(),
  });
};

//get all courses
const getAllCourses = () => {
  return axios.get(API_URL + 'student/courses', { headers: authHeader() });
};

//search course
const searchCourse = (s) => {
  return axios.get(API_URL + `student/courses/${s}/search`, {
    headers: authHeader(),
  });
};

//enroll in a course
const enrollInCourse = (courseId) => {
  return axios.post(API_URL + `student/courses/${courseId}/enroll`, {
    headers: authHeader(),
  });
};

//get all enrolled courses
const getEnrolledCourses = () => {
  return axios.get(API_URL + 'student/courses/enrollment');
};

const studentService = {
  getSingleCourse,
  getAllCourses,
  searchCourse,
  enrollInCourse,
  getEnrolledCourses,
};

export default studentService;
