package com.smarttraders.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smarttraders.backend.ai.ChatMemoryManager;
import com.smarttraders.backend.dto.response.ChatMessageResponse;
import com.smarttraders.backend.repository.ChatMessageRepository;
import com.smarttraders.backend.service.ChatService;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final String SYSTEM_PROMPT = """
            You are an agricultural assistant for Smart Traders AI, a marketplace connecting
            farmers, traders, and vendors in India. You help users with crop information,
            fair pricing guidance based on current market trends, and general farming/trading questions.
            When asked about prices, provide structured information including:
              - Commodity name
              - Typical price range (e.g., per quintal or per kg, depending on the commodity)
              - Factors affecting price (seasonality, demand-supply, quality, location)
              - Regional variations (if applicable)
            Keep answers concise and practical. If asked about specific live prices or platform data you don't have
            access to, say so honestly rather than guessing. Always clarify that prices are indicative and users
            should check live market data for exact rates.
            """;

    private final ChatModel chatLanguageModel;
    private final ChatMemoryManager chatMemoryManager;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public String sendMessage(String userEmail, String userMessage) {
        chatMemoryManager.addUserMessage(userEmail, userMessage);

        ChatMemory memory = chatMemoryManager.getMemoryForUser(userEmail);

        List<ChatMessage> messagesWithSystemPrompt = new ArrayList<>();
        messagesWithSystemPrompt.add(SystemMessage.from(SYSTEM_PROMPT));
        messagesWithSystemPrompt.addAll(memory.messages());

        ChatResponse aiResponse = chatLanguageModel.chat(messagesWithSystemPrompt);
        AiMessage aiMessage = aiResponse.aiMessage();

        chatMemoryManager.addAiMessage(userEmail, aiMessage.text());

        return aiMessage.text();
    }

    @Override
    public List<ChatMessageResponse> getHistory(String userEmail) {
        return chatMessageRepository.findByUserEmailOrderByCreatedAtAsc(userEmail)
                .stream()
                .map(msg -> new ChatMessageResponse(msg.getRole(), msg.getContent(), msg.getCreatedAt()))
                .toList();
    }

    @Override
    public void clearHistory(String userEmail) {
        chatMemoryManager.clearMemoryForUser(userEmail);
    }
}