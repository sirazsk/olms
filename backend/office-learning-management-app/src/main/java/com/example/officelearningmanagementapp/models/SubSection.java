package com.example.officelearningmanagementapp.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class SubSection {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	private String subSectionName;
	
	private String subSectionDescription;
	
	private String videoUrl;
	
	@ManyToOne
	@JoinColumn(name = "section_id")
	private Section section;
	
	public SubSection() {
		
	}	
	
	public SubSection(String subSectionName, String subSectionDescription, String videoUrl, Section section) {
		this.subSectionName = subSectionName;
		this.subSectionDescription = subSectionDescription;
		this.videoUrl = videoUrl;
		this.section = section;
	}

	public String getVideoUrl() {
		return videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSubSectionName() {
		return subSectionName;
	}

	public void setSubSectionName(String subSectionName) {
		this.subSectionName = subSectionName;
	}

	public String getSubSectionDescription() {
		return subSectionDescription;
	}

	public void setSubSectionDescription(String subSectionDescription) {
		this.subSectionDescription = subSectionDescription;
	}

	public Section getSection() {
		return section;
	}

	public void setSection(Section section) {
		this.section = section;
	}
	
	
}
