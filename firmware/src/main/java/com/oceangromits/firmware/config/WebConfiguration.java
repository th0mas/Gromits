package com.oceangromits.firmware.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class WebConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeRequests().antMatchers("/h2-console/**").authenticated().and()
                .authorizeRequests().antMatchers("/admin").hasRole("ADMIN");

        httpSecurity.csrf().disable();
        httpSecurity.headers().frameOptions().disable();
    }

}