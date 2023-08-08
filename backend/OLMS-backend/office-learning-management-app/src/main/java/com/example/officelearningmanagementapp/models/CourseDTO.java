package com.example.officelearningmanagementapp.models;

public class CourseDTO {
	private String courseName;
	private String courseDescription;
	private String author;
	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public String getCourseDescription() {
		return courseDescription;
	}
	public void setCourseDescription(String courseDescription) {
		this.courseDescription = courseDescription;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public CourseDTO(String courseName, String courseDescription, String author) {
		super();
		this.courseName = courseName;
		this.courseDescription = courseDescription;
		this.author = author;
	}
	public CourseDTO() {
	}	
}
