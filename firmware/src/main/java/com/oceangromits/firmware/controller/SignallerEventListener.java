package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.service.SimpClientService;
import com.oceangromits.firmware.model.WebRTCMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
public class SignallerEventListener {
    public static final Logger logger = LoggerFactory.getLogger(SignallerEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private SimpClientService scs;

    @Autowired
    public SignallerEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        Principal sender = headerAccessor.getUser();

        if (sender == null) return;

        logger.info("Device disconnected : " + sender.getName() + ", Currently " + scs.getClientCount() + " client's connected");

        WebRTCMessage signal = new WebRTCMessage();
        signal.setSignalType(WebRTCMessage.SignalType.DEVICE_LEAVE);
        signal.setSender(sender.getName());
        messagingTemplate.convertAndSend("/msg/public", signal);

    }

}
