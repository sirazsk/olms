package com.example.officelearningmanagementapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.payload.request.LoginRequest;
import com.example.officelearningmanagementapp.payload.request.SignUpRequest;
import com.example.officelearningmanagementapp.payload.response.ApiResponse;
import com.example.officelearningmanagementapp.payload.response.AuthenticationResponse;
import com.example.officelearningmanagementapp.repository.UserRepository;
import com.example.officelearningmanagementapp.security.jwt.JwtUtil;
import com.example.officelearningmanagementapp.security.services.MyUserDetailsService;

import javax.validation.Valid;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    MyUserDetailsService userDetailsService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/checkUser")
    public String checkUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return  currentPrincipalName;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        MyUser myUser = userRepository.findUserByEmail(loginRequest.getEmail());
        String fullName=myUser.getFullName();
        String email=myUser.getEmail();
        int id=myUser.getId();
        return ResponseEntity.ok(new AuthenticationResponse(jwt, fullName, email,id));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {


        if(userRepository.findUserByEmail(signUpRequest.getEmail()) != null) {
            return new ResponseEntity<>(new ApiResponse(false, "Email Address already in use!"),HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        MyUser jwtUser = new MyUser();
        jwtUser.setEmail(signUpRequest.getEmail());
        jwtUser.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        jwtUser.setFullName(signUpRequest.getFullName());
        userRepository.save(jwtUser);
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    }
}