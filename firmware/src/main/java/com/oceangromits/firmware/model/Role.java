package com.oceangromits.firmware.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ROLE_ADMIN, ROLE_VIDEO, ROLE_CONNECT;

    public String getAuthority() {
        return name();
    }
}
