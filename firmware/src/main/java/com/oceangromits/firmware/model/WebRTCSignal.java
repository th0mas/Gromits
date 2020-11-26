package com.oceangromits.firmware.model;

public class WebRTCSignal {
    private SignalType type;
    private String content;
    private String sender;

    public enum SignalType {
        VIDEO_OFFER,
        VIDEO_ANSWER,
        NEW_ICE_CANDIDATE
    }

    public SignalType getType() {
        return this.type;
    }

    public void setType(SignalType type) {
        this.type = type;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return this.sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

}
