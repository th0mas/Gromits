package com.oceangromits.firmware.model;

import com.fasterxml.jackson.databind.JsonNode;

public class WebRTCSignal {
    private SignalType type;
    private JsonNode content;
    private String sender;

    public enum SignalType {
        VIDEO_OFFER,
        VIDEO_ANSWER,
        NEW_ICE_CANDIDATE,
        DEVICE_LEAVE,
        DEVICE_JOIN
    }

    public SignalType getType() {
        return this.type;
    }

    public void setType(SignalType type) {
        this.type = type;
    }

    public JsonNode getContent() {
        return this.content;
    }

    public void setContent(JsonNode content) {
        this.content = content;
    }

    public String getSender() {
        return this.sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

}
