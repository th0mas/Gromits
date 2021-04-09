package com.oceangromits.firmware.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class WebSocketAuthenticatorServiceTest {
    private WebSocketAuthenticatorService TestAuthenticatorService;

    //test whether a correct username and password generate a UsernamePasswordAuthenticationToken
    @Test
    public void correctUserPass(){
        TestAuthenticatorService= new WebSocketAuthenticatorService();
        UsernamePasswordAuthenticationToken result = TestAuthenticatorService.getAuthenticatedOrFail("gromit", "test_pass");
        assertEquals(result.getPrincipal(),"gromit");
    }

    //test whether an empty username is caught as not being valid
    @Test
    public void missingUsername(){
        TestAuthenticatorService= new WebSocketAuthenticatorService();
        assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail(null, "test_pass");});

    }

    //test whether an empty password is caught as not being valid
    @Test
    public void missingPassword(){
        TestAuthenticatorService= new WebSocketAuthenticatorService();
        assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("gromit", null);});

    }


    //tests for whether an incorrect username/password or both is valid
    @Test
    public void incorrectUserPass(){
        TestAuthenticatorService= new WebSocketAuthenticatorService();
        assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("gromit", "wrong");});
        assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("wrong", "test_pass");});
        assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("wrong", "wrong");});
    }

}