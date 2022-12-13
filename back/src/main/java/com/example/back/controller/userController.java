package com.example.back.controller;

import com.example.back.Domain.Dto.*;
import com.example.back.Domain.Dto.alarm.childAlarmReq;
import com.example.back.Domain.Dto.alarm.retDto;
import com.example.back.Domain.Dto.crossDto.crossDto;
import com.example.back.Domain.Dto.crosswalkk.childCross;
import com.example.back.Domain.Dto.crosswalkk.cross;
import com.example.back.Domain.Dto.crosswalkk.respCross;
import com.example.back.Domain.Dto.gps.childReq;
import com.example.back.Domain.Dto.gps.locInfo;
import com.example.back.Domain.Dto.gps.parReq;
import com.example.back.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/user/lgin")
    public ResponseDto login(@RequestBody LoginRequest loginRequest) {
        ResponseDto responseDto = userService.loginChk(loginRequest.getUserId(), loginRequest.getPassword());
        return responseDto;
        // 로그인 상태유지와 더불어서 token으로 이제 API를 사용할수가 있습니다.
    }

    @PostMapping("/user/login/logout")
    public msgDto logout() {
        msgDto msgDto = new msgDto();
        msgDto.setMsg("expired");
        return msgDto;
        // 로그인 상태유지와 더불어서 token으로 이제 API를 사용할수가 있습니다.
    }

    @PostMapping("/user/login/chk")
    public ResponseEntity<Boolean> PassCheck(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.passwordChk(loginRequest.getUserId(), loginRequest.getPassword()));
    }

    @PostMapping("/user/login/update")
    public void updateInfo(@Validated @RequestBody signDto signDto){
        userService.updatedInfo(signDto);
    }


    @GetMapping("/user-nicknames/{userId}/exists")
    public ResponseEntity<Boolean> checkNicknameDuplicate(@PathVariable String userId){
        return ResponseEntity.ok(userService.checkUserIdDuplicate(userId));
    }

    @GetMapping("/user-phoneNum/{phoneNum}/exists")
    public ResponseEntity<Boolean> checkPhoneNumDuplicate(@PathVariable String phoneNum){
        return ResponseEntity.ok(userService.checkPhoneNumDuplicate(phoneNum));
    }

    @PostMapping("/user/child")
    public childrenDto req(@RequestBody childrenDto childrenDto) {
        childrenDto dto1 = userService.childrenRequest(childrenDto);
        return dto1;
    }

    @PostMapping("/user/login/cross")
    public respCross testLoc3(@RequestBody crossDto crossDto){
        log.info("test2"+crossDto.isIdx()+"!!!!!!!!!!!!!!!!!!!!!!!");
        if(crossDto.isIdx()) throw new RuntimeException("It is allow to child");
        List<cross> crosses = userService.reqForCross();
        respCross respCross = new respCross();
        respCross.setCrosses(crosses);
        return respCross;
        // 넘어온 String형태의 위도 경도를 그대로 반환한다.
    }

    @PostMapping("/user/login/cross/cond")
    public respCross testLoc4(@RequestBody crossDto crossDto){
        log.info("test2"+crossDto.isIdx()+"!!!!!!!!!!!!!!!!!!!!!!!");
        if(crossDto.isIdx()) throw new RuntimeException("It is allow to child");
        List<cross> crosses = userService.reqForCrossCond();
        respCross respCross = new respCross();
        respCross.setCrosses(crosses);
        return respCross;
        // 넘어온 String형태의 위도 경도를 그대로 반환한다.
    }

    @PostMapping("/user/login/child")
    public locInfo gpsLoc(@RequestBody childReq childReq) {
        log.info("test2"+childReq.getUserId()+"!!!!!!!!!!!!!!!!!!!!!!!");
        log.info("test2"+childReq.getLatitude()+"!!!!!!!!!!!!!!!!!!!!!!!");
        log.info("test2"+childReq.getLongitude()+"!!!!!!!!!!!!!!!!!!!!!!!");
        if(childReq.isIdx()) throw new RuntimeException("It is allow to child");
        locInfo locInfo = new locInfo();
        if(childReq.getLongitude() != null && childReq.getLatitude() != null){
            locInfo = userService.putCache(childReq);
        }
        return locInfo;
    }

    @PostMapping("/user/login/parent")
    public locInfo gpsLoc2(@RequestBody parReq parReq) {
        log.info("test2"+parReq.getUserId()+"!!!!!!!!!!!!!!!!!!!!!!!");
        if(!parReq.isIdx()) throw new RuntimeException("It is allow to parent");
        locInfo locInfo = userService.getCache(parReq);
        return locInfo;
        // 넘어온 String형태의 위도 경도를 그대로 반환한다.
    }

    @PostMapping("/user/login/alarm")  //자녀앱 api
    public childAlarmReq alarmAPI1(@RequestBody childAlarmReq childAlarmReq) {
        log.info("test2"+childAlarmReq.getUserId()+"!!!!!!!!!!!!!!!!!!!!!!!");
        if(childAlarmReq.isIdx()) throw new RuntimeException("It is allow to child");
        childAlarmReq childAlarmReq1 = userService.putCache2(childAlarmReq);
        return childAlarmReq1;
    }

    @PostMapping("/user/login/alarmRec")  //부모앱 api
    public childAlarmReq alarmAPI2(@RequestBody parReq parReq) {
        log.info("test2"+parReq.getUserId()+"!!!!!!!!!!!!!!!!!!!!!!!");
        if(!parReq.isIdx()) throw new RuntimeException("It is allow to parent");
        childAlarmReq cache2 = userService.getCache2(parReq);
        if(cache2.getUserId() != null){ //삭제도해야함.
            userService.deleteCache(parReq);
        }
        return cache2;
        // 넘어온 String형태의 위도 경도를 그대로 반환한다.
    }

}
