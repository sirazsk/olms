import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

//instructor course api
//create new course(course name should be unique)
const newCourse = (courseName, courseDescription) => {
  return axios.post(
    API_URL + 'instructor/courses',
    { courseName, courseDescription },
    { headers: authHeader() }
  );
};
//get my published courses
const getMyCourses = () => {
  return axios.get(API_URL + 'instructor/mycourses', { headers: authHeader() });
};
//CHANGE COURSE by id (only changes course if course name unchanged, or if name already in use, or if course belongs to the user(checked in backend for all conditions))
const updateCourse = (courseName, courseDescription, id) => {
  return axios.put(
    API_URL + 'instructor/courses/' + id,
    { courseName, courseDescription },
    { headers: authHeader() }
  );
};
//DELETE COURSE by id (deletes course if the user is the owner)
const deleteCourse = (id) => {
  return axios.delete(API_URL + `instructor/courses/${id}`, {
    headers: authHeader(),
  });
};

const instructorService = {
  newCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
};

export default instructorService;
