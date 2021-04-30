package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.service.SimpClientService;
import com.oceangromits.firmware.model.WebRTCMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
public class SignallerController {

    @Autowired
    private SimpClientService scs;

    public static final Logger logger = LoggerFactory.getLogger(SignallerController.class);

    /*
    Manage the sending of WebRTC signals.

    Currently we only attach the sender to the message before sending it on to guarantee the correct user is set.
    I have no idea why you have to do this manually in Spring.
     */
    @MessageMapping("signal")
    @SendTo("/msg/private")
    public WebRTCMessage sendSignal(@Payload WebRTCMessage signal, SimpMessageHeaderAccessor headerAccessor) {
        signal.setSender(headerAccessor.getUser().getName());
        return signal;
    }

    @MessageMapping("join")
    @SendTo("/msg/private")
    public WebRTCMessage joinClient(@Payload WebRTCMessage signal, SimpMessageHeaderAccessor headerAccessor, Authentication auth) {

        String sender = Objects.requireNonNull(headerAccessor.getUser()).getName();
        signal.setSender(headerAccessor.getUser().getName());

        if (auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            logger.info("Admin connected!");
            return signal;
        }

        if (scs.getClientCount() >= 2) {
            logger.info(sender + " is trying to connect to full instance");
            return null;
        }

        logger.info("Device connected : " + sender + " currently " + scs.getClientCount() + " clients");

        return signal;
    }
}
