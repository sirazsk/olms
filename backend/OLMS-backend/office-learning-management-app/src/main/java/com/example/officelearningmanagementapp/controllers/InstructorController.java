package com.example.officelearningmanagementapp.controllers;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import com.example.officelearningmanagementapp.models.Assignment;
import com.example.officelearningmanagementapp.models.Course;
import com.example.officelearningmanagementapp.models.CourseDTO;
import com.example.officelearningmanagementapp.models.Enrollment;
import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.models.Section;
import com.example.officelearningmanagementapp.models.SubSection;
import com.example.officelearningmanagementapp.payload.request.AssignmentRequest;
import com.example.officelearningmanagementapp.payload.request.NewCourseRequest;
import com.example.officelearningmanagementapp.payload.request.NewSectionRequest;
import com.example.officelearningmanagementapp.payload.request.NewSubSectionRequest;
import com.example.officelearningmanagementapp.payload.response.ApiResponse;
import com.example.officelearningmanagementapp.payload.response.NewCourseResponse;
import com.example.officelearningmanagementapp.payload.response.NewSectionResponse;
import com.example.officelearningmanagementapp.payload.response.NewSubSectionResponse;
import com.example.officelearningmanagementapp.repository.AssignmentRepository;
import com.example.officelearningmanagementapp.repository.CourseRepository;
import com.example.officelearningmanagementapp.repository.EnrollmentRepository;
import com.example.officelearningmanagementapp.repository.SectionRepository;
import com.example.officelearningmanagementapp.repository.SubSectionRepository;
import com.example.officelearningmanagementapp.repository.UserRepository;
import com.example.officelearningmanagementapp.services.FilesStorageService;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
public class InstructorController {

	@Autowired
	UserRepository userRepository;

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	SectionRepository sectionRepository;

	@Autowired
	SubSectionRepository subSectionRepository;

	@Autowired
	EnrollmentRepository enrollmentRepository;
	
	@Autowired
	AssignmentRepository assignmentRepository;

	@Autowired
	FilesStorageService filesStorageService;
	
	@Autowired
	KafkaTemplate<String, CourseDTO> kafkaTemplate;
	
	private static final String TOPIC = "Course_topic";

	private final Path root = Paths.get("uploads");

	// INSTRUCTOR API

	// Course api
	// add new course
	@PostMapping("/instructor/courses")
	public ResponseEntity<?> createNewCourse(@Valid @RequestBody NewCourseRequest courseRequest) {
		String courseName = courseRequest.getCourseName();
		String courseDescription = courseRequest.getCourseDescription();

		if (courseRepository.findCourseByCourseName(courseName) != null) {
			return new ResponseEntity<>(new ApiResponse(false, "Course Name already in use!"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		// create new course and add it to the repository
		Course course = new Course(courseName, courseDescription, myUser);
		
		//send to kafka topic
		CourseDTO courseObject = new CourseDTO(courseName, courseDescription, myUser.getFullName());
		kafkaTemplate.send(TOPIC, courseObject);
		
		courseRepository.save(course);
		course.getMyUser().setPassword(null);
		return ResponseEntity.ok(new NewCourseResponse(true, "new course added successfully", course));
	}

	// get courses created by the current user
	@GetMapping("/instructor/mycourses")
	public ResponseEntity<List<Course>> getMyCourses() {
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		int userId = myUser.getId();
		List<Course> myCourses = courseRepository.findByMyUserId(userId);

		// delete password entry from the list
		myCourses.forEach(course -> course.getMyUser().setPassword(null));

		return new ResponseEntity<>(myCourses, HttpStatus.OK);
	}

	// update course
	@PutMapping("/instructor/courses/{id}")
	public ResponseEntity<?> updateCourse(@PathVariable("id") int id,
			@Valid @RequestBody NewCourseRequest courseRequest) {

		Course course = courseRepository.findCourseById(id);
		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist"), HttpStatus.BAD_REQUEST);
		}

		String courseName = courseRequest.getCourseName();
		String courseDescription = courseRequest.getCourseDescription();

		System.out.println("course.getCourseName() " + course.getCourseName() + " actual name " + courseName);
		System.out.println(" boolean compare " + course.getCourseName() == (courseName));

		if (!course.getCourseName().equals(courseName) && courseRepository.findCourseByCourseName(courseName) != null) {
			return new ResponseEntity<>(new ApiResponse(false, "Course Name already in use!"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (course.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized to update this course"),
					HttpStatus.BAD_REQUEST);
		}

		course.setCourseName(courseName);
		course.setCourseDescription(courseDescription);
		courseRepository.save(course);
		course.getMyUser().setPassword(null);
		return ResponseEntity.ok(new NewCourseResponse(true, "Course updated successfully!", course));
	}

	// delete course
	@DeleteMapping("/instructor/courses/{id}")
	public ResponseEntity<ApiResponse> deleteCourse(@PathVariable("id") int id) {
		Course course = courseRepository.findCourseById(id);
		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist!"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (course.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized to delete this course"),
					HttpStatus.BAD_REQUEST);
		}
		courseRepository.deleteById(id);
		return ResponseEntity.ok(new ApiResponse(true, "Course deleted successfully!"));
	}

	// section api
	// add new section
	@PostMapping("/instructor/courses/{courseId}/section")
	public ResponseEntity<?> createNewSection(@PathVariable("courseId") int courseId,
			@Valid @RequestBody NewSectionRequest newSectionRequest) {
		String sectionName = newSectionRequest.getSectionName();

		// get course by course id
		Course course = courseRepository.findCourseById(courseId);

		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist!"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (myUser.getId() != course.getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}

		if (sectionRepository.findSectionByCourseIdAndSectionName(courseId, sectionName) != null) {
			return new ResponseEntity<>(new ApiResponse(false, "Section Name already in your course!"),
					HttpStatus.BAD_REQUEST);
		}

		Section section = new Section(sectionName, course);
		sectionRepository.save(section);
		section.getCourse().getMyUser().setPassword(null);
		return ResponseEntity.ok(new NewSectionResponse(true, "new section added successfully", section));
	}

	// get all the sections in the course by course id
	@GetMapping("/instructor/courses/{id}/section")
	public ResponseEntity<List<Section>> getSections(@PathVariable("id") int courseId) {

		List<Section> sections = sectionRepository.findByCourseId(courseId);
		sections.sort(Comparator.comparing(Section::getId));

		sections.forEach(section -> section.getCourse().getMyUser().setPassword(null));
		return new ResponseEntity<>(sections, HttpStatus.OK);
	}

	// update section
	@PutMapping("/instructor/courses/{courseId}/section/{sectionId}")
	public ResponseEntity<?> updateSection(@PathVariable("courseId") int courseId,
			@PathVariable("sectionId") int sectionId, @Valid @RequestBody NewSectionRequest newSectionRequest) {

		Section section = sectionRepository.findSectionById(sectionId);

		Course course = courseRepository.findCourseById(courseId);

		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist"), HttpStatus.BAD_REQUEST);
		}

		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "Section does not exist"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (course.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized to update this course"),
					HttpStatus.BAD_REQUEST);
		}

		System.out.println(
				"section id from course " + section.getCourse().getId() + " section id from request " + sectionId);
		if (section.getCourse().getId() != courseId) {
			return new ResponseEntity<>(new ApiResponse(false, "Section doesn't belong to this course"),
					HttpStatus.BAD_REQUEST);
		}

		String sectionName = newSectionRequest.getSectionName();

		if (!section.getSectionName().equals(sectionName)
				&& sectionRepository.findSectionByCourseIdAndSectionName(courseId, sectionName) != null) {
			return new ResponseEntity<>(new ApiResponse(false, "Section Name already in use in this course!"),
					HttpStatus.BAD_REQUEST);
		}

		section.setSectionName(sectionName);
		sectionRepository.save(section);
		section.getCourse().getMyUser().setPassword(null);
		return ResponseEntity.ok(new NewSectionResponse(true, "Section updated successfully!", section));
	}

	// delete section
	@DeleteMapping("/instructor/courses/{courseId}/section/{sectionId}")
	public ResponseEntity<ApiResponse> deleteSection(@PathVariable("courseId") int courseId,
			@PathVariable("sectionId") int sectionId) {

		Course course = courseRepository.findCourseById(courseId);

		Section section = sectionRepository.findSectionById(sectionId);

		if (course == null) {
			return new ResponseEntity<>(new ApiResponse(false, "course does not exist!"), HttpStatus.BAD_REQUEST);
		}

		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "Section does not exist"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (course.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized to delete this course"),
					HttpStatus.BAD_REQUEST);
		}

		if (section.getCourse().getId() != courseId) {
			return new ResponseEntity<>(new ApiResponse(false, "Section doesn't belong to this course"),
					HttpStatus.BAD_REQUEST);
		}

		sectionRepository.deleteById(sectionId);
		return ResponseEntity.ok(new ApiResponse(true, "Section deleted successfully!"));
	}

	// SubSection Api
	// add new subsection
	@PostMapping("/instructor/courses/section/{sectionId}/subsection")
	public ResponseEntity<?> createNewSubSection(@PathVariable("sectionId") int sectionId,
			@Valid @RequestBody NewSubSectionRequest newSubSectionRequest) {
		String subSectionName = newSubSectionRequest.getSubSectionName();
		String subSectionDescription = newSubSectionRequest.getSubSectionDescription();

		Section section = sectionRepository.findSectionById(sectionId);

		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "section does not exist!"), HttpStatus.BAD_REQUEST);
		}

		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (myUser.getId() != section.getCourse().getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}

		if (subSectionRepository.findSubSectionBySectionIdAndSubSectionName(sectionId, subSectionName) != null) {
			return new ResponseEntity<>(new ApiResponse(false, " sub section Name already in use in this section!"),
					HttpStatus.BAD_REQUEST);
		}

		SubSection subSection = new SubSection(subSectionName, subSectionDescription, "", section);
		subSectionRepository.save(subSection);
		subSection.getSection().getCourse().getMyUser().setPassword(null);
		return ResponseEntity.ok(new NewSubSectionResponse(true, "new sub section added successfully", subSection));
	}

	// get all the subsections in the section by section id
	@GetMapping("/instructor/courses/section/{sectionId}/subsection")
	public ResponseEntity<?> getSubSections(@PathVariable("sectionId") int sectionId) {
		
		Section section = sectionRepository.findSectionById(sectionId);
		
		
		//restrict access to only the original creator of the course
		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "section does not exist!"), HttpStatus.BAD_REQUEST);
		}
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (myUser.getId() != section.getCourse().getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}
		
		List<SubSection> subSections = subSectionRepository.findBySectionId(sectionId);

		// sort
		subSections.sort(Comparator.comparing(SubSection::getId));
		subSections.forEach(subsection -> subsection.getSection().getCourse().getMyUser().setPassword(null));
		return new ResponseEntity<>(subSections, HttpStatus.OK);
	}

	// update subsection
	@PutMapping("/instructor/courses/section/{sectionId}/subsection/{subSectionId}")
	public ResponseEntity<?> updateSubSection(@PathVariable("sectionId") int sectionId,
			@PathVariable("subSectionId") int subSectionId,
			@Valid @RequestBody NewSubSectionRequest newSubSectionRequest) {

		SubSection subSection = subSectionRepository.findSubSectionById(subSectionId);

		Section section = sectionRepository.findSectionById(sectionId);

		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "section does not exist"), HttpStatus.BAD_REQUEST);
		}
		if (subSection == null) {
			return new ResponseEntity<>(new ApiResponse(false, "sub section does not exist"), HttpStatus.BAD_REQUEST);
		}
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (myUser.getId() != section.getCourse().getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}

		if (subSection.getSection().getId() != sectionId) {
			return new ResponseEntity<>(new ApiResponse(false, "sub section doesn't belong to this section"),
					HttpStatus.BAD_REQUEST);
		}

		String subSectionName = newSubSectionRequest.getSubSectionName();
		String subSectionDescription = newSubSectionRequest.getSubSectionDescription();

		if (!subSection.getSubSectionName().equals(subSectionName) && (subSectionRepository
				.findSubSectionBySectionIdAndSubSectionName(sectionId, subSectionName) != null)) {
			return new ResponseEntity<>(new ApiResponse(false, "sub section Name already in use in this section!"),
					HttpStatus.BAD_REQUEST);
		}

		subSection.setSubSectionName(subSectionName);
		subSection.setSubSectionDescription(subSectionDescription);
		subSectionRepository.save(subSection);
		subSection.getSection().getCourse().getMyUser().setPassword(null);
		return ResponseEntity.ok(new NewSubSectionResponse(true, "sub section updated successfully!", subSection));
	}

	// delete subsection
	@DeleteMapping("/instructor/courses/section/{sectionId}/subsection/{subSectionId}")
	public ResponseEntity<?> deleteSubSection(@PathVariable("sectionId") int sectionId,
			@PathVariable("subSectionId") int subSectionId) {

		SubSection subSection = subSectionRepository.findSubSectionById(subSectionId);

		Section section = sectionRepository.findSectionById(sectionId);

		if (section == null) {
			return new ResponseEntity<>(new ApiResponse(false, "section does not exist"), HttpStatus.BAD_REQUEST);
		}
		if (subSection == null) {
			return new ResponseEntity<>(new ApiResponse(false, "sub section does not exist"), HttpStatus.BAD_REQUEST);
		}
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		if (myUser.getId() != section.getCourse().getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}

		if (subSection.getSection().getId() != sectionId) {
			return new ResponseEntity<>(new ApiResponse(false, "sub section doesn't belong to this section"),
					HttpStatus.BAD_REQUEST);
		}

		subSectionRepository.deleteById(subSectionId);
		return ResponseEntity.ok(new ApiResponse(true, "sub section deleted successfully!"));
	}

	// video upload to a subsection functionality

	@GetMapping("/video/{filename:.+}")
	public ResponseEntity<Resource> getFile(@PathVariable String filename) {
		Resource file = filesStorageService.load(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
				.body(file);
	}

	// same method to upload and update the video
	@PostMapping("/instructor/courses/section/subsection/{subSectionId}/upload")
	public ResponseEntity<ApiResponse> uploadFile(@RequestParam("file") MultipartFile file,
			@PathVariable("subSectionId") int subSectionId) {

		SubSection subSection = subSectionRepository.findSubSectionById(subSectionId);

		if (subSection == null) {
			return new ResponseEntity<>(new ApiResponse(false, "sub section does not exist"), HttpStatus.BAD_REQUEST);
		}
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		if (myUser.getId() != subSection.getSection().getCourse().getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}

		String message = "";
		try {
			String filename = Integer.toString(subSectionId);

			// delete video if exists and update the video
			if (subSection.getVideoUrl() != "") {
				File fileToDelete = new File(this.root.resolve(filename).toString());
				fileToDelete.delete();
				message = "Updated the file successfully: " + file.getOriginalFilename();
			} else {
				message = "Uploaded the file successfully: " + file.getOriginalFilename();
			}

			filesStorageService.saveVideo(file, filename);

			String videoUrl = MvcUriComponentsBuilder.fromMethodName(InstructorController.class, "getFile", filename)
					.build().toString();

			subSection.setVideoUrl(videoUrl);
			subSectionRepository.save(subSection);

			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse(true, message));
		} catch (Exception e) {
			System.out.println(e.toString());
			message = "Could not upload the file " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ApiResponse(false, message));
		}
	}

	// find enrollments in a course
	@GetMapping("/instructor/courses/{courseId}/enrollments")
	public ResponseEntity<?> enrollmentsInCourse(@PathVariable("courseId") int courseId) {
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();

		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);

		Course course = courseRepository.findCourseById(courseId);

		if (course.getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}

		List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
		enrollments.forEach(enrollment -> enrollment.getMyUser().setPassword(null));
		enrollments.forEach(enrollment -> enrollment.getCourse().getMyUser().setPassword(null));
		return new ResponseEntity<>(enrollments, HttpStatus.OK);
	}
	
	//add assignment grades for an enrollment
	@PostMapping("/instructor/enrollments/{enrollmentId}/assignment")
	public ResponseEntity<?> addAssignment(@PathVariable("enrollmentId") int enrollmentId, @Valid @RequestBody AssignmentRequest assignmentRequest){
		String assignmentName = assignmentRequest.getAssignmentName();
		String grade = assignmentRequest.getGrade();
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		
		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		
		Enrollment enrollment = enrollmentRepository.findEnrollmentById(enrollmentId);
		
		if(enrollment.getCourse().getMyUser().getId() != myUser.getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}
		
		Assignment assignment = new Assignment(enrollment,assignmentName,grade);
		assignmentRepository.save(assignment);
		
		return ResponseEntity.ok(new ApiResponse(true, "grade added successfully!"));
	}
	
	//get all the assignments for the enrollment no
	@GetMapping("/instructor/enrollments/{enrollmentId}/assignment")
	public ResponseEntity<?> getAssignments(@PathVariable("enrollmentId") int enrollmentId){
		// get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		// get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		Enrollment enrollment = enrollmentRepository.findEnrollmentById(enrollmentId);
		if(myUser.getId()!=enrollment.getCourse().getMyUser().getId()) {
			return new ResponseEntity<>(new ApiResponse(false, "not authorized, not your course!"),
					HttpStatus.BAD_REQUEST);
		}
		List<Assignment> assignments = assignmentRepository.findByEnrollmentId(enrollmentId);
		assignments.forEach(assignment->assignment.getEnrollment().getMyUser().setPassword(null));
		assignments.forEach(assignment->assignment.getEnrollment().getCourse().getMyUser().setPassword(null));
		return new ResponseEntity<>(assignments,HttpStatus.OK);
	}
}
