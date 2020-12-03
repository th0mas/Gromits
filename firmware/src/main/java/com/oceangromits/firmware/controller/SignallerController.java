package com.oceangromits.firmware.controller;

import com.oceangromits.firmware.model.WebRTCSignal;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
public class SignallerController {
    @MessageMapping("/webrtc.signal")
    @SendTo("/signal/public") // This should not be public in future
    public WebRTCSignal sendSignal(@Payload WebRTCSignal signal) {
        return signal;
    }

    @MessageMapping("/webrtc.join")
    @SendTo("/signal/public")
    public WebRTCSignal joinClient(@Payload WebRTCSignal signal, SimpMessageHeaderAccessor headerAccessor) {
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("clientId", signal.getSender());

        return signal;
    }
}
