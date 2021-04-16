package com.oceangromits.firmware.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.DISCONNECT, SimpMessageType.OTHER).permitAll()
                .simpDestMatchers("/webrtc/signal").hasRole("VIDEO")
                .simpSubscribeDestMatchers("/signal/private").hasRole("VIDEO")
                .anyMessage().hasRole("CONNECT");
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
}
