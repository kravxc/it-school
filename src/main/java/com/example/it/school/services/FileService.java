package com.example.it.school.services;

import com.example.it.school.dto.file.FileResponse;
import com.example.it.school.entity.File;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.FileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileRepository fileRepository;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${file.base-url:http://localhost:8080/api/files/download/}")
    private String baseUrl;

    @Transactional
    public FileResponse uploadFile(MultipartFile multipartFile, String name, String type){
        log.info("Uploading file: {}", multipartFile.getOriginalFilename());

        try {
            if (multipartFile.isEmpty()){
                throw new RuntimeException("File is empty");
            }

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }

            String originalFileName = multipartFile.getOriginalFilename();

            String extension = "";

            if (originalFileName != null && originalFileName.contains(".")){
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String storedFileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(storedFileName);
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            File file = File.builder()
                    .name(name != null ? name : originalFileName)
                    .originalName(originalFileName)
                    .path(filePath.toString())
                    .type(type)
                    .mimeType(multipartFile.getContentType())
                    .size((int) multipartFile.getSize())
                    .extension(extension)
                    .createdAt(LocalDateTime.now())
                    .build();

            File savedFile = fileRepository.save(file);
            log.info("File uploaded successfully: {} ", savedFile.getOriginalName());

            return mapToResponse(savedFile);
        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file: " + e.getMessage());

        }
    }

    public byte[] downloadFile(Long fileId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId));

        try {
            Path filePath = Paths.get(file.getPath());
            return Files.readAllBytes(filePath);
        }catch (IOException e) {
            log.error("Failed to download file: {}", e.getMessage());
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
    }

    public FileResponse getFileById(Long id) {
        File file = fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", id));

        return mapToResponse(file);
    }

    public List<FileResponse> getAllFiles() {
        return fileRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Long id) {
        File file = fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", id));

        try {
            Path filePath = Paths.get(file.getPath());
            Files.deleteIfExists(filePath);
            fileRepository.delete(file);
            log.info("File deleted successfully: {}", file.getOriginalName());
        } catch (IOException e) {
            log.error("Failed to delete file: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file" + e.getMessage());
        }
    }

    private FileResponse mapToResponse(File file) {

        return FileResponse.builder()
                .id(file.getId())
                .name(file.getName())
                .originalName(file.getOriginalName())
                .type(file.getType())
                .mimeType(file.getMimeType())
                .size((long) file.getSize())
                .extension(file.getExtension())
                .downloadUrl(baseUrl + file.getId())
                .createdAt(file.getCreatedAt())
                .build();
    }
}

