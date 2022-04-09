package com.example.officelearningmanagementapp.payload.response;

import com.example.officelearningmanagementapp.models.Course;

public class NewCourseResponse {
	private Boolean success;
    private String message;
    private Course course;

    public NewCourseResponse(Boolean success, String message, Course course) {
		super();
		this.success = success;
		this.message = message;
		this.course = course;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
