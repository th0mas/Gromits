package com.oceangromits.firmware.controller.api;

import com.oceangromits.firmware.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ClientRepository clientRepository;

    @Autowired
    public AdminController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }


}
