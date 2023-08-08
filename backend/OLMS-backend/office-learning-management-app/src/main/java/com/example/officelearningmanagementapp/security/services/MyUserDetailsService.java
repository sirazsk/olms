package com.example.officelearningmanagementapp.security.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.officelearningmanagementapp.models.MyUser;
import com.example.officelearningmanagementapp.repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		MyUser myUser = userRepository.findUserByEmail(email);
		if (myUser == null) {
			throw new UsernameNotFoundException("email not found " + email);
		}
		return new User(myUser.getEmail(), myUser.getPassword(), new ArrayList<>());
	}

}
