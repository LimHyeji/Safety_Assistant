package com.example.back.config;

import com.example.back.Interceptor.BearerAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {  //인터셉터 "등록"클래스.
    private final BearerAuthInterceptor bearerAuthInterceptor; //인터셉터를 가져온다.

    public WebMvcConfig(BearerAuthInterceptor bearerAuthInterceptor) {
        this.bearerAuthInterceptor = bearerAuthInterceptor;
    }

    public void addInterceptors(InterceptorRegistry registry){
        // InterceptorRegistry는 Interceptor가 관리해주는거 같다.
        System.out.println(">>> register Interceptor");

        // 일단 PUSH시 이 부분은 주석처리.
        //registry.addInterceptor(bearerAuthInterceptor).addPathPatterns("/board");

        /*
          '/info'라는 패턴으로 들어오는 요청에 대해서 bearerAuthInterceptor를 등록해주었습니다.
          이렇게 하면 애플리케이션이 실행될 때 인터셉터를 등록(Configuration의 특징)하고 그 주소로 들어오는 요청을 기다리는 상태가 됩니다. */
    }
}
