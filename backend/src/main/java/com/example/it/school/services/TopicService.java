package com.example.it.school.services;

import com.example.it.school.dto.topic.TopicRequest;
import com.example.it.school.dto.topic.TopicResponse;
import com.example.it.school.entity.Grade;
import com.example.it.school.entity.Topic;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.GradeRepository;
import com.example.it.school.repository.TopicRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final TopicRepository topicRepository;
    private final GradeRepository gradeRepository;

    @Transactional
    public TopicResponse createTopic(TopicRequest request){
        log.info("Creating topic: {}", request.getTitle());

        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(()-> new ResourceNotFoundException("Grade", "id", request.getGradeId()));

        if (topicRepository.existsByTitleAndGradeId(request.getTitle(), request.getGradeId())) {
            throw new RuntimeException("Topic with title '" + request.getTitle() + "' already exists it this grade");
        }

        Topic topic = Topic.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .grade(grade)
                .build();

        Topic savedTopic = topicRepository.save(topic);
        log.info("Topic created successfully with id: {}", savedTopic.getId());

        return mapToResponse(savedTopic);
    }

    public TopicResponse getTopicById(Long id){
        log.info("Fetching topic by id: {}", id);

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));

        return mapToResponse(topic);
    }

    public List<TopicResponse> getAllTopics(){
        log.info("Fetching all topics");

        return topicRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TopicResponse> getTopicsByGradeId(Long gradeId){
        log.info("Fetching topics by grade id: {}", gradeId);

        if (!gradeRepository.existsById(gradeId)){
            throw new ResourceNotFoundException("Grade", "id", gradeId);
        }

        return topicRepository.findTopicsByGradeIdOrderByCreatedAtDesc(gradeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TopicResponse updateTopic(Long id, TopicRequest request) {
        log.info("Updating topic with id: {}", id);

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));

        if (!topic.getGrade().getId().equals(request.getGradeId())){
            Grade newGrade = gradeRepository.findById(request.getGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Grade", "id", request.getGradeId()));

            topic.setGrade(newGrade);
        }
        if (!topic.getTitle().equals(request.getTitle()) ||
            !topic.getGrade().getId().equals(request.getGradeId())){
            if (topicRepository.existsByTitleAndGradeId(request.getTitle(), request.getGradeId())){
                throw new RuntimeException("Topic with title '" + request.getTitle() + "' already exists in this grade");
            }
        }

        topic.setTitle(request.getTitle());
        topic.setDescription(request.getDescription());

        Topic updatedTopic = topicRepository.save(topic);
        log.info("Topic updated successfully: {}", updatedTopic.getId());

        return mapToResponse(updatedTopic);
    }

    @Transactional
    public void deleteTopic(Long id){
        log.info("Deleting topic with id: {}", id);

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));

        topicRepository.delete(topic);
        log.info("Topic deleted successfully: {}", id);
    }

    public List<TopicResponse> searchTopics(String keyword){
    log.info("Searching topics with keyword: {}", keyword);

    List<Topic> topics = topicRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);

    return topics.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private TopicResponse mapToResponse(Topic topic){
        Grade grade = topic.getGrade();

        return TopicResponse.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .gradeId(grade.getId())
                .gradeName(grade.getName())
                .gradeDisplayName(grade.getDisplayName())
                .lessonsCount(topic.getLessons() != null ? topic.getLessons().size() : 0)
                .createdAt(topic.getCreatedAt())
                .build();
    }
}
