package com.example.officelearningmanagementapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.officelearningmanagementapp.models.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
	// get courses by the author
	List<Course> findByMyUserId(int myUserId);

	// find courses by course name containing
	List<Course> findByCourseNameContaining(String courseName);

	// get course by course name
	Course findCourseByCourseName(String courseName);

	// get course by course id
	Course findCourseById(int id);

	// delete course by id
	void deleteById(int id);

	// delete all
	@Override
	void deleteAll();
}
