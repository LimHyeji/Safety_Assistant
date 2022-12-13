package com.example.back.Domain.Entity;

import com.example.back.Domain.Dto.locDto.house;
import com.example.back.Domain.Dto.locDto.school;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "users")
public class user {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false, unique = true)
    private String userId; //닉네임

    @Column(length = 30, nullable = false)
    private String userName; //본명

    @Column(length = 100, nullable = false)
    private String password;

    @Column(unique = true)
    private String phoneNum; //parentPhoneNum은 필요가없다.

    @Column
    private boolean idx; // idx = true면 부모, false면 자녀.

    @Column
    private String houselat;

    @Column
    private String houselng;

    @Column
    private String schoollat;

    @Column
    private String schoollng;

    @Column
    private int duration; //등교시간

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @OnDelete(action = OnDeleteAction.CASCADE) //너라는 FK에 걸겠다는 뜻이됩니다. 너가 삭제되면 나도 삭제되는 느낌.
    private user parent;

    @OneToMany(mappedBy = "parent", orphanRemoval = true, fetch = FetchType.LAZY)
    private List<user> children = new ArrayList<>();

    public user() {
    }
}
