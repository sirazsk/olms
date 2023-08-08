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

//section api
//create section
const newSection = (courseId, sectionName) => {
  return axios.post(
    API_URL + `instructor/courses/${courseId}/section`,
    { sectionName },
    { headers: authHeader() }
  );
};

//get all sections in a course
const getSection = (courseId) => {
  return axios.get(API_URL + `instructor/courses/${courseId}/section`, {
    headers: authHeader(),
  });
};

//update section
const updateSection = (courseId, sectionId, sectionName) => {
  return axios.put(
    API_URL + `instructor/courses/${courseId}/section/${sectionId}`,
    { sectionName },
    { headers: authHeader() }
  );
};

//delete section
const deleteSection = (courseId, sectionId) => {
  return axios.delete(
    API_URL + `instructor/courses/${courseId}/section/${sectionId}`,
    { headers: authHeader() }
  );
};

//sub section api
//create subsection
const newSubSection = (sectionId, subSectionName, subSectionDescription) => {
  return axios.post(
    API_URL + `instructor/courses/section/${sectionId}/subsection`,
    { subSectionName, subSectionDescription },
    { headers: authHeader() }
  );
};

//get subsections in a section
const getSubSection = (sectionId) => {
  return axios.get(
    API_URL + `instructor/courses/section/${sectionId}/subsection`,
    { headers: authHeader() }
  );
};

//update subsection
const updateSubSection = (
  sectionId,
  subSectionId,
  subSectionName,
  subSectionDescription
) => {
  return axios.put(
    API_URL +
      `instructor/courses/section/${sectionId}/subsection/${subSectionId}`,
    { subSectionName, subSectionDescription },
    { headers: authHeader() }
  );
};

//delete subsection
const deleteSubSection = (sectionId, subSectionId) => {
  return axios.delete(
    API_URL +
      `instructor/courses/section/${sectionId}/subsection/${subSectionId}`,
    { headers: authHeader() }
  );
};

//upload or update video in a subsection
const uploadVideo = (subSectionId, file) => {
  let formData = new FormData();
  formData.append('file', file);

  return axios.post(
    API_URL + `instructor/courses/section/subsection/${subSectionId}/upload`,
    formData,
    { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } }
  );
};

//get enrollments in a course
const getEnrollments = (courseId) => {
  return axios.get(API_URL + `instructor/courses/${courseId}/enrollments`, {
    headers: authHeader(),
  });
};

//add assignment marks to an enrollment
const newAssignment = (enrollmentId, assignmentName, grade) => {
  return axios.post(
    API_URL + `instructor/enrollments/${enrollmentId}/assignment`,
    { assignmentName, grade },
    { headers: authHeader() }
  );
};

//get all assignments for the enrollment no
const getAssignments = (enrollmentId) => {
  return axios.get(
    API_URL + `instructor/enrollments/${enrollmentId}/assignment`,
    { headers: authHeader() }
  );
};

const instructorService = {
  newCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  newSection,
  getSection,
  updateSection,
  deleteSection,
  newSubSection,
  getSubSection,
  updateSubSection,
  deleteSubSection,
  uploadVideo,
  getEnrollments,
  newAssignment,
  getAssignments,
};

export default instructorService;
