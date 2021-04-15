package com.oceangromits.firmware;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class OceanGromitsApplication {

	public static void main(String[] args) {
		SpringApplication.run(OceanGromitsApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/signaller").allowedOrigins("*");
				registry.addMapping("/api/**").allowedOrigins("*");
			}
		};
	}

}
