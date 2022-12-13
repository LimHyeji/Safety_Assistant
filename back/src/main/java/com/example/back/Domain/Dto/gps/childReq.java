package com.example.back.Domain.Dto.gps;

import lombok.Data;

@Data
public class childReq {
    String userId;
    boolean idx;
    String latitude;
    String longitude;
}
