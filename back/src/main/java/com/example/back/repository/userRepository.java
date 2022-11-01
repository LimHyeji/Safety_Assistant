package com.example.back.repository;

import com.example.back.Domain.Entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface userRepository extends JpaRepository<user,Long> {
    user findByPhoneNum(String phoneNum);  //일단 테스트 후 Optional로 바꿀 예정.
    Optional<user> findByUserId(String userName);
    Optional<user> findByUserIdAndPassword(String userId,String password);
}
