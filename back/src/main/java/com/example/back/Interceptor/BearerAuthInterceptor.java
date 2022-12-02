package com.example.back.Interceptor;

import com.example.back.AuthorizationExtractor;
import com.example.back.JwtTokenProvider;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class BearerAuthInterceptor implements HandlerInterceptor {
    //HandlerInterceptor를 통해서 인터셉터를 "구현"한다.
    private AuthorizationExtractor authExtractor;
    private JwtTokenProvider jwtTokenProvider;

    public BearerAuthInterceptor(AuthorizationExtractor authExtractor, JwtTokenProvider jwtTokenProvider) {
        this.authExtractor = authExtractor;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) {
        System.out.println(">>> interceptor.preHandle occur");
        String token = authExtractor.extract(request, "Bearer");
        if (ObjectUtils.isEmpty(token)) {
            throw new IllegalArgumentException("There is no Token..........");
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("expired");
        }
        //여기서 관리자 아이디와 관리자 비번을 확인하는걸 가지고,
        // 그게 맞다면 -> request에 그 정보를 포함시켜서 보내는걸로 하는 느낌으로 가야하나 싶다.

        String name = jwtTokenProvider.getSubject(token); //userId를 획득합니다.
        request.setAttribute("name", name);         //request에 subject(userId)를 전달합니다.
        return true;
    }
}
