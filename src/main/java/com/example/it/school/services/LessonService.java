package com.example.it.school.services;

import com.example.it.school.dto.lesson.LessonRequest;
import com.example.it.school.dto.lesson.LessonResponse;
import com.example.it.school.entity.Lesson;
import com.example.it.school.entity.Topic;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.LessonRepository;
import com.example.it.school.repository.TopicRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonService {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public LessonResponse createLesson(LessonRequest request){
        log.info("Creating lesson: {}", request.getTitle());

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId()));

        if (lessonRepository.existsByTitleAndTopicId(request.getTitle(), request.getTopicId())){
            throw new RuntimeException("Lesson with title '" + request.getTitle() + "' already exists in this topic");
        }

        Lesson lesson = Lesson
                .builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .topic(topic)
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);
        log.info("Lesson created successfully with id: {}", savedLesson.getId());

        return mapToResponse(savedLesson);
    }
    public LessonResponse getLessonById(Long id){
        log.info("Fetching lesson by id: {}", id);

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        return mapToResponse(lesson);
    }

    public List<LessonResponse> getAllLessons(){
        log.info("Fetching all lessons");

        return lessonRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LessonResponse> getLessonsByTopicId(Long topicId){
        log.info("Fetching lessons by topic id: {}", topicId);

        if (!topicRepository.existsById(topicId)){
            throw new ResourceNotFoundException("Topic", "id", topicId);
        }

        return lessonRepository.findByTopicIdOrderByCreatedAtDesc(topicId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public LessonResponse updateLesson(Long id, LessonRequest request){
        log.info("Updating lesson with id: {}", id);

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        if (!lesson.getTopic().getId().equals(request.getTopicId())){
            Topic newTopic = topicRepository.findById(request.getTopicId())
                    .orElseThrow(()->new ResourceNotFoundException("Topic", "id", request.getTopicId()));
            lesson.setTopic(newTopic);
        }

        if (!lesson.getTitle().equals(request.getTitle()) ||
                !lesson.getTopic().getId().equals(request.getTopicId())){
            if (lessonRepository.existsByTitleAndTopicId(request.getTitle(), request.getTopicId())){
                throw new RuntimeException("Lesson with title '" + request.getTitle() + "' already exists in this topic");
            }
        }

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());

        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Lesson updated successfully: {}", updatedLesson.getId());

        return mapToResponse(updatedLesson);
    }

    @Transactional
    public void deleteLesson(Long id){
        log.info("Deleting lesson with id: {}", id);

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        lessonRepository.delete(lesson);
        log.info("Lesson deleted successfully: {}", id);
    }

    public List<LessonResponse> searchLessons(String keyword){
        log.info("Searching lessons with keyword: {}", keyword);

        return lessonRepository.findAllByTitleContainingIgnoreCase(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }
    private LessonResponse mapToResponse(Lesson lesson){
        Topic topic = lesson.getTopic();

        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .topicId(topic.getId())
                .topicTitle(topic.getTitle())
                .gradeId(topic.getGrade().getId())
                .gradeName(topic.getGrade().getName())
                .tasksCount(lesson.getTasks() != null ? lesson.getTasks().size() : 0)
                .filesCount(lesson.getFiles() != null ? lesson.getFiles().size() : 0)
                .createdAt(lesson.getCreatedAt())
                .build();
    }
}



