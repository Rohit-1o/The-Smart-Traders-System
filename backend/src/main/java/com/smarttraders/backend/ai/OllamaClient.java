package com.smarttraders.backend.ai;

import org.springframework.web.client.RestClient;

public class OllamaClient {

    private final RestClient restClient;
    private final String model;

    public OllamaClient(String baseUrl, String model) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.model = model;
    }

    public String generate(String prompt) {
        // This client is not currently in use; the application uses LangChain4j for Ollama interactions.
        return null;
    }
}