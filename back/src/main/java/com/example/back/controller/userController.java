package com.example.back.controller;

import com.example.back.Domain.Dto.LoginRequest;
import com.example.back.Domain.Dto.ResponseDto;
import com.example.back.Domain.Dto.signDto;
import com.example.back.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class userController {

    private final UserService userService;

    @PostMapping("/user/signup")
    public void execSignup(@Validated @RequestBody signDto signDto) {
//        try {
            userService.joinUser(signDto);
//        } catch(IllegalStateException e){
//            String errMsg = e.getMessage();
//            model.addAttribute("errMsg",errMsg);
//            return "/ShowErr";
//        }
        //일단 test용이라서 void로 진행한다.
    }


    @PostMapping("/user/login")
    public ResponseDto login(@RequestBody LoginRequest loginRequest) {
        ResponseDto responseDto = userService.loginChk(loginRequest.getUserId(), loginRequest.getPassword());
        return responseDto;
        // 로그인 상태유지와 더불어서 token으로 이제 API를 사용할수가 있습니다.
    }


}
