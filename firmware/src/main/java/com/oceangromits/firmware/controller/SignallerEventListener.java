package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.model.WebRTCSignal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

@Component
public class SignallerEventListener {
    public static final Logger logger = LoggerFactory.getLogger(SignallerEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        // Stub method for later?

    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String deviceId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("clientId");
        logger.info("Device disconnected : " + deviceId);

        WebRTCSignal signal = new WebRTCSignal();
        signal.setType(WebRTCSignal.SignalType.DEVICE_LEAVE);
        signal.setSender(deviceId);
        messagingTemplate.convertAndSend("/signal/public", signal);

    }

}
