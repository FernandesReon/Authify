package com.reon.authify_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyAccount {
    @NotBlank(message = "Otp of 6-digits is required.")
    private String otp;
}
