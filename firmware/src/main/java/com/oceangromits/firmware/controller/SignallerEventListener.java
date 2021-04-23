package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.model.WebRTCSignal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

@Component
public class SignallerEventListener {
    public static final Logger logger = LoggerFactory.getLogger(SignallerEventListener.class);

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public SignallerEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {


        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String sender = Objects.requireNonNull(headerAccessor.getUser()).getName();

        if (sender == null) return;

        SignallerController.clients.remove(sender);

        logger.info("Device disconnected : " + sender + ", Currently " + SignallerController.clients.size() + " client's connected");

        WebRTCSignal signal = new WebRTCSignal();
        signal.setType(WebRTCSignal.SignalType.DEVICE_LEAVE);
        signal.setSender(sender);
        messagingTemplate.convertAndSend("/signal/public", signal);

    }

}
