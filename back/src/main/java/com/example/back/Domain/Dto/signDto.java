package com.example.back.Domain.Dto;

import com.example.back.Domain.Entity.user;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.lang.Nullable;

@Data @AllArgsConstructor
public class signDto {

    private String userId;
    private String userName;
    private String password;
    private String phoneNum;
    @Nullable private String parentPhoneNum;
    private boolean idx;
    @Nullable private String houselat;
    @Nullable private String houselng;
    @Nullable private String schoollat;
    @Nullable private String schoollng;
    @Nullable private int duration;

    public user toEntity(){
        user user = new user();
        user.setUserId(userId);
        user.setUserName(userName);
        user.setPassword(password);
        user.setPhoneNum(phoneNum);
        user.setIdx(idx);
        return user;
    }

}
