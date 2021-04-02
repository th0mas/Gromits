package com.oceangromits.firmware.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GromitsExceptionAdvice {

    @ResponseBody
    @ExceptionHandler(GromitsException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    String gromitsForbiddenHandler(GromitsException exception) {
        return exception.getMessage();
    }

}
