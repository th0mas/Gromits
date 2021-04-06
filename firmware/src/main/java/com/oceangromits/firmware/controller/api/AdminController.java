package com.oceangromits.firmware.controller.api;

import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ClientRepository clientRepository;
    private final ClientService clientService;

    @Autowired
    public AdminController(ClientRepository clientRepository, ClientService clientService) {
        this.clientRepository = clientRepository;
        this.clientService = clientService;
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        return clientService.signin(username, password);
    }


}
