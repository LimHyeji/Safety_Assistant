package com.example.back.service;


import com.example.back.Domain.Dto.LoginRequest;
import com.example.back.Domain.Dto.ResponseDto;
import com.example.back.Domain.Dto.locationDto;
import com.example.back.Domain.Dto.signDto;
import com.example.back.Domain.Entity.user;
import com.example.back.JwtTokenProvider;
import com.example.back.repository.userRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final JwtTokenProvider jwtTokenProvider;
    private final userRepository userRepository;

    @Transactional
    public void joinUser(signDto signDto) {  //회원가입
//        ValidateDuplicateMember(signDto.toEntity());
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        signDto.setPassword(passwordEncoder.encode(signDto.getPassword()));
        user user = signDto.toEntity();
        if(signDto.getParentPhoneNum() != null){ //이러면 자녀 회원가입, 따로 user에 셋팅을 해준다.
            user parentUser = userRepository.findByPhoneNum(signDto.getParentPhoneNum());
            user.setParent(parentUser);
            parentUser.getChildren().add(user);
        }
        userRepository.save(user);
    }


    @Transactional
    public ResponseDto loginChk(String userId, String password) { //로그인시 확인합니다.
        Optional<user> byUserId = userRepository.findByUserId(userId);
        ResponseDto responseDto = new ResponseDto();
        if(byUserId.isPresent()){
            user user = byUserId.get();
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if(passwordEncoder.matches(password,user.getPassword())){
                String token = jwtTokenProvider.createToken(user.getUserId());
                if(user.isIdx()){ //이게 true면 부모.
                    responseDto.setStatus(200);
                    responseDto.setToken(token);
                    List<user> children = user.getChildren();
                    for (user child : children) {
                        locationDto locationDto = new locationDto();
                        locationDto.setUserId(child.getUserId()); locationDto.setHouse(child.getHouse()); locationDto.setSchool(child.getSchool());
                        responseDto.getLocation().add(locationDto);
                    }
                    return responseDto;
                }
                else{
                    locationDto locationDto = new locationDto();
                    locationDto.setUserId(user.getUserId()); locationDto.setHouse(user.getHouse()); locationDto.setSchool(user.getSchool());
                    responseDto.setStatus(200);
                    responseDto.setToken(token);
                    responseDto.getLocation().add(locationDto);
                    return responseDto;
                }
            }
            else{
                responseDto.setStatus(404);
                return responseDto;
            }
        }
        else{
            responseDto.setStatus(404);
            return responseDto;
        }
    }



}
