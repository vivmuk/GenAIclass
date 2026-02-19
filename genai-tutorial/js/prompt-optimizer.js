/**
 * Prompt Engineering Lab - Main JavaScript
 */

// Global constants
const API_BASE_URL = 'https://api.venice.ai/api/v1'; // Venice AI API endpoint

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Prompt Engineering Lab...');
    try {
        // Initialize the comparison lab first
        initComparisonLab();
        console.log('Comparison lab initialized');
        
        // Check connection to Venice AI
        checkVeniceConnection().catch(error => {
            console.error("Venice API connection failed:", error);
            // The error state is already handled in checkVeniceConnection
        });
        
        console.log('Initialization complete');
    } catch (error) {
        console.error("Initialization error:", error);
        // Update connection status to show initialization failed
        updateConnectionStatus(false, "Initialization failed");
    }
});

/**
 * Check connection to Venice AI and fetch available models
 */
async function checkVeniceConnection() {
    try {
        // Initial connection status - pending
        updateConnectionStatus(false, "Connecting to Venice AI...");
        
        // Define Venice API configuration
        const apiEndpoint = API_BASE_URL + "/models";
        const apiKey = "hN16lOsWhoVPHEvw1ay9m9krcXhQ_hyBbHh1W6VVwL";
        
        console.log(`Attempting to connect to Venice API at: ${apiEndpoint}`);
        
        // Fetch models from the API
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        // Log detailed response information for debugging
        console.log('API Response Status:', response.status, response.statusText);
        
        // Attempt to read the raw response
        const responseText = await response.text();
        console.log('API Raw Response:', responseText);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }
        
        // Parse the JSON response
        const data = JSON.parse(responseText);
        console.log('API Models Data:', data);
        
        if (data && data.data && Array.isArray(data.data)) {
            // Store models in cache for quick access
            window.cachedModels = data.data;
            
            // Update UI with real model data
            populateModelDropdowns(data.data);
            updateConnectionStatus(true, "Connected to Venice AI");
            return;
        } else {
            throw new Error("Unexpected API response format");
        }
    } catch (error) {
        console.error('Venice API connection error:', error);
        
        // Update connection status to show the error
        updateConnectionStatus(false, "Venice API connection failed");
        
        // Populate dropdowns with empty list to show error state
        populateModelDropdowns([]);
        
        throw error;
    }
}

/**
 * This function should not be used anymore - we only want real Venice API models
 */
async function fetchAvailableModels() {
    throw new Error('fetchAvailableModels should not be called - use real Venice API only');
}

/**
 * Populate model selection dropdowns
 */
function populateModelDropdowns(models) {
    const modelLeft = document.getElementById('model-left');
    const modelRight = document.getElementById('model-right');
    
    if (!modelLeft || !modelRight) return;
    
    // Clear existing options
    modelLeft.innerHTML = '';
    modelRight.innerHTML = '';
    
    // Check if we have models to work with
    if (!models || models.length === 0) {
        console.error('No models available from Venice API');
        // Add a message to the dropdowns indicating the issue
        const errorOption = document.createElement('option');
        errorOption.value = '';
        errorOption.textContent = 'Models unavailable - Check API connection';
        errorOption.disabled = true;
        
        modelLeft.appendChild(errorOption.cloneNode(true));
        modelRight.appendChild(errorOption);
        
        // Update connection status
        updateConnectionStatus(false, "Failed to load models from Venice API");
        return;
    }
    
    // Add models to dropdowns
    models.forEach(model => {
        // Format model name for display
        const modelName = formatModelName(model.id);
        
        // Create description from traits and capabilities
        const description = getModelDescription(model);
        
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = modelName;
        option.dataset.description = description;
        
        modelLeft.appendChild(option.cloneNode(true));
        modelRight.appendChild(option);
    });
    
    // Set default selections
    if (models.length >= 2) {
        // Try to find models with different capabilities for comparison
        const defaultModel1 = models.find(m => m.model_spec.traits.includes("default")) || models[0];
        
        // Find a model different from the first one
        let defaultModel2 = models.find(m => 
            m.id !== defaultModel1.id && 
            (m.model_spec.capabilities.supportsVision || 
             m.model_spec.capabilities.optimizedForCode ||
             m.model_spec.capabilities.supportsReasoning)
        );
        
        // If no model with different capabilities, just use the second one
        if (!defaultModel2) {
            defaultModel2 = models.find(m => m.id !== defaultModel1.id) || models[1];
        }
        
        modelLeft.value = defaultModel1.id;
        modelRight.value = defaultModel2.id;
    }
    
    // Update model info displays
    updateModelInfo(modelLeft);
    updateModelInfo(modelRight);
    
    // Add change event listeners to update info when selection changes
    modelLeft.addEventListener('change', () => updateModelInfo(modelLeft));
    modelRight.addEventListener('change', () => updateModelInfo(modelRight));
}

/**
 * Format a model ID into a readable name - use the model_spec.name if available
 */
function formatModelName(modelId) {
    // Try to find the model in cached models and use its display name
    if (window.cachedModels) {
        const model = window.cachedModels.find(m => m.id === modelId);
        if (model && model.model_spec && model.model_spec.name) {
            return model.model_spec.name;
        }
    }
    
    // Fallback to ID formatting
    return modelId
        .split('-')
        .map(word => {
            // Handle special cases
            if (word === 'llama' || word === 'gpt' || word === 'qwen' || word === 'vl') {
                return word.toUpperCase();
            }
            if (word === 'venice' || word === 'uncensored' || word === 'qwq') {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            if (word === 'deepseek' || word === 'mistral' || word === 'dolphin') {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            // Handle version numbers with decimals
            if (word.includes('.')) {
                return word;
            }
            // Capitalize first letter of other words
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

/**
 * Get a description for a model based on its traits and capabilities
 */
function getModelDescription(model) {
    const traits = model.model_spec.traits || [];
    const capabilities = model.model_spec.capabilities || {};
    
    let description = [];
    
    // Add trait-based descriptions
    if (traits.includes("default")) {
        description.push("General purpose");
    }
    if (traits.includes("fastest")) {
        description.push("Optimized for speed");
    }
    if (traits.includes("most_intelligent")) {
        description.push("High intelligence");
    }
    if (traits.includes("most_uncensored")) {
        description.push("Less restricted outputs");
    }
    if (traits.includes("default_code") || capabilities.optimizedForCode) {
        description.push("Code specialist");
    }
    if (traits.includes("default_reasoning") || capabilities.supportsReasoning) {
        description.push("Advanced reasoning");
    }
    if (traits.includes("default_vision") || capabilities.supportsVision) {
        description.push("Vision capable");
    }
    if (traits.includes("function_calling_default") || capabilities.supportsFunctionCalling) {
        description.push("Function calling");
    }
    
    // If no descriptions were added, add a generic one based on model size
    if (description.length === 0) {
        const modelId = model.id.toLowerCase();
        if (modelId.includes("70b") || modelId.includes("405b") || modelId.includes("671b")) {
            description.push("Large capacity model");
        } else {
            description.push("Balanced performance");
        }
    }
    
    return description.join(", ");
}

/**
 * Update model info display based on selected model
 */
function updateModelInfo(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const infoElement = selectElement.closest('.model-selection').querySelector('.model-info');
    
    if (infoElement && selectedOption) {
        infoElement.textContent = selectedOption.dataset.description || '';
    }
}

/**
 * Initialize the comparison lab functionality
 */
function initComparisonLab() {
    // Get DOM elements
    const sharedPromptInput = document.getElementById('shared-prompt');
    const generateButton = document.getElementById('generate-button');
    const clearAllChatsButton = document.getElementById('clear-all-chats');
    
    // Parameter sliders
    const temperatureLeftSlider = document.getElementById('temperature-left');
    const maxTokensLeftSlider = document.getElementById('max-tokens-left');
    const topPLeftSlider = document.getElementById('top-p-left');
    
    const temperatureRightSlider = document.getElementById('temperature-right');
    const maxTokensRightSlider = document.getElementById('max-tokens-right');
    const topPRightSlider = document.getElementById('top-p-right');
    
    // Parameter value displays
    const temperatureLeftValue = document.getElementById('temperature-value-left');
    const maxTokensLeftValue = document.getElementById('max-tokens-value-left');
    const topPLeftValue = document.getElementById('top-p-value-left');
    
    const temperatureRightValue = document.getElementById('temperature-value-right');
    const maxTokensRightValue = document.getElementById('max-tokens-value-right');
    const topPRightValue = document.getElementById('top-p-value-right');
    
    // Message containers
    const messagesLeft = document.getElementById('messages-left');
    const messagesRight = document.getElementById('messages-right');
    
    // Model selections
    const modelLeft = document.getElementById('model-left');
    const modelRight = document.getElementById('model-right');
    
    // Set up parameter slider event listeners
    setupParameterSlider(temperatureLeftSlider, temperatureLeftValue);
    setupParameterSlider(maxTokensLeftSlider, maxTokensLeftValue);
    setupParameterSlider(topPLeftSlider, topPLeftValue);
    
    setupParameterSlider(temperatureRightSlider, temperatureRightValue);
    setupParameterSlider(maxTokensRightSlider, maxTokensRightValue);
    setupParameterSlider(topPRightSlider, topPRightValue);
    
    // Generate button click handler
    generateButton.addEventListener('click', async () => {
        const prompt = sharedPromptInput.value.trim();
        
        if (!prompt) {
            showPromptSuggestion(messagesLeft, messagesRight);
            return;
        }
        
        if (prompt.length < 10) {
            showShortPromptWarning(messagesLeft, messagesRight, prompt);
            return;
        }
        
        // Disable generate button while processing to prevent multiple submissions
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        
        // Show loading indicators
        messagesLeft.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Generating response...</div>';
        messagesRight.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Generating response...</div>';
        
        // Get parameter values
        const leftParams = {
            temperature: parseFloat(temperatureLeftSlider.value),
            max_tokens: parseInt(maxTokensLeftSlider.value),
            top_p: parseFloat(topPLeftSlider.value),
            model: modelLeft.value
        };
        
        const rightParams = {
            temperature: parseFloat(temperatureRightSlider.value),
            max_tokens: parseInt(maxTokensRightSlider.value),
            top_p: parseFloat(topPRightSlider.value),
            model: modelRight.value
        };
        
        // Log the parameters to verify they're correct
        console.log('Left model parameters:', leftParams);
        console.log('Right model parameters:', rightParams);
        console.log('Prompt being sent to API:', prompt);
        
        try {
            // Generate responses in parallel
            const leftPromise = generateAIResponse(prompt, leftParams).catch(error => {
                console.error('Left model error:', error);
                return `Error generating response: ${error.message}`;
            });
            
            const rightPromise = generateAIResponse(prompt, rightParams).catch(error => {
                console.error('Right model error:', error);
                return `Error generating response: ${error.message}`;
            });
            
            const [leftResponse, rightResponse] = await Promise.all([leftPromise, rightPromise]);
            
            console.log('Left response received:', leftResponse ? leftResponse.substring(0, 50) + '...' : 'No response');
            console.log('Right response received:', rightResponse ? rightResponse.substring(0, 50) + '...' : 'No response');
            
            // Display responses
            messagesLeft.innerHTML = `<div class="user-message">${sanitizeHTML(prompt)}</div>
                                     <div class="${leftResponse.startsWith('Error') ? 'error-message' : 'ai-message'}">${formatResponse(leftResponse)}</div>`;
            
            messagesRight.innerHTML = `<div class="user-message">${sanitizeHTML(prompt)}</div>
                                      <div class="${rightResponse.startsWith('Error') ? 'error-message' : 'ai-message'}">${formatResponse(rightResponse)}</div>`;
        } catch (error) {
            console.error('Error generating responses:', error);
            
            // Show detailed error message
            const errorMessage = `Error: ${error.message || 'Could not generate response'}`;
            messagesLeft.innerHTML = `<div class="user-message">${sanitizeHTML(prompt)}</div>
                                     <div class="error-message">${errorMessage}</div>`;
            messagesRight.innerHTML = `<div class="user-message">${sanitizeHTML(prompt)}</div>
                                      <div class="error-message">${errorMessage}</div>`;
        } finally {
            // Re-enable generate button
            generateButton.disabled = false;
            generateButton.textContent = 'Generate';
        }
    });
    
    // Clear all chats button
    clearAllChatsButton.addEventListener('click', () => {
        messagesLeft.innerHTML = '';
        messagesRight.innerHTML = '';
        sharedPromptInput.value = ''; // Clear the prompt input as well
    });
    
    // Add keypress event listener to submit on Enter key
    sharedPromptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default to avoid newline
            generateButton.click(); // Trigger the generate button click
        }
    });
    
    // Show sample prompts on initial load
    showPromptSuggestion(messagesLeft, messagesRight);
}

/**
 * Set up a parameter slider with its value display
 */
function setupParameterSlider(slider, valueDisplay) {
    if (!slider || !valueDisplay) return;
    
    // Initialize with current value
    valueDisplay.textContent = slider.value;
    
    // Update value display when slider changes
    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
    });
}

/**
 * Generate an AI response for a given prompt and parameters
 */
async function generateAIResponse(prompt, params) {
    console.log(`Generating response for prompt: "${prompt}" with params:`, params);
    
    if (!prompt || prompt.trim() === '') {
        throw new Error('Empty prompt provided. Please enter a valid prompt.');
    }
    
    // Find the model info for validation
    const modelInfo = await findModelInfo(params.model);
    if (!modelInfo) {
        throw new Error(`Model ${params.model} not found in Venice API models list.`);
    }
    
    // Prepare API request payload - using Venice AI format
    const requestBody = {
        model: params.model,
        messages: [
            { role: "user", content: prompt }
        ],
        frequency_penalty: 0,
        n: 1,
        presence_penalty: 0,
        temperature: params.temperature,
        top_p: params.top_p,
        max_tokens: params.max_tokens,
        venice_parameters: { include_venice_system_prompt: true }
    };
    
    // Define API configuration
    const apiEndpoint = API_BASE_URL + "/chat/completions";
    const apiKey = "hN16lOsWhoVPHEvw1ay9m9krcXhQ_hyBbHh1W6VVwL";
    
    console.log(`Making API request to ${apiEndpoint}`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    try {
        // Make the actual API request
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        // Log response information
        console.log('Venice API Response Status:', response.status, response.statusText);
        
        // Read the response
        const responseText = await response.text();
        
        // Check for error responses
        if (!response.ok) {
            console.error('Venice API Error Response:', responseText);
            throw new Error(`Venice API request failed (${response.status}): ${responseText}`);
        }
        
        // Parse the JSON response
        const data = JSON.parse(responseText);
        console.log('Venice API Success Response received');
        console.log('Venice API parsed data:', JSON.stringify(data).substring(0, 500));
        
        // Extract the message content - handle multiple response formats
        if (data.choices && data.choices.length > 0) {
            const choice = data.choices[0];
            // Standard format
            if (choice.message && choice.message.content) {
                return choice.message.content;
            }
            // Reasoning models may put content in reasoning_content or have null content
            if (choice.message && choice.message.reasoning_content) {
                return choice.message.reasoning_content;
            }
            // Delta format (streaming leftovers)
            if (choice.delta && choice.delta.content) {
                return choice.delta.content;
            }
            // Some models return content as empty string with reasoning
            if (choice.message && typeof choice.message.content === 'string') {
                return choice.message.content || '(Model returned empty response)';
            }
            console.error('Unexpected choice structure:', JSON.stringify(choice));
            throw new Error("Could not extract content from API response");
        } else {
            console.error('No choices in response:', JSON.stringify(data));
            throw new Error("Unexpected response format from Venice API");
        }
        
    } catch (error) {
        console.error('Venice API Error:', error);
        throw new Error(`Venice API Error: ${error.message}`);
    }
}

/**
 * Find model information from the model ID
 */
async function findModelInfo(modelId) {
    // Use the cached models from the connection check
    if (!window.cachedModels || window.cachedModels.length === 0) {
        console.warn('No cached models available, returning basic model info');
        // Return a basic model object to prevent errors
        return {
            id: modelId,
            model_spec: {
                name: modelId.charAt(0).toUpperCase() + modelId.slice(1).replace(/-/g, ' '),
                constraints: {
                    temperature: { default: 0.7 },
                    top_p: { default: 0.9 }
                }
            }
        };
    }
    
    // Find the model in cached data
    const model = window.cachedModels.find(m => m.id === modelId);
    
    if (model) {
        return model;
    } else {
        console.warn(`Model ${modelId} not found in cached models`);
        // Return a basic model object to prevent errors
        return {
            id: modelId,
            model_spec: {
                name: modelId.charAt(0).toUpperCase() + modelId.slice(1).replace(/-/g, ' '),
                constraints: {
                    temperature: { default: 0.7 },
                    top_p: { default: 0.9 }
                }
            }
        };
    }
}

/**
 * Format AI response text with proper spacing and links
 */
function formatResponse(text) {
    // Add line breaks
    let formatted = text.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    
    // Convert URLs to links
    formatted = formatted.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    return formatted;
}

/**
 * Sanitize HTML to prevent XSS attacks
 */
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update the connection status display
 */
function updateConnectionStatus(isConnected, message) {
    const connectionStatus = document.getElementById('connection-status');
    
    if (connectionStatus) {
        connectionStatus.innerHTML = isConnected ? 
            `<i class="fas fa-check-circle"></i> ${message}` :
            `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        connectionStatus.style.color = isConnected ? '#4ade80' : '#ff6b6b';
    }
}

/**
 * Show prompt suggestions when no prompt is entered
 */
function showPromptSuggestion(leftContainer, rightContainer) {
    const suggestions = [
        "Tell me about the key features of GPT-4 and how it differs from previous models.",
        "Explain quantum computing in simple terms a high school student would understand.",
        "Write a creative story about a world where AI became sentient.",
        "Compare and contrast the different approaches to reinforcement learning.",
        "What are the potential ethical concerns with large language models?",
        "Write a poem about artificial intelligence and its impact on society.",
        "Design a lesson plan for teaching middle school students about machine learning.",
        "Analyze the strengths and weaknesses of transformer architecture.",
        "Describe recent developments in the Indian Premier League (IPL) cricket tournament.",
        "How might AI transform healthcare in the next decade?"
    ];
    
    const randomSuggestions = getRandomElements(suggestions, 3);
    
    const suggestionHtml = `
        <div class="suggestion-container">
            <h3>Try these sample prompts:</h3>
            <ul class="prompt-suggestions">
                ${randomSuggestions.map(suggestion => 
                    `<li><button class="suggestion-btn">${suggestion}</button></li>`
                ).join('')}
            </ul>
            <p class="suggestion-tip">Compare different models and parameters to see how they affect the AI's response!</p>
        </div>
    `;
    
    leftContainer.innerHTML = suggestionHtml;
    rightContainer.innerHTML = `
        <div class="parameters-guide">
            <h3>Understanding Parameters:</h3>
            <ul>
                <li><strong>Temperature</strong>: Controls randomness. Higher values (0.8+) make output more creative and diverse; lower values (0.2-0.5) make it more focused and deterministic.</li>
                <li><strong>Max Tokens</strong>: Maximum length of the response.</li>
                <li><strong>Top P</strong>: Controls diversity by limiting to top percentage of probability mass. Works with temperature to determine output variability.</li>
            </ul>
            <p>Try setting different values on each side to compare how they affect the output!</p>
        </div>
    `;
    
    // Add click handlers for suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('shared-prompt').value = btn.textContent;
            document.getElementById('generate-button').click();
        });
    });
}

/**
 * Show warning when prompt is too short
 */
function showShortPromptWarning(leftContainer, rightContainer, prompt) {
    const warningHtml = `
        <div class="warning-container">
            <h3>Prompt is too short</h3>
            <p>Your prompt "${sanitizeHTML(prompt)}" is very short. For meaningful comparison, please provide a more detailed prompt.</p>
            <p>Good prompts are specific and provide enough context for the AI to generate a thoughtful response.</p>
        </div>
    `;
    
    leftContainer.innerHTML = warningHtml;
    rightContainer.innerHTML = warningHtml;
}

/**
 * Get random elements from an array
 */
function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Simulated response functions removed - only using real Venice API 