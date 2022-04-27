package com.example.officelearningmanagementapp.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Course {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	private String courseName;
	
	private String courseDescription;
	
	@ManyToOne
	@JoinColumn(name="my_user_id")
	private MyUser myUser;
	
	@OneToMany(mappedBy = "course", cascade = CascadeType.REMOVE)
	private List<Section> sections;
	
	@OneToMany(mappedBy = "course", cascade = CascadeType.REMOVE)
	private List<Enrollment> enrollments;

	public Course() {

	}

	public Course(String courseName, String courseDescription, MyUser myUser) {
		this.courseName = courseName;
		this.courseDescription = courseDescription;
		this.myUser = myUser;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

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

	public MyUser getMyUser() {
		return myUser;
	}

	public void setMyUser(MyUser myUser) {
		this.myUser = myUser;
	}
}
