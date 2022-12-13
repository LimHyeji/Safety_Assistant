package com.example.back.repository;

import com.example.back.Domain.Dto.crosswalkk.cross;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class crosswalkJDbcRepository {
    private final JdbcTemplate jdbcTemplate;

    class crossMapper implements RowMapper<cross>{
        public cross mapRow(ResultSet rs,int rowNum) throws SQLException {
            cross cross = new cross();
            cross.setLatitude(rs.getString("latitude"));
            cross.setLongitude(rs.getString("longitude"));
            return cross;
        }
    }

    public List<cross> selectCross(){
        String SQL = "SELECT latitude,longitude FROM public.\"cross\"";
        List<cross> results = jdbcTemplate.query(SQL,new crossMapper());
        return results;
    }

    public List<cross> selectConditionCross(){
        String SQL = "SELECT latitude,longitude FROM public.\"cross\" where CAST(st_length_ as FLOAT8) >= 70";
        List<cross> results = jdbcTemplate.query(SQL,new crossMapper());
        return results;
    }
}
