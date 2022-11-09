package com.example.back.controllerAdvice;

import com.example.back.Domain.Dto.errorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice("com.example.back.controller")
public class ExceptionAdvisor {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<errorResponse> returnErrorResponse(Exception exception){
        errorResponse errorResponse = new errorResponse(exception.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
