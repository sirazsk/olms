package com.example.officelearningmanagementapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.officelearningmanagementapp.models.MyUser;

@Repository
public interface UserRepository extends JpaRepository<MyUser, Integer> {
	MyUser findUserByEmail(String email);
}
