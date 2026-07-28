package com.smarttraders.backend.service;

import java.util.List;

import com.smarttraders.backend.dto.response.ChatMessageResponse;

public interface ChatService {
    String sendMessage(String userEmail, String userMessage);
    List<ChatMessageResponse> getHistory(String userEmail);
    void clearHistory(String userEmail);
}