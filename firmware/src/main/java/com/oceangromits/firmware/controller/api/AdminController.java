package com.oceangromits.firmware.controller.api;

import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ClientRepository clientRepository;
    private final ClientService clientService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public AdminController(ClientRepository clientRepository,
                           ClientService clientService,
                           SimpMessagingTemplate simpMessagingTemplate) {
        this.clientRepository = clientRepository;
        this.clientService = clientService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @PostMapping("/login")
    public String login(@RequestBody Client client) {
        return clientService.signin(client.getName(), client.getPassword());
    }

    @PostMapping("/authorize_client")
    public Client authorizeClient(@RequestBody Client client) {

        return client;
    }


}
