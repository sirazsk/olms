package com.example.officelearningmanagementapp.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import com.example.officelearningmanagementapp.models.FileInfo;
import com.example.officelearningmanagementapp.payload.response.ApiResponse;
import com.example.officelearningmanagementapp.services.FilesStorageService;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
public class FilesController {
	
	@Autowired
	FilesStorageService filesStorageService;
	
	@PostMapping("/upload")
	public ResponseEntity<ApiResponse> uploadFile(@RequestParam("file") MultipartFile file) {
	String message = "";
		try {
			filesStorageService.save(file);

			message = "Uploaded the file successfully: " + file.getOriginalFilename();
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse(true,message));
		} 
		catch (Exception e) {
			message = "Could not upload the file, change file name and retry: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ApiResponse(false,message));
		}
	}
	
	@GetMapping("/files/{filename:.+}")
	public ResponseEntity<Resource> getFile1(@PathVariable String filename) {
		Resource file = filesStorageService.load(filename);
	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}
	
	@GetMapping("/files")
	public ResponseEntity<List<FileInfo>> getListFiles() {
		List<FileInfo> fileInfos = filesStorageService.loadAll().map(path -> {
			String filename = path.getFileName().toString();
			String url = MvcUriComponentsBuilder
					.fromMethodName(FilesController.class, "getFile1", path.getFileName().toString()).build().toString();
			return new FileInfo(filename, url);
	    }).collect(Collectors.toList());
	    return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
	}
}
