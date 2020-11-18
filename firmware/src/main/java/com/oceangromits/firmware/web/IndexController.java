package com.oceangromits.firmware.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class IndexController {
    @GetMapping("/ping")
    String ping() {
        return "pong";
    }

}
