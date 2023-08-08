package com.example.officelearningmanagementapp.controllers;

import java.util.Comparator;
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

import com.example.officelearningmanagementapp.models.Assignment;
import com.example.officelearningmanagementapp.models.Course;
import com.example.officelearningmanagementapp.models.Enrollment;
import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.models.Section;
import com.example.officelearningmanagementapp.models.SubSection;
import com.example.officelearningmanagementapp.payload.response.ApiResponse;
import com.example.officelearningmanagementapp.repository.AssignmentRepository;
import com.example.officelearningmanagementapp.repository.CourseRepository;
import com.example.officelearningmanagementapp.repository.EnrollmentRepository;
import com.example.officelearningmanagementapp.repository.SectionRepository;
import com.example.officelearningmanagementapp.repository.SubSectionRepository;
import com.example.officelearningmanagementapp.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
public class StudentController {

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	EnrollmentRepository enrollmentRepository;
	
	@Autowired
	SectionRepository sectionRepository;
	
	@Autowired
	SubSectionRepository subSectionRepository;

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	AssignmentRepository assignmentRepository;
	
	

	// Student API

	// get all courses
	@GetMapping("/student/courses")
	public ResponseEntity<List<Course>> getAllCourses() {

		// delete password entry from the list
		List<Course> myCourses = courseRepository.findAll();
		myCourses.forEach(course -> course.getMyUser().setPassword(null));
		return new ResponseEntity<>(myCourses, HttpStatus.OK);
	}

	// search course
	@GetMapping("/student/courses/{courseName}/search")
	public ResponseEntity<List<Course>> searchCourse(@PathVariable("courseName") String courseName) {
		List<Course> myCourses = courseRepository.findByCourseNameContaining(courseName);
		myCourses.forEach(course -> course.getMyUser().setPassword(null));
		return new ResponseEntity<>(myCourses, HttpStatus.OK);
	}

	//get single course 
	@GetMapping("/student/courses/{courseId}")
	public ResponseEntity<?> getCourse(@PathVariable("courseId") int courseId) {
		Course course = courseRepository.findCourseById(courseId);

		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist"), HttpStatus.BAD_REQUEST);
		}
		course.getMyUser().setPassword(null);
		return new ResponseEntity<>(course, HttpStatus.OK);
	}

	// get all enrolled courses
	@GetMapping("/student/courses/enrollment")
	public ResponseEntity<?> getEnrolledCourses() {

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		List<Enrollment> enrollments = enrollmentRepository.findByMyUserId(myUser.getId());

		enrollments.forEach(enrollment -> enrollment.getMyUser().setPassword(null));
		enrollments.forEach(enrollment -> enrollment.getCourse().getMyUser().setPassword(null));
		return new ResponseEntity<>(enrollments, HttpStatus.OK);
	}

	// enroll in a course
	@PostMapping("/student/courses/{courseId}/enroll")
	public ResponseEntity<?> enrollCourse(@PathVariable("courseId") int courseId) {

		Course course = courseRepository.findCourseById(courseId);
		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist"), HttpStatus.BAD_REQUEST);
		}

		// get user by email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (course.getMyUser().getId() == myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "cannot enroll in your own course"),
					HttpStatus.BAD_REQUEST);
		}

		if (enrollmentRepository.findEnrollmentByMyUserIdAndCourseId(myUser.getId(), courseId) != null) {
			return new ResponseEntity<>(new ApiResponse(false, "enrollment already exist"), HttpStatus.BAD_REQUEST);
		}

		Enrollment enrollment = new Enrollment(myUser, course, -1);
		enrollmentRepository.save(enrollment);
		return ResponseEntity.ok(new ApiResponse(true, "enrollment successfull!"));
	}

	// update subsection till watched
	@PostMapping("/student/courses/enroll/{enrollmentId}/subsection/{subsectionId}")
	public ResponseEntity<?> updateTillWatched(@PathVariable("enrollmentId") int enrollmentId,
			@PathVariable("subsectionId") int subsectionId) {
		Enrollment enrollment = enrollmentRepository.findEnrollmentById(enrollmentId);
		if (enrollment == null) {
			return new ResponseEntity<>(new ApiResponse(false, "enrollment does not exist"), HttpStatus.BAD_REQUEST);
		}

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (enrollment.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not your enrollment id"), HttpStatus.BAD_REQUEST);
		}

		SubSection subSection = subSectionRepository.findSubSectionById(subsectionId);

		if (enrollment.getCourse().getId() != subSection.getSection().getCourse().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "subsection does not belong to the enrolled course"),
					HttpStatus.BAD_REQUEST);
		}

		enrollment.setSubSectionId(subsectionId);
		enrollmentRepository.save(enrollment);

		return ResponseEntity.ok(new ApiResponse(true, "updated till watched!"));
	}
	
	//check user assignment grades
	@GetMapping("/student/enrollment/{enrollmentId}/assignments")
	public ResponseEntity<?> getAssignments(@PathVariable("enrollmentId") int enrollmentId){
		Enrollment enrollment = enrollmentRepository.findEnrollmentById(enrollmentId);
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		if(enrollment.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not your enrollment id"), HttpStatus.BAD_REQUEST);
		}
		List<Assignment> assignments = assignmentRepository.findByEnrollmentId(enrollmentId);
		
		return new ResponseEntity<>(assignments, HttpStatus.OK);
	}
	
	//return subsection names only if not enrolled and subsection object if enrolled
	@GetMapping("/student/courses/section/{sectionId}/subsection")
	public ResponseEntity<?> getSubSections(@PathVariable("sectionId") int sectionId){
		Section section = sectionRepository.findSectionById(sectionId);
		
		
		//restrict access to full subsection only when enrolled
		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "section does not exist!"), HttpStatus.BAD_REQUEST);
		}
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		
		int courseId = section.getCourse().getId();
		
		List<SubSection> subSections = subSectionRepository.findBySectionId(sectionId);

		// sort
		subSections.sort(Comparator.comparing(SubSection::getId));
		subSections.forEach(subsection -> subsection.getSection().getCourse().getMyUser().setPassword(""));
		
		if (enrollmentRepository.findEnrollmentByMyUserIdAndCourseId(myUser.getId(), courseId) != null) {
			
			return new ResponseEntity<>(subSections,HttpStatus.OK);
		}
		
		subSections.forEach(subSection->subSection.setSubSectionDescription(""));
		subSections.forEach(subSection->subSection.setVideoUrl(""));
		
		
		return new ResponseEntity<>(subSections, HttpStatus.OK);
	}
}
