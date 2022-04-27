package com.example.officelearningmanagementapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.officelearningmanagementapp.models.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer>{
	
	//find assignments by enrollment id
	List<Assignment> findByEnrollmentId(int enrollmentId);
	
	
}
