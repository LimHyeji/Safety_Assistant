package com.example.back.Domain.Dto;

import com.example.back.Domain.Entity.user;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.lang.Nullable;

import javax.persistence.Column;

@Data @AllArgsConstructor
public class signDto {

    private String userId;
    private String password;
    private String gender;
    private String phoneNum;
    @Nullable private String parentPhoneNum;
    private boolean idx;
    private String house;
    private String school;
    private String startTime;

    public user toEntity(){
        user user = new user();
        user.setUserId(userId);
        user.setPassword(password);
        user.setGender(gender);
        user.setPhoneNum(phoneNum);
        user.setIdx(idx);
        user.setHouse(house);
        user.setSchool(school);
        user.setStartTime(startTime);

        return user;
    }

}
