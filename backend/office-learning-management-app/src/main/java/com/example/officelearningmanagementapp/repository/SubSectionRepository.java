package com.example.officelearningmanagementapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.officelearningmanagementapp.models.SubSection;

@Repository
public interface SubSectionRepository extends JpaRepository<SubSection, Integer> {
	
	//find subsections for the section id
	List<SubSection> findBySectionId(int sectionId);
	
	//to check whether if a name is repeated in subsection
	SubSection findSubSectionBySectionIdAndSubSectionName(int sectionId, String subSectionName);
	
	//find sub section by id
	SubSection findSubSectionById(int id);
}
