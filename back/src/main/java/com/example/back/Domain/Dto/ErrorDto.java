package com.example.back.Domain.Dto;

import lombok.Data;

@Data
public class ErrorDto {
    int status;
    String msg;
}
