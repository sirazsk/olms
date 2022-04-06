package com.example.officelearningmanagementapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.officelearningmanagementapp.models.Course;
import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.payload.request.NewCourseRequest;
import com.example.officelearningmanagementapp.payload.response.ApiResponse;
import com.example.officelearningmanagementapp.repository.CourseRepository;
import com.example.officelearningmanagementapp.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
public class MainController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	CourseRepository courseRepository;
	
	//test
	@GetMapping("/hello")
    public String hello()
    {
		//courseRepository.deleteAll();
        return  "hi";
    }
	//get all users
	@GetMapping("/users")
	public ResponseEntity<List<MyUser>> getAllUsers()
	{
		return new ResponseEntity<>( userRepository.findAll(),HttpStatus.OK);
	}
	//get all courses
	@GetMapping("/student/courses")
	public ResponseEntity<List<Course>> getAllCourses()
	{
		return new ResponseEntity<>( courseRepository.findAll(),HttpStatus.OK);
	} 
	
	//INSTRUCTOR API
	//add new course
	@PostMapping("/instructor/courses")
	public ResponseEntity<?> createNewCourse(@Valid @RequestBody NewCourseRequest courseRequest){
		String courseName = courseRequest.getCourseName();
        String courseDescription = courseRequest.getCourseDescription();
        
        if(courseRepository.findCourseByCourseName(courseName) != null) {
        	return new ResponseEntity<>(new ApiResponse(false, "Course Name already in use!"),HttpStatus.BAD_REQUEST);
        }
		
		//get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        //get user by email
        MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
        
        
        //create new course and add it to the repository
        Course course = new Course(courseName,courseDescription,myUser);
        courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse(true, "new course added successfully"));
	}
	
	//get courses created by the current user
	@GetMapping("/instructor/mycourses")
	public ResponseEntity<List<Course>> getMyCourses()
	{
		//get current user email
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentUserEmail = authentication.getName();
		
		//get user by email
		MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		int userId = myUser.getId();
		List<Course> myCourses = courseRepository.findByMyUserId(userId);
		return new ResponseEntity<>(myCourses, HttpStatus.OK);
	}
	
	//update course
	@PutMapping("/instructor/courses/{id}")
	public ResponseEntity<ApiResponse> updateCourse(@PathVariable("id") int id, @Valid @RequestBody NewCourseRequest courseRequest){
		
		Course course = courseRepository.findCourseById(id);
		if(course == null) {
			return ResponseEntity.ok(new ApiResponse(false, "course does not exist"));
		}
		
		String courseName = courseRequest.getCourseName();
        String courseDescription = courseRequest.getCourseDescription();
        
        System.out.println("course.getCourseName() "+course.getCourseName()+" actual name "+courseName);
        System.out.println(" boolean compare "+course.getCourseName() == (courseName));
        if(!course.getCourseName().equals(courseName) && courseRepository.findCourseByCourseName(courseName) != null) {
        	return new ResponseEntity<>(new ApiResponse(false, "Course Name already in use!"),HttpStatus.BAD_REQUEST);
        }
        
        
        //get current user email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
              
        //get user by email
        MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
        
        if(course.getMyUser().getId() != myUser.getId()) {
        	return new ResponseEntity<>(new ApiResponse(false, "not authorized to update this course"),HttpStatus.BAD_REQUEST);
        }
        
        course.setCourseName(courseName);
        course.setCourseDescription(courseDescription);
        courseRepository.save(course);
		return ResponseEntity.ok(new ApiResponse(true, "Course updated successfully!"));
	}
	
	//delete course
	@DeleteMapping("/instructor/courses/{id}")
	public ResponseEntity<ApiResponse> deleteCourse(@PathVariable("id") int id ){
		Course course = courseRepository.findCourseById(id);
		if(course == null) {
			return ResponseEntity.ok(new ApiResponse(false, "course does not exist"));
		}

		//get current user email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
              
        //get user by email
        MyUser myUser = userRepository.findUserByEmail(currentUserEmail);
		
        if(course.getMyUser().getId() != myUser.getId()) {
        	return new ResponseEntity<>(new ApiResponse(false, "not authorized to delete this course"),HttpStatus.BAD_REQUEST);
        }
        courseRepository.deleteById(id);
        return new ResponseEntity<>(new ApiResponse(true, "Course deleted successfully!"),HttpStatus.BAD_REQUEST); 
	}
	
	
	
}
