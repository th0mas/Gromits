package com.oceangromits.firmware.controller.api;

import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.model.TokenMessage;
import com.oceangromits.firmware.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ClientService clientService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public AdminController(ClientService clientService,
                           SimpMessagingTemplate simpMessagingTemplate) {
        this.clientService = clientService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    /*
    Logs a user in as an admin, returns a Admin user token
     */
    @PostMapping("/login")
    public String login(@RequestBody Client client) {
        return clientService.signin(client.getName(), client.getPassword());
    }

    /*
    Authorizes another client, allowing them to connect to the stream
     */
    @PostMapping("/authorize_client")
    public Client authorizeClient(@RequestBody Client client) {
        TokenMessage message = new TokenMessage();
        message.setClientID(client.getName());
        message.setToken(clientService.genClientToken(client.getName()));

        simpMessagingTemplate.convertAndSendToUser(client.getName(), "/signal/me", message);
        return client;
    }


}
