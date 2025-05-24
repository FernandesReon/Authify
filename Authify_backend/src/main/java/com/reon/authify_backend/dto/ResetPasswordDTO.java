package com.reon.authify_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordDTO {
    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Otp is required.")
    private String otp;

    @NotBlank(message = "New password is required")
    @Size(min = 10, max = 16, message = "Minimum 10 characters for password required")
    private String newPassword;
}
