package com.reon.authify_backend.exception;

public class OTPExpiredException extends RuntimeException{
    public OTPExpiredException(String message) {
        super(message);
    }
}
