package com.oceangromits.firmware.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                .simpDestMatchers("/webrtc/signal").hasRole("CLIENT")
                .simpSubscribeDestMatchers("/signal/private").hasRole("CLIENT")
                .simpSubscribeDestMatchers("/signal/public").permitAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
}
