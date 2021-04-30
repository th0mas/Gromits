package com.oceangromits.firmware.service;

import com.oceangromits.firmware.exceptions.GromitsException;
import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.model.Role;
import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;

    private final AuthenticationManager authenticationManager;

    @Autowired
    public ClientService(ClientRepository clientRepository, PasswordEncoder passwordEncoder,
                         JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public String signIn(String username, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            return jwtTokenProvider.createToken(username, clientRepository.findByName(username).getRoles());
        } catch (AuthenticationException e) {
            throw new GromitsException("Invalid username/password supplied", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    public String createAdmin(Client client) {
        client.setPassword(passwordEncoder.encode(client.getPassword()));
        client.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_ADMIN, Role.ROLE_CONNECT));
        clientRepository.save(client);//commenting out fixes test

        return jwtTokenProvider.createToken(client.getName(), client.getRoles());
    }

    public String genClientVideoToken(String clientID) {
        List<Role> roles = Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_CONNECT);
        return jwtTokenProvider.createToken(clientID, roles);
    }

    public String genBasicToken(String clientID) {
        List<Role> roles = Collections.singletonList(Role.ROLE_CONNECT);
        return jwtTokenProvider.createToken(clientID, roles);
    }

    public void resetServerDangerously() {
        clientRepository.deleteAll(); // lol
    }
}
