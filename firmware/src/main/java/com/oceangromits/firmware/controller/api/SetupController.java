package com.oceangromits.firmware.controller.api;

import com.oceangromits.firmware.exceptions.GromitsException;
import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.model.Role;
import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/*
Contains the api methods for managing the server and security lifecycle.

I'm sorry about some of the code here - and if theres security issues they're probably contained below as well. In
future using a key-value store may be advantageous rather than bolting config onto a relational database.
 */
@RestController
@RequestMapping("/api/setup")
public class SetupController {

    private final ClientRepository clientRepository;
    private final ClientService clientService;

    @Autowired
    public SetupController(ClientRepository clientRepository, ClientService clientService) {
        this.clientRepository = clientRepository;
        this.clientService = clientService;
    }

    /*
    Think the easiest way to check if the server is setup is to check if the number of registered
    clients are zero, as during setup we should always register a main client.

    The issue with this is that theres no easy way to "reset" - apart from dropping the db which might
    not actually be a bad idea.
     */
    @GetMapping("/status")
    boolean getSetupStatus() {
        return isSetup();
    }

    /*
    Setup by initializing our first client - we'll presume this to be admin with a password.
    TODO: Init with password
    TODO: Init with role "Admin"
     */
    @PostMapping("/new")
    String setupServer(@RequestBody Client client) {
        // Only setup an admin account if one doesn't exist
        if (isSetup()) {
            throw new GromitsException("Server already setup", HttpStatus.FORBIDDEN);
        }
        return clientService.createAdmin(client);
    }

    private boolean isSetup() {
        return clientRepository.count() > 0;
    }
}
