package com.example.back.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class crosswalkJDbcRepository {
    private final JdbcTemplate jdbcTemplate;
}
