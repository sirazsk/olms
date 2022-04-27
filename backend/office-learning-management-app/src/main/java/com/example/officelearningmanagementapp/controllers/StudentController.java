package com.example.officelearningmanagementapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.officelearningmanagementapp.models.Course;
import com.example.officelearningmanagementapp.models.Enrollment;
import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.payload.response.ApiResponse;
import com.example.officelearningmanagementapp.repository.CourseRepository;
import com.example.officelearningmanagementapp.repository.EnrollmentRepository;
import com.example.officelearningmanagementapp.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
public class StudentController {
	
	@Autowired
	CourseRepository courseRepository;
	
	@Autowired
	EnrollmentRepository enrollmentRepository;
	
	@Autowired
	UserRepository userRepository;
	
	//Student API
	
	//get all courses
	@GetMapping("/student/courses")
	public ResponseEntity<List<Course>> getAllCourses(){
		
		//delete password entry from the list
		List<Course> myCourses = courseRepository.findAll();
		myCourses.forEach(course->course.getMyUser().setPassword(null));
		return new ResponseEntity<>( myCourses,HttpStatus.OK);
	}
	
	//get course by id
	@GetMapping("/student/courses/{courseId}")
	public ResponseEntity<?> getCourse(@PathVariable("courseId") int courseId){
		Course course = courseRepository.findCourseById(courseId);
		
		if(course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist"),HttpStatus.BAD_REQUEST);
		}
		course.getMyUser().setPassword(null);
		return new ResponseEntity<>(course, HttpStatus.OK);
	}
	
	//get all enrolled courses
	@GetMapping("/student/courses/enrollment")
	public ResponseEntity<?> getEnrolledCourses(){
		
		//get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
													
		//get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		
		List<Enrollment> enrollments = enrollmentRepository.findByMyUserId(myUser.getId());
		
		return new ResponseEntity<>( enrollments,HttpStatus.OK);
	}
	
	//enroll in a course
	@PostMapping("/student/courses/{courseId}/enroll")
	public ResponseEntity<?> enrollCourse(@PathVariable("courseId") int courseId){
		
		Course course = courseRepository.findCourseById(courseId);
		if(course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist"),HttpStatus.BAD_REQUEST);
		}
		
		//get user by email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		
		if(enrollmentRepository.findEnrollmentByMyUserIdAndCourseId(myUser.getId(), courseId) != null) {
			return new ResponseEntity<>(new ApiResponse(false, "enrollment already exist"),HttpStatus.BAD_REQUEST);
		}
		
		Enrollment enrollment = new Enrollment(myUser, course, -1);
		enrollmentRepository.save(enrollment);
		return ResponseEntity.ok(new ApiResponse(true, "enrollment successfull!")); 
	}
}
