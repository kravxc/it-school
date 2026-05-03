package com.example.it.school.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String status;

    private int code;

    private String message;

    private String path;

    @JsonFormat(pattern = "yyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private String error;

    private Map<String, String> errors;
}
