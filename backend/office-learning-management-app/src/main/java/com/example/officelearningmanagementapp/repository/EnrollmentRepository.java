package com.example.officelearningmanagementapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.officelearningmanagementapp.models.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
	
	//find the enrollments of a user
	List<Enrollment> findByMyUserId(int myUserId);
	
	//find the enrollments in a course
	List<Enrollment> findByCourseId(int courseId);
	
	//find enrollment by user and course id
	Enrollment findEnrollmentByMyUserIdAndCourseId(int myUserId, int courseId);
	
	//find enrollment by id
	Enrollment findEnrollmentById(int id);
	
	
}
