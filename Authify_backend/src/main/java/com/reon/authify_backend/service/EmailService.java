package com.reon.authify_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to our Platform");
        message.setText("Hello " + name + "\n\nThank you for registering with us!\n\nRegards,\nClearCutAI Team.");
        mailSender.send(message);
    }

    public void sendResetOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP.");
        message.setText("Your OTP for resetting your password is " + otp + ". Use this OTP to proceed with resetting your password.");
        mailSender.send(message);
    }

    public void sendVerificationOtp(String toEmail, String name, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account verification OTP");
        message.setText("Hello " + name + "\n\nHere is your OTP: " + otp + " for your account verification.\n\n" +
                "OTP is only valid for 5 minutes.\nPlease don't share the OTP with anyone.");
        mailSender.send(message);
    }
}
