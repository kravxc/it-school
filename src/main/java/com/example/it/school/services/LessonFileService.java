package com.example.it.school.services;

import com.example.it.school.dto.file.FileResponse;
import com.example.it.school.dto.file.LessonFileRequest;
import com.example.it.school.entity.File;
import com.example.it.school.entity.Lesson;
import com.example.it.school.entity.LessonFile;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.FileRepository;
import com.example.it.school.repository.LessonFileRepository;
import com.example.it.school.repository.LessonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonFileService {

    private final LessonFileRepository lessonFileRepository;
    private final LessonRepository lessonRepository;
    private final FileRepository fileRepository;

    @Transactional
    public FileResponse attachFileToLesson(LessonFileRequest request){
        log.info("Attaching file {} to lesson {}", request.getFileId(), request.getLessonId());

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", request.getLessonId()));

        File file = fileRepository.findById(request.getFileId())
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", request.getFileId()));

        if (lessonFileRepository.existsByLessonIdAndFileId(request.getLessonId(), request.getFileId())){
            throw new RuntimeException("File already attached to this lesson");
        }

        LessonFile lessonFile = LessonFile.builder()
                .lesson(lesson)
                .file(file)
                .createdAt(LocalDateTime.now())
                .build();

        lessonFileRepository.save(lessonFile);
        log.info("File attached successfully");

        return mapToResponse(file);
    }

    public List<FileResponse> getFilesByLessonId(Long lessonId) {
        log.info("Fetching files by lesson: {}", lessonId);

        if (!lessonFileRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson", "id", lessonId);
        }

        List<LessonFile> lessonFiles = lessonFileRepository.findByLessonId(lessonId);

        return lessonFiles.stream()
                .map(LessonFile::getFile)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void detachFileFromLesson(Long lessonId, Long fileId){
        log.info("Detaching file {} from lesson {}", lessonId, fileId);

        if (!lessonFileRepository.existsByLessonIdAndFileId(lessonId, fileId)){
            throw new RuntimeException("File not attached to this lesson");
        }

        lessonFileRepository.deleteByLessonIdAndFileId(lessonId, fileId);
        log.info("File detached successfully");
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
                .downloadUrl("http://localhost:8080/api/files/download/" + file.getId())
                .createdAt(file.getCreatedAt())
                .build();
    }
}
