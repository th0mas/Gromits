package com.oceangromits.firmware.model;

public class TokenMessage extends Message {
    String token;

    public TokenMessage() {}

    public TokenMessage(String clientID, String token) {
        super("TOKEN", clientID);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
