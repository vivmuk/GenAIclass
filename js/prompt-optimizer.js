/**
 * Prompt Engineering Lab - Main JavaScript
 */

// Global constants
const API_BASE_URL = 'https://api.venice.ai/api/v1'; // Venice AI API endpoint

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Check connection to Venice AI
        checkVeniceConnection().catch(error => {
            console.error("Connection error:", error);
            const messagesLeft = document.getElementById('messages-left');
            const messagesRight = document.getElementById('messages-right');
            
            if (messagesLeft && messagesRight) {
                const errorHtml = `
                    <div class="error-message">
                        <h3>Connection Error</h3>
                        <p>Could not connect to Venice AI API: ${error.message}</p>
                        <p>Please check your API key and try again later.</p>
                    </div>
                `;
                messagesLeft.innerHTML = errorHtml;
                messagesRight.innerHTML = errorHtml;
            }
        });
        
        // Initialize the comparison lab
        initComparisonLab();
    } catch (error) {
        console.error("Initialization error:", error);
        alert("Error initializing application: " + error.message);
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
        const apiKey = "ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC";
        
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
        console.error('Venice connection error:', error);
        
        // Update connection status to error
        updateConnectionStatus(false, "Failed to connect to Venice AI");
        alert("Error connecting to Venice AI API: " + error.message);
        
        throw error;
    }
}

/**
 * Provide mock models data as a fallback when API is unavailable
 * This function is only used when the actual API call fails
 */
async function fetchAvailableModels() {
    try {
        console.log('Using mock model data as fallback');
        
        // Mock API response structure that mirrors the expected format from the Venice API
        const mockApiResponse = {
            "object": "list",
            "type": "text",
            "data": [
                {
                    "id": "llama-3.3-70b",
                    "type": "text",
                    "object": "model",
                    "created": 1733768349,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 65536,
                        "capabilities": {
                            "optimizedForCode": false,
                            "supportsVision": false,
                            "supportsFunctionCalling": true,
                            "supportsResponseSchema": false,
                            "supportsWebSearch": true,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.8 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": ["function_calling_default", "default"],
                        "modelSource": "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct"
                    }
                },
                {
                    "id": "llama-3.2-3b",
                    "type": "text",
                    "object": "model",
                    "created": 1727966436,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 131072,
                        "capabilities": {
                            "optimizedForCode": false,
                            "supportsVision": false,
                            "supportsFunctionCalling": true,
                            "supportsResponseSchema": true,
                            "supportsWebSearch": false,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.8 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": ["fastest"],
                        "modelSource": "https://huggingface.co/meta-llama/Llama-3.2-3B"
                    }
                },
                {
                    "id": "mistral-31-24b",
                    "type": "text",
                    "object": "model",
                    "created": 1742262554,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 131072,
                        "capabilities": {
                            "optimizedForCode": false,
                            "supportsVision": true,
                            "supportsFunctionCalling": true,
                            "supportsResponseSchema": true,
                            "supportsWebSearch": true,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.15 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": [],
                        "modelSource": "https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503"
                    }
                },
                {
                    "id": "dolphin-2.9.2-qwen2-72b",
                    "type": "text",
                    "object": "model",
                    "created": 1726869022,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 32768,
                        "capabilities": {
                            "optimizedForCode": false,
                            "supportsVision": false,
                            "supportsFunctionCalling": false,
                            "supportsResponseSchema": true,
                            "supportsWebSearch": true,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.5 },
                            "top_p": { "default": 1 }
                        },
                        "offline": false,
                        "traits": ["most_uncensored"],
                        "modelSource": "https://huggingface.co/cognitivecomputations/dolphin-2.9.2-qwen2-72b"
                    }
                },
                {
                    "id": "llama-3.1-405b",
                    "type": "text",
                    "object": "model",
                    "created": 1730396371,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 65536,
                        "capabilities": {
                            "optimizedForCode": false,
                            "supportsVision": false,
                            "supportsFunctionCalling": false,
                            "supportsResponseSchema": false,
                            "supportsWebSearch": true,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.8 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": ["most_intelligent"],
                        "modelSource": "https://huggingface.co/meta-llama/Meta-Llama-3.1-405B-Instruct"
                    }
                },
                {
                    "id": "qwen-2.5-coder-32b",
                    "type": "text",
                    "object": "model",
                    "created": 1731628653,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 32768,
                        "capabilities": {
                            "optimizedForCode": true,
                            "supportsVision": false,
                            "supportsFunctionCalling": false,
                            "supportsResponseSchema": false,
                            "supportsWebSearch": false,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.8 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": ["default_code"],
                        "modelSource": "https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct-GGUF"
                    }
                },
                {
                    "id": "deepseek-r1-671b",
                    "type": "text",
                    "object": "model",
                    "created": 1738690625,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 131072,
                        "capabilities": {
                            "optimizedForCode": true,
                            "supportsVision": false,
                            "supportsFunctionCalling": false,
                            "supportsResponseSchema": false,
                            "supportsWebSearch": true,
                            "supportsReasoning": true
                        },
                        "constraints": {
                            "temperature": { "default": 0.6 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": ["default_reasoning"],
                        "modelSource": "https://huggingface.co/deepseek-ai/DeepSeek-R1"
                    }
                },
                {
                    "id": "qwen-2.5-vl",
                    "type": "text",
                    "object": "model",
                    "created": 1739074852,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 32768,
                        "capabilities": {
                            "optimizedForCode": false,
                            "supportsVision": true,
                            "supportsFunctionCalling": false,
                            "supportsResponseSchema": false,
                            "supportsWebSearch": true,
                            "supportsReasoning": false
                        },
                        "constraints": {
                            "temperature": { "default": 0.8 },
                            "top_p": { "default": 0.9 }
                        },
                        "offline": false,
                        "traits": ["default_vision"],
                        "modelSource": "https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct"
                    }
                },
                {
                    "id": "qwen-2.5-qwq-32b",
                    "type": "text",
                    "object": "model",
                    "created": 1741218077,
                    "owned_by": "venice.ai",
                    "model_spec": {
                        "availableContextTokens": 32768,
                        "capabilities": {
                            "optimizedForCode": true,
                            "supportsVision": false,
                            "supportsFunctionCalling": false,
                            "supportsResponseSchema": true,
                            "supportsWebSearch": true,
                            "supportsReasoning": true
                        },
                        "constraints": {
                            "temperature": { "default": 0.6 },
                            "top_p": { "default": 0.95 }
                        },
                        "offline": false,
                        "traits": [],
                        "modelSource": "https://huggingface.co/Qwen/QwQ-32B"
                    }
                }
            ]
        };

        return mockApiResponse.data;
    } catch (error) {
        console.error("Error fetching models:", error);
        throw error;
    }
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
 * Format a model ID into a readable name
 */
function formatModelName(modelId) {
    // Replace hyphens with spaces and capitalize words
    return modelId
        .split('-')
        .map(word => {
            // Handle special cases like "llama", "gpt", etc.
            if (word === 'llama' || word === 'gpt' || word === 'qwen' || word === 'vl') {
                return word.toUpperCase();
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
    
    try {
        // Find the model info for default parameter values if needed
        const modelInfo = await findModelInfo(params.model);
        if (!modelInfo) {
            throw new Error(`Model ${params.model} not found`);
        }
        
        // Prepare API request payload - using correct format based on swagger
        const requestBody = {
            model: params.model,
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: params.temperature,
            max_tokens: params.max_tokens,
            top_p: params.top_p
        };
        
        // Define API configuration
        const apiEndpoint = API_BASE_URL + "/chat/completions";
        const apiKey = "ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC";
        
        console.log(`Sending request to ${apiEndpoint} with payload:`, JSON.stringify(requestBody));
        
        // Make the actual API request
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        // Log detailed response information
        console.log('API Response Status:', response.status, response.statusText);
        
        // Attempt to read the raw response
        const responseText = await response.text();
        console.log('API Raw Response:', responseText);
        
        // Check for error responses
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }
        
        try {
            // Parse the JSON response
            const data = JSON.parse(responseText);
            console.log('Parsed API Response:', data);
            
            // Extract the message content based on the standard chat completion response format
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                return data.choices[0].message.content;
            } else {
                throw new Error("Unexpected API response format");
            }
        } catch (parseError) {
            console.error('Failed to parse API response:', parseError);
            throw new Error(`Failed to parse API response: ${parseError.message}`);
        }
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw error;
    }
}

/**
 * Find model information from the model ID
 */
async function findModelInfo(modelId) {
    // Use a cache to avoid repeatedly fetching the same data
    if (!window.cachedModels) {
        try {
            // Try to get models from the API first
            window.cachedModels = await fetchAvailableModels();
            console.log(`Cached ${window.cachedModels.length} models for quick access`);
        } catch (error) {
            console.error('Error caching models:', error);
            window.cachedModels = [];
        }
    }
    
    // Find the model in cached data
    const model = window.cachedModels.find(m => m.id === modelId);
    
    if (model) {
        return model;
    } else {
        console.warn(`Model ${modelId} not found in cached models, fetching fresh data`);
        
        // If not found, try refreshing the cache once
        try {
            window.cachedModels = await fetchAvailableModels();
            return window.cachedModels.find(m => m.id === modelId);
        } catch (error) {
            console.error('Error refreshing model cache:', error);
            return null;
        }
    }
}

/**
 * Determine the general topic of a prompt
 */
function getPromptTopic(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('ipl') || lowerPrompt.includes('cricket') || lowerPrompt.includes('indian premier league')) {
        return 'cricket';
    } else if (lowerPrompt.includes('sky') || lowerPrompt.includes('weather') || lowerPrompt.includes('cloud') || lowerPrompt.includes('rain')) {
        return 'weather';
    } else if (lowerPrompt.includes('ai') || lowerPrompt.includes('computer') || lowerPrompt.includes('technology') || lowerPrompt.includes('digital')) {
        return 'technology';
    } else if (lowerPrompt.includes('nature') || lowerPrompt.includes('animal') || lowerPrompt.includes('plant') || lowerPrompt.includes('tree')) {
        return 'nature';
    } else if (lowerPrompt.includes('consciousness') || lowerPrompt.includes('meaning') || lowerPrompt.includes('existence') || lowerPrompt.includes('think')) {
        return 'philosophy';
    }
    
    return 'default';
}

/**
 * Generate a response for high temperature settings
 */
function generateCreativeResponse(prompt, topic) {
    const creativeResponses = {
        default: "This is a more creative response with higher temperature. The higher temperature makes the output more diverse and sometimes unpredictable. It can include more unexpected ideas and phrasings, exploring unusual connections and novel concepts that might not appear with lower temperature settings.",
        weather: "The sky is a canvas of infinite possibilities! It's not merely blue, but a symphony of azure tones dancing with wisps of alabaster clouds. The atmospheric theater performs its daily show, with light refracting through suspended water droplets to create a spectacle of color and motion that has inspired poets, painters, and dreamers throughout human history.",
        technology: "Technology's future unfolds like a blossoming digital flower, with quantum computing threads interweaving with neural interfaces to create a tapestry of possibilities we can barely imagine today. The boundaries between human cognition and machine intelligence blur into a new form of consciousness that transcends our current definitions of both.",
        nature: "Nature weaves an intricate dance of complexity and simplicity, where each leaf contains universes of cellular machinery while following ancient patterns etched into genetic memory. The forests breathe with a rhythm older than humanity, cycling carbon and oxygen in a planetary respiration that has sustained life through eons of evolutionary experimentation.",
        philosophy: "Consciousness might be viewed as a fractal phenomenon, recursively aware of its own awareness in an infinite regression of self-reflection. Our perception of reality is perhaps less a window onto truth and more a creative interpretation—a story we tell ourselves about patterns of neural firing that somehow becomes the lived experience of being human.",
        cricket: "The IPL is not just a cricket tournament—it's a dazzling carnival of athletic artistry where boundaries dissolve between sport and spectacle! Each match unfolds like an epic narrative with heroes emerging from unlikely corners, dynasties rising and falling, and moments of transcendent brilliance that redefine what's possible with bat and ball. The symphony of cheering crowds, the kaleidoscope of team colors, and the electric energy of last-ball finishes create an atmosphere unlike anything else in the sporting universe."
    };
    
    return creativeResponses[topic] || creativeResponses.default;
}

/**
 * Generate a response for low temperature settings
 */
function generateFocusedResponse(prompt, topic) {
    const focusedResponses = {
        default: "This is a more focused and deterministic response with lower temperature. The lower temperature makes the output more consistent and predictable. It typically sticks closer to the most likely tokens at each step, providing information in a direct and straightforward manner.",
        weather: "The sky appears blue due to a phenomenon called Rayleigh scattering. Sunlight contains all colors of visible light, and when it enters Earth's atmosphere, air molecules scatter the shorter blue wavelengths more effectively than longer wavelengths. This scattered blue light comes to us from all directions, making the sky appear blue.",
        technology: "Artificial intelligence systems currently operate through machine learning techniques that identify patterns in training data to make predictions or decisions. Modern AI implementations include natural language processing, computer vision, and reinforcement learning, each specialized for different categories of tasks.",
        nature: "Ecosystems function through the transfer of energy and materials between organisms. Plants convert solar energy to chemical energy through photosynthesis, herbivores consume plants, and carnivores consume herbivores. Decomposers break down organic matter, returning nutrients to the soil for plants to utilize.",
        philosophy: "Epistemology examines the nature of knowledge, asking how we know what we know. The field addresses questions about the reliability of perception, the role of reason versus experience in acquiring knowledge, and the standards by which knowledge claims should be evaluated.",
        cricket: "The IPL (Indian Premier League) is a professional Twenty20 cricket league established in 2008 and based in India. It consists of ten teams representing different Indian cities and is typically played between March and May each year. The IPL operates on a franchise system where teams acquire players through annual auctions. It is the most-attended cricket league globally and ranks sixth among all sports leagues in average attendance."
    };
    
    return focusedResponses[topic] || focusedResponses.default;
}

/**
 * Generate a response for balanced temperature settings
 */
function generateBalancedResponse(prompt, topic) {
    const balancedResponses = {
        default: "This is a balanced response with moderate temperature. It balances creativity with focus, providing relevant information while still allowing for some variability in the output. This approach often yields the most natural-sounding text for general purposes.",
        weather: "The sky appears blue because air molecules scatter sunlight—specifically the shorter blue wavelengths—more effectively than other colors. This phenomenon, called Rayleigh scattering, sends blue light in all directions, creating the blue dome we see overhead. At sunrise and sunset, light travels through more atmosphere, scattering the blue and allowing the reds and oranges to dominate.",
        technology: "Artificial intelligence continues to evolve through advances in machine learning techniques and computational power. Modern AI systems can process natural language, recognize images, and make complex decisions based on vast datasets. While current AI excels at specific tasks, the field is moving toward more general capabilities that can transfer learning across domains.",
        nature: "Ecosystems maintain balance through complex interactions between organisms and their environment. Energy flows from producers (plants) through various consumer levels, while materials cycle between living organisms and abiotic components. This delicate equilibrium can adapt to gradual changes but may be disrupted by sudden environmental shifts or human activities.",
        philosophy: "Consciousness remains one of philosophy's most fascinating puzzles, bridging subjective experience with objective reality. The question of how physical brain processes create the sensation of awareness has implications for our understanding of free will, personal identity, and even the nature of reality itself.",
        cricket: "The IPL (Indian Premier League) is a professional Twenty20 cricket tournament founded in 2008 that has revolutionized the sport through its blend of cricket, entertainment, and commercial innovation. Featuring world-class international players alongside emerging Indian talent, the league operates on a franchise model with teams representing major Indian cities. The IPL combines high-quality cricket with elements of entertainment including celebrity owners, cheerleaders, and musical performances, creating a unique sporting spectacle that attracts massive viewership both in stadiums and on television."
    };
    
    return balancedResponses[topic] || balancedResponses.default;
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

/**
 * Generate a simulated AI response using real model data
 */
async function generateSimulatedResponse(prompt, params) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Get model info for the response
            const modelInfo = findModelInfo(params.model) || {};
            
            // Get topic based on prompt
            const topic = getPromptTopic(prompt);
            console.log(`Simulating response for topic: ${topic} with model: ${params.model}`);
            
            // Generate response based on temperature and topic
            let response;
            if (params.temperature > 1.0) {
                response = generateCreativeResponse(prompt, topic);
            } else if (params.temperature < 0.5) {
                response = generateFocusedResponse(prompt, topic);
            } else {
                response = generateBalancedResponse(prompt, topic);
            }
            
            // Personalize response with the actual prompt text
            if (prompt.length > 10) {
                const promptReference = `Regarding your question about "${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}", `;
                response = promptReference + response;
            }
            
            // Add parameter-specific details using real model data
            const modelConstraints = modelInfo.model_spec ? 
                `Default settings from model data: Temperature: ${modelInfo.model_spec.constraints?.temperature?.default || 0.7}, Top P: ${modelInfo.model_spec.constraints?.top_p?.default || 0.9}` :
                '';
            
            // Add model-specific content from real model data
            const modelName = params.model?.toLowerCase() || '';
            const modelSource = modelInfo.model_spec?.modelSource || '';
            let modelSpecificContent = "\n\n";
            
            // Default model capabilities info
            let capabilities = [];
            if (modelInfo.model_spec?.capabilities?.optimizedForCode) capabilities.push("optimized for code");
            if (modelInfo.model_spec?.capabilities?.supportsVision) capabilities.push("vision-capable");
            if (modelInfo.model_spec?.capabilities?.supportsFunctionCalling) capabilities.push("supports function calling");
            if (modelInfo.model_spec?.capabilities?.supportsReasoning) capabilities.push("enhanced reasoning");
            if (modelInfo.model_spec?.capabilities?.supportsWebSearch) capabilities.push("web search enabled");
            
            const capabilitiesStr = capabilities.length ? capabilities.join(", ") : "general purpose";
            
            // Model-specific content
            if (modelName.includes('llama')) {
                modelSpecificContent += `This LLAMA model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr}.`;
                
                if (modelName.includes('3.3')) {
                    modelSpecificContent += " Version 3.3 has improved function calling capabilities and reasoning.";
                } else if (modelName.includes('405b')) {
                    modelSpecificContent += " This 405B parameter model delivers exceptional intelligence and comprehensive understanding.";
                }
            } else if (modelName.includes('mistral')) {
                modelSpecificContent += `This Mistral model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr}.`;
            } else if (modelName.includes('dolphin')) {
                modelSpecificContent += `This Dolphin model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr} and known for less restricted outputs.`;
            } else if (modelName.includes('qwen')) {
                if (modelName.includes('coder')) {
                    modelSpecificContent += `This Qwen Coder model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr} and specialized for programming tasks.`;
                } else if (modelName.includes('vl')) {
                    modelSpecificContent += `This Qwen VL model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr} with multimodal capabilities.`;
                } else {
                    modelSpecificContent += `This Qwen model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr}.`;
                }
            } else if (modelName.includes('deepseek')) {
                modelSpecificContent += `This DeepSeek model (${modelSource ? 'based on ' + modelSource.split('/').pop() : ''}) is ${capabilitiesStr} with exceptionally large context windows.`;
            }
            
            // Add context window information if available
            if (modelInfo.model_spec?.availableContextTokens) {
                modelSpecificContent += ` It has a context window of ${modelInfo.model_spec.availableContextTokens} tokens.`;
            }
            
            // Finish with parameter information and model capabilities
            response += `\n\nWith the parameters you selected (Temperature: ${params.temperature}, Max Tokens: ${params.max_tokens}, Top P: ${params.top_p}), the response demonstrates how these settings affect the output. ${modelConstraints}`;
            response += modelSpecificContent;
            
            // Add a note that this is simulated output but using real model data
            response += "\n\n[Note: This is a simulated response using the real model data from Venice AI. The completions API is not currently available, so responses are generated locally.]";
            
            resolve(response);
        }, 1500);
    });
} 