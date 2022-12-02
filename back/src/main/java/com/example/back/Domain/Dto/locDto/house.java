package com.example.back.Domain.Dto.locDto;

import lombok.Data;

import javax.persistence.Embeddable;

@Embeddable
public class house {
    String houselat;
    String houselng;

    public house(String houselat, String houselng) {
        this.houselat = houselat;
        this.houselng = houselng;
    }

    public house() {
    }
}
