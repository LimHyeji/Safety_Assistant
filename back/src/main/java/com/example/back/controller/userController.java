package com.example.back.controller;

import com.example.back.Domain.Dto.*;
import com.example.back.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class userController {

    private final UserService userService;

    @PostMapping("/user/signup")
    public jsonResponse execSignup(@Validated @RequestBody signDto signDto) {
            jsonResponse jsonReponse = new jsonResponse();
            jsonReponse.setMsg("It is Check to communicate");
            log.info(signDto.getUserId()+"!!!!!!!!!!!!!!!!!!!!!");
            log.info(signDto.getPassword()+"!!!!!!!!!!!!!!!!!!!!!");
            userService.joinUser(signDto);
            return jsonReponse;
    }


    @PostMapping("/user/login")
    public ResponseDto login(@RequestBody LoginRequest loginRequest) {
        ResponseDto responseDto = userService.loginChk(loginRequest.getUserId(), loginRequest.getPassword());
        return responseDto;
        // 로그인 상태유지와 더불어서 token으로 이제 API를 사용할수가 있습니다.
    }

    @PostMapping("/user/child")
    public childrenDto req(@RequestBody childrenDto childrenDto) {
        childrenDto dto1 = userService.childrenRequest(childrenDto);
        return dto1;
    }


}
