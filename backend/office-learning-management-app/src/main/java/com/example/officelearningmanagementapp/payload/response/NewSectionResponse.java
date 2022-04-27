package com.example.officelearningmanagementapp.payload.response;

import com.example.officelearningmanagementapp.models.Section;

public class NewSectionResponse {
	private Boolean success;
    private String message;
    private Section section;
	public NewSectionResponse(Boolean success, String message, Section section) {
		this.success = success;
		this.message = message;
		this.section = section;
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
	public Section getSection() {
		return section;
	}
	public void setSection(Section section) {
		this.section = section;
	}
    
}
