package com.example.officelearningmanagementapp.payload.response;

public class AuthenticationResponse {
	private int id;
	
    public int getId() {
		return id;
	}

	public void setId(int userId) {
		this.id = userId;
	}

	private String jwt;
    private String fullName;
    private String email;

    public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

	public AuthenticationResponse(String jwt, String fullName, String email, int userId) {
		this.id = userId;
		this.jwt = jwt;
		this.fullName = fullName;
		this.email = email;
	}

    
}