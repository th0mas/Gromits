package com.oceangromits.firmware.exceptions;

import org.springframework.http.HttpStatus;

public class GromitsException extends RuntimeException{
    private final String message;
    private final HttpStatus httpStatus;

    public GromitsException(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
