package com.oceangromits.firmware.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
We need a simple way to check if Gromits are accessible - this seems like a good way to do it and stay sane.
 */
@RestController()
public class IndexController {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }//Made this method public as I don't think it should mess things up?
                                            //change back if needed, only impacts 1 test

}
