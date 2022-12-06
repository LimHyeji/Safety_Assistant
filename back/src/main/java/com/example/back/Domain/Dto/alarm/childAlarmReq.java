package com.example.back.Domain.Dto.alarm;

import lombok.Data;

@Data
public class childAlarmReq {
    String userId;
    boolean idx;
    String alarm;
    String where;
    String lat;
    String lng;
}
