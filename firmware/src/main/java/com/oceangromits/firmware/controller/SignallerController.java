package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.model.WebRTCSignal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Objects;

@Controller
public class SignallerController {
    public static ArrayList<String> clients = new ArrayList<>();

    public static final Logger logger = LoggerFactory.getLogger(SignallerController.class);

    @MessageMapping("signal")
    @SendTo("/signal/private") // This should not be public in future
    public WebRTCSignal sendSignal(@Payload WebRTCSignal signal) {
        return signal;
    }

    @MessageMapping("join")
    @SendTo("/signal/private")
    public WebRTCSignal joinClient(@Payload WebRTCSignal signal, SimpMessageHeaderAccessor headerAccessor) {

        String sender = Objects.requireNonNull(headerAccessor.getUser()).getName();

        if (clients.size() >= 2) {
            logger.info(sender + " is trying to connect to full instance");
            return null;
        }

        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("clientId", sender);
        if (sender != null) {
            clients.add(sender);
        }


        logger.info("Device connected : " + sender + " currently " + clients.size() + " clients");

        return signal;
    }
}
