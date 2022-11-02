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
    List<locationDto> location = new ArrayList<>();


}
