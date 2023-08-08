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
public class Enrollment {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;

	@ManyToOne
	@JoinColumn(name = "my_user_id")
	private MyUser myUser;

	@ManyToOne
	@JoinColumn(name = "course_id")
	private Course course;

	private int subSectionId;

	public Enrollment(MyUser myUser, Course course, int subSectionId) {
		this.myUser = myUser;
		this.course = course;
		this.subSectionId = subSectionId;
	}

	@OneToMany(mappedBy = "enrollment", cascade = CascadeType.REMOVE)
	private List<Assignment> assignments;

	public Enrollment() {

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public MyUser getMyUser() {
		return myUser;
	}

	public void setMyUser(MyUser myUser) {
		this.myUser = myUser;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public int getSubSectionId() {
		return subSectionId;
	}

	public void setSubSectionId(int subSectionId) {
		this.subSectionId = subSectionId;
	}

}
