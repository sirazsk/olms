package com.example.officelearningmanagementapp.payload.response;

import com.example.officelearningmanagementapp.models.SubSection;

public class NewSubSectionResponse {
	private Boolean success;
	private String message;
	private SubSection subSection;
	
	
	
	public NewSubSectionResponse(Boolean success, String message, SubSection section) {
		this.success = success;
		this.message = message;
		this.subSection = section;
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
	public SubSection getSubSection() {
		return subSection;
	}
	public void setSubSection(SubSection section) {
		this.subSection = section;
	}
	
	

}
