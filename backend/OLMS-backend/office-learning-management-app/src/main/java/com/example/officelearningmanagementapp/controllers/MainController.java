package com.example.officelearningmanagementapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.repository.CourseRepository;
import com.example.officelearningmanagementapp.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
public class MainController {

	@Autowired
	UserRepository userRepository;

	@Autowired
	CourseRepository courseRepository;

	// test
	@GetMapping("/hello")
	public String hello() {
		// courseRepository.deleteAll();
		return "welcome to office learning app";
	}

	// get all users
	@GetMapping("/users")
	public ResponseEntity<List<MyUser>> getAllUsers() {
		return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
	}

}
