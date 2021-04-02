package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.GromitsException;
import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/*
Contains the api methods for managing the server and security lifecycle.

I'm sorry about some of the code here - and if theres security issues they're probably contained below as well. In
future using a key-value store may be advantageous rather than bolting config onto a relational database.
 */
@RestController
@RequestMapping("/api")
public class ApiController {

    private final ClientRepository clientRepository;

    @Autowired
    public ApiController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /*
    Think the easiest way to check if the server is setup is to check if the number of registered
    clients are zero, as during setup we should always register a main client.

    The issue with this is that theres no easy way to "reset" - apart from dropping the db which might
    not actually be a bad idea.
     */
    @GetMapping("/setup_status")
    boolean getSetupStatus() {
        return clientRepository.count() > 0;
    }

    @PostMapping("/setup")
    Client setupServer(@RequestBody Client client) {
        if (clientRepository.count() > 0) {
            throw new GromitsException("Server already setup", HttpStatus.FORBIDDEN);
        }
        return new Client();
    }
}
