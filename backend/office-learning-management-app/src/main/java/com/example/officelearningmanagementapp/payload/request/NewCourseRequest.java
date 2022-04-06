package com.example.officelearningmanagementapp.payload.request;

public class NewCourseRequest {
	private String courseName;
	private String courseDescription;
	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public String getCourseDescription() {
		return courseDescription;
	}
	public void setCourseDescription(String couseDescription) {
		this.courseDescription = couseDescription;
	}
	
}
