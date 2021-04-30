package com.oceangromits.firmware.model;

public class Message {
    private String type;
    private String clientID;

    public Message() {}

    public Message(String type, String clientID) {
        this.type = type;
        this.clientID = clientID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getClientID() {
        return clientID;
    }

    public void setClientID(String clientID) {
        this.clientID = clientID;
    }
}
