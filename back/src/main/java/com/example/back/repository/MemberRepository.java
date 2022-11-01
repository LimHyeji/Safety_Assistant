//package com.example.back.repository;
//
//
//import com.example.back.Domain.Entity.user;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Repository;
//
//import javax.persistence.EntityManager;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//@RequiredArgsConstructor
//@Slf4j
//public class MemberRepository {
//
//    private final EntityManager em;
//
//    public void save(user user){ //영속성컨텍스트 저장을 위해 Entity로 저장.
//        em.persist(user);
//    }
//
//    public user findOneById(Long id){
//        return em.find(user.class,id);
//    }
//
//    public Optional<user> findOneByUserId(String userId){
//        user user = (user) em.createQuery("select m from user m where m.userId=:userId")
//                .setParameter("userId",userId)
//                .getSingleResult();
//        Optional<user> optOf = Optional.of(user); // cast to Optional instance by using "of" method!
//        return optOf;
//    }
//
//    public String findUserIdByEmail(String email){
//        user user = (user) em.createQuery("select m from user m where m.email=:email")
//                .setParameter("email",email)
//                .getSingleResult();
//        String findId = user.getUserId();
//        return findId;
//    }
//
//    public String findUserEmailByUserId(String userId){
//        user user = (user) em.createQuery("select m from user m where m.userId=:userId")
//                .setParameter("userId",userId)
//                .getSingleResult();
//        String findEmail = user.getEmail();
//        return findEmail;
//    }
//
//    public Long findId(String userId){
//        user user=(user) em.createQuery("select m from user m where m.userId=:userId")
//                .setParameter("userId",userId)
//                .getSingleResult();  //과연 userId로 영속성 객체를 가져올수 있을까??
//        Long findId = user.getId();
//        return findId;
//    }
//
//    public Optional<user> findUserByUserId(String userId){
//        user user=(user) em.createQuery("select m from user m where m.userId=:userId")
//                .setParameter("userId",userId)
//                .getSingleResult();  //과연 userId로 영속성 객체를 가져올수 있을까??
//        return Optional.of(user); // return Optional instance by "of" method.
//    }
//
//
//    public List<user> ValidateDuplicateUserId(String userId){
//        return em.createQuery("select m from user m where m.userId=:userId",user.class)
//                .setParameter("userId",userId)
//                .getResultList();
//    }
//    public List<user> ValidateDuplicateUserName(String user_name){
//        return em.createQuery("select m from user m where m.user_name=:user_name",user.class)
//                .setParameter("user_name",user_name)
//                .getResultList();
//    }
//    public List<user> ValidateDuplicateUserEmail(String email){
//        return em.createQuery("select m from user m where m.email=:email",user.class)
//                .setParameter("email",email)
//                .getResultList();
//    }
//}
