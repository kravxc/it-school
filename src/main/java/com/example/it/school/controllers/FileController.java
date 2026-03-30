package com.example.it.school.controllers;

import com.example.it.school.dto.file.FileResponse;
import com.example.it.school.services.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<FileResponse> uploadFile(
            @RequestParam("file")MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("type") String type){
        log.info("POST /api/files/upload - file: {}", file.getOriginalFilename());
        FileResponse response = fileService.uploadFile(file, name, type);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FileResponse>> getAllFiles(){
        log.info("GET /api/files - get all files");
        return ResponseEntity.ok(fileService.getAllFiles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FileResponse> getFileById(@PathVariable Long id){
        log.info("GET /api/files/{} - get file by id", id);
        return ResponseEntity.ok(fileService.getFileById(id));
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id){
        log.info("GET api/files/download/{} - download file", id);

        byte[] fileData = fileService.downloadFile(id);
        FileResponse fileInfo = fileService.getFileById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileInfo.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" +
                        fileInfo.getOriginalName() + "\"")
                .body(fileData);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id){
        log.info("DELETE api/files/{} - delete file by id", id);
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

}
