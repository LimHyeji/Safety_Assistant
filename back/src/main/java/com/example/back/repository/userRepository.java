package com.example.back.repository;

import com.example.back.Domain.Entity.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface userRepository extends JpaRepository<user,Long> {
    user findByPhoneNum(String phoneNum);  //일단 테스트 후 Optional로 바꿀 예정.

    @Query("select u from user u join fetch u.parent")
    Optional<user> findByPhoneNumWithParent(String phoneNum);

    Optional<user> findByUserId(String userName);
    Optional<user> findByUserIdAndPassword(String userId,String password);
}
