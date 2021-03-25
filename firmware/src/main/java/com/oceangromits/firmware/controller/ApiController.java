package com.oceangromits.firmware.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/ping")
public class ApiController {
    @GetMapping("/setup_status")
    String getSetupStatus() {
        return "no";
    }
}
