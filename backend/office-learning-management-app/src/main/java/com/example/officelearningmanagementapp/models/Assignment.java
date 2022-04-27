package com.example.officelearningmanagementapp.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Assignment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "enrollment_id")
	private Enrollment enrollment;
	
	private String assignmentName;
	
	private String grade;
	
	public Assignment() {

	}

	public Assignment(Enrollment enrollment, String assignmentName, String grade) {
		this.enrollment = enrollment;
		this.assignmentName = assignmentName;
		this.grade = grade;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Enrollment getEnrollment() {
		return enrollment;
	}

	public void setEnrollment(Enrollment enrollment) {
		this.enrollment = enrollment;
	}

	public String getAssignmentName() {
		return assignmentName;
	}

	public void setAssignmentName(String assignmentName) {
		this.assignmentName = assignmentName;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}
	
	
	
}
