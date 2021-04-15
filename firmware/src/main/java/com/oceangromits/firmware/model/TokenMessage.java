package com.oceangromits.firmware.model;

public class TokenMessage {
    String clientID;
    String token;

    public TokenMessage() {}

    public TokenMessage(String clientID, String token) {
        this.clientID = clientID;
        this.token = token;
    }

    public String getClientID() {
        return clientID;
    }

    public void setClientID(String clientID) {
        this.clientID = clientID;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
