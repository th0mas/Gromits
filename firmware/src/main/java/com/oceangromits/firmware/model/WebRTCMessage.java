package com.oceangromits.firmware.model;

import com.fasterxml.jackson.databind.JsonNode;

public class WebRTCMessage extends Message{
    private SignalType signalType;
    private JsonNode content;
    private String sender;

    public enum SignalType {
        VIDEO_OFFER,
        VIDEO_ANSWER,
        NEW_ICE_CANDIDATE,
        DEVICE_LEAVE,
        DEVICE_JOIN
    }

    public SignalType getSignalType() {
        return this.signalType;
    }

    public void setSignalType(SignalType signalType) {
        this.signalType = signalType;
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
