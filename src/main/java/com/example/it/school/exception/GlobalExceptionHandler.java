package com.example.it.school.exception;

import com.example.it.school.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex,
            HttpServletRequest request){

        log.error("Runtime exception: {}", ex.getMessage());

        ErrorResponse error = ErrorResponse.builder()
                .status("error")
                .code(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error("Bad Request")
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            HttpServletRequest request){

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse error = ErrorResponse.builder()
                .status("error")
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error("Validation error")
                .errors(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex,
            HttpServletRequest request){

        ErrorResponse error = ErrorResponse.builder()
                .status("error")
                .code(HttpStatus.UNAUTHORIZED.value())
                .message("Invalid Email or password")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error("Unauthorized")
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .status("error")
                .code(HttpStatus.FORBIDDEN.value())
                .message("You don't have permission to access this resource")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error("Forbidden")
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .status("error")
                .code(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error("Not Found")
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex,
            HttpServletRequest request){

        log.error("Unexpected error", ex);

        ErrorResponse error = ErrorResponse.builder()
                .status("error")
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An unexpected error occurred")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error("Iternal Server Error")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);

    }

}
