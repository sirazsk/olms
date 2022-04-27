package com.example.officelearningmanagementapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.officelearningmanagementapp.models.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
	//find sections by course id
	List<Section> findByCourseId(int courseId);
	
	//find if a section by the name exists in the same course
	Section findSectionByCourseIdAndSectionName(int courseId, String sectionName);
	
	//find section by section id 
	Section findSectionById(int id);

}
