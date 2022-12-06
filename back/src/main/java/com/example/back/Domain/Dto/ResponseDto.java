package com.example.back.Domain.Dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponseDto {
    int status;
    String header = "Authorization";
    String startsWith = "Bearer";
    String token;
    String userName;
    String userId;
    String phoneNum;
    boolean idx;
    childrenLoginDto myLocation;
    List<locationDto> childrenInfo = new ArrayList<>();


}
