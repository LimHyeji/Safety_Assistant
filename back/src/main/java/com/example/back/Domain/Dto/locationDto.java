package com.example.back.Domain.Dto;

import com.example.back.Domain.Dto.locDto.house;
import com.example.back.Domain.Dto.locDto.school;
import lombok.Data;

@Data
public class locationDto {
    String userId;
    String houselat;
    String houselng;
    String schoollat;
    String schoollng;
    String userName;
    String phoneNum;
    boolean idx;
    int duration;
}
