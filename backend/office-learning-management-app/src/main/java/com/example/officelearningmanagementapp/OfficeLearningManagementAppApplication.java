package com.example.officelearningmanagementapp;

import javax.annotation.Resource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.officelearningmanagementapp.services.FilesStorageService;


@SpringBootApplication
public class OfficeLearningManagementAppApplication implements CommandLineRunner {
	
	@Resource
	FilesStorageService storageService;
	
	public static void main(String[] args) {
		SpringApplication.run(OfficeLearningManagementAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		//storageService.deleteAll();
		//storageService.init();
		
	}
	
	
}
