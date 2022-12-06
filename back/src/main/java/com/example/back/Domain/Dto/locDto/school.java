package com.example.back.Domain.Dto.locDto;

import lombok.Data;

import javax.persistence.Embeddable;

@Data @Embeddable
public class school {
    String schoollat;
    String schoollng;

    public school(String schoollat, String schoollng) {
        this.schoollat = schoollat;
        this.schoollng = schoollng;
    }

    public school() {
    }
}
