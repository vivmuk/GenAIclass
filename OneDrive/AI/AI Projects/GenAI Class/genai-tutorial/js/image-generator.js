// Image Generator Application for GenAIV Academy

// API Configuration
const API_CONFIG = {
    enabled: true,
    key: "hN16lOsWhoVPHEvw1ay9m9krcXhQ_hyBbHh1W6VVwL",
    endpoint: "https://api.venice.ai/api/v1/image/generate", // Fixed endpoint
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};

// Model options from Venice.ai API - Updated with latest models
const MODELS = [
  { id: "venice-sd35", name: "Venice SD3.5", traits: ["default", "eliza-default"] },
  { id: "hidream", name: "HiDream", traits: [] },
  { id: "fluently-xl", name: "Fluently-XL-Final", traits: ["fastest"] },
  { id: "flux-dev", name: "FLUX.1-dev", traits: ["highest_quality"] },
  { id: "flux-dev-uncensored", name: "FLUX.1-dev (uncensored)", traits: [] },
  { id: "lustify-sdxl", name: "Lustify-SDXL-NSFW", traits: [] },
  { id: "pony-realism", name: "Pony-Realism", traits: ["most_uncensored"] },
  { id: "stable-diffusion-3.5", name: "Stable-Diffusion-3.5-Large", traits: [] }
];

// Style presets
const STYLE_PRESETS = [
  "None",
  "3D Model", "Analog Film", "Anime", "Cinematic", "Comic Book", "Craft Clay", 
  "Digital Art", "Enhance", "Fantasy Art", "Isometric Style", "Line Art", 
  "Lowpoly", "Neon Punk", "Origami", "Photographic", "Pixel Art", "Texture", 
  "Advertising", "Food Photography", "Real Estate", "Abstract", "Cubist", 
  "Graffiti", "Hyperrealism", "Impressionist", "Pointillism", "Pop Art", 
  "Psychedelic", "Renaissance", "Steampunk", "Surrealist", "Typography", 
  "Watercolor", "Fighting Game", "GTA", "Super Mario", "Minecraft", "Pokemon", 
  "Retro Arcade", "Retro Game", "RPG Fantasy Game", "Strategy Game", 
  "Street Fighter", "Legend of Zelda", "Architectural", "Disco", "Dreamscape", 
  "Dystopian", "Fairy Tale", "Gothic", "Grunge", "Horror", "Minimalist", 
  "Monochrome", "Nautical", "Space", "Stained Glass", "Techwear Fashion", 
  "Tribal", "Zentangle", "Collage", "Flat Papercut", "Kirigami", "Paper Mache", 
  "Paper Quilling", "Papercut Collage", "Papercut Shadow Box", "Stacked Papercut", 
  "Thick Layered Papercut", "Alien", "Film Noir", "HDR", "Long Exposure", 
  "Neon Noir", "Silhouette", "Tilt-Shift"
];

// Resolution presets
const RESOLUTION_PRESETS = {
  "16:9": {
    low: { width: 640, height: 360 },
    medium: { width: 1024, height: 576 },
    high: { width: 1280, height: 720 },
    ultra: { width: 1920, height: 1080 }
  },
  "1:1": {
    low: { width: 512, height: 512 },
    medium: { width: 768, height: 768 },
    high: { width: 1024, height: 1024 },
    ultra: { width: 1536, height: 1536 }
  },
  "3:2": {
    low: { width: 600, height: 400 },
    medium: { width: 1080, height: 720 },
    high: { width: 1350, height: 900 },
    ultra: { width: 1800, height: 1200 }
  },
  "9:16": {
    low: { width: 360, height: 640 },
    medium: { width: 576, height: 1024 },
    high: { width: 720, height: 1280 },
    ultra: { width: 1080, height: 1920 }
  },
  "2:3": {
    low: { width: 400, height: 600 },
    medium: { width: 720, height: 1080 },
    high: { width: 900, height: 1350 },
    ultra: { width: 1200, height: 1800 }
  },
  "4:3": {
    low: { width: 640, height: 480 },
    medium: { width: 1024, height: 768 },
    high: { width: 1280, height: 960 },
    ultra: { width: 1600, height: 1200 }
  }
};

// Generate reliable placeholder URLs for demo images using placehold.co service
function getPlaceholderImage(modelId, width = 1024, height = 1024) {
  const modelColors = {
    "flux-dev": "7c3aed",
    "fluently-xl": "4f46e5",
    "stable-diffusion-3.5": "06b6d4",
    "pony-realism": "8b5cf6",
    "lustify-sdxl": "10b981",
    "flux-dev-uncensored": "f59e0b"
  };
  
  const bgColor = modelColors[modelId] || "7c3aed";
  const modelName = MODELS.find(m => m.id === modelId)?.name || "AI Model";
  
  return `https://placehold.co/${width}x${height}/${bgColor}/FFFFFF?text=${encodeURIComponent(modelName)}+Demo`;
}

// Function to directly fetch and debug API models
async function debugVeniceModels() {
  try {
    console.log("Direct debug fetch from Venice AI API...");
    
    // Direct API fetch for debugging
    const response = await fetch("https://api.venice.ai/api/v1/models", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch models: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log("Raw API response:", data);
    
    // Filter image models
    if (data && data.data && Array.isArray(data.data)) {
      const imageModels = data.data.filter(model => model.type === "image");
      console.log("Available image models:", imageModels);
      console.log("Model IDs:", imageModels.map(m => m.id));
    }
  } catch (error) {
    console.error("Debug fetch error:", error);
  }
}

// Function to fetch available models from Venice.ai API
async function fetchAvailableModels() {
  if (!API_CONFIG.enabled) {
    console.log("API not enabled, using predefined models");
    return MODELS;
  }
  
  try {
    console.log("Fetching available image models from Venice AI...");
    const response = await fetch("https://api.venice.ai/api/v1/models", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Available models from API:", data);
    
    if (data && data.data && Array.isArray(data.data)) {
      // Filter for image models only
      const imageModels = data.data.filter(model => model.type === "image");
      console.log("Filtered image models:", imageModels);
      
      if (imageModels.length > 0) {
        // Update the global MODELS array with fetched data
        const updatedModels = imageModels.map(model => ({
          id: model.id,
          name: model.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          traits: model.model_spec?.traits || []
        }));
        
        // Store globally for access by other functions
        window.VENICE_MODELS = updatedModels;
        console.log("Updated MODELS array:", updatedModels);
        
        // Replace the models in the dropdown
        const modelSelect = document.getElementById('model');
        if (modelSelect) {
          modelSelect.innerHTML = '';
          updatedModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            if (model.traits.includes('default')) {
              option.selected = true;
            }
            modelSelect.appendChild(option);
          });
          console.log("Models dropdown updated with options:", modelSelect.options.length);
        }
        
        return updatedModels;
      } else {
        console.log("No image models found, using predefined models");
        return MODELS;
      }
    } else {
      console.error("Unexpected API response format:", data);
      return MODELS;
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    console.log("Falling back to predefined models");
    return MODELS;
  }
}

// Function to fetch available styles from Venice.ai API
async function fetchAvailableStyles() {
  if (!API_CONFIG.enabled) {
    console.log("API not enabled, using predefined styles");
    return;
  }
  
  try {
    console.log("Fetching available styles from Venice AI...");
    const response = await fetch("https://api.venice.ai/api/v1/image/styles", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch styles: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Available styles from API:", data);
    
    if (data && data.data && Array.isArray(data.data)) {
      // Update the style dropdown with fetched styles
      const styleSelect = document.getElementById('style');
      if (styleSelect) {
        styleSelect.innerHTML = '<option value="None">None</option>';
        data.data.forEach(style => {
          const option = document.createElement('option');
          option.value = style;
          option.textContent = style;
          styleSelect.appendChild(option);
        });
        console.log("Styles dropdown updated with options:", styleSelect.options.length);
      } else {
        console.error("Style select element not found in DOM");
      }
    } else {
      console.error("Unexpected API response format:", data);
    }
  } catch (error) {
    console.error("Error fetching styles:", error);
    // Fallback to predefined styles
    console.log("Falling back to predefined styles");
  }
}

// Main application class
class ImageGenerator {
  constructor() {
    console.log("ImageGenerator constructor called");
    
    // Image generation state
    this.isGenerating = false;
    this.progressInterval = null;
    this.progressStartTime = 0;
    
    // Gallery
    this.galleryImages = [];
    
    // Initialize immediately if DOM is already loaded, otherwise wait
    if (document.readyState === 'loading') {
      console.log("Document still loading, waiting for DOMContentLoaded");
      document.addEventListener('DOMContentLoaded', () => {
        console.log("DOMContentLoaded fired inside constructor");
        this.initialize();
      });
    } else {
      console.log("Document already loaded, initializing immediately");
      this.initialize();
    }
  }

  setupDOM() {
    // Setup aspect ratio and resolution handlers
    this.setupResolutionHandlers();
  }
  
  setupResolutionHandlers() {
    const aspectRatioSelect = document.getElementById('aspect-ratio');
    const resolutionSelect = document.getElementById('resolution');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    if (aspectRatioSelect && resolutionSelect && widthInput && heightInput) {
      // Set initial values based on default selections
      this.updateDimensions(aspectRatioSelect.value, resolutionSelect.value);
      
      // Add event listeners for changes
      aspectRatioSelect.addEventListener('change', () => {
        this.updateDimensions(aspectRatioSelect.value, resolutionSelect.value);
      });
      
      resolutionSelect.addEventListener('change', () => {
        this.updateDimensions(aspectRatioSelect.value, resolutionSelect.value);
      });
    }
  }
  
  updateDimensions(aspectRatio, resolution) {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    if (widthInput && heightInput) {
      const dimensions = RESOLUTION_PRESETS[aspectRatio][resolution];
      widthInput.value = dimensions.width;
      heightInput.value = dimensions.height;
    }
  }

  setupTabs() {
    const generatorTab = document.getElementById('generator-tab');
    const optimizerTab = document.getElementById('optimizer-tab');
    const generatorPanel = document.getElementById('generator-panel');
    const optimizerPanel = document.getElementById('optimizer-panel');
    
    if (generatorTab && optimizerTab && generatorPanel && optimizerPanel) {
      generatorTab.addEventListener('click', () => {
        generatorTab.classList.add('active');
        optimizerTab.classList.remove('active');
        generatorPanel.classList.remove('hidden');
        optimizerPanel.classList.add('hidden');
      });
      
      optimizerTab.addEventListener('click', () => {
        optimizerTab.classList.add('active');
        generatorTab.classList.remove('active');
        optimizerPanel.classList.remove('hidden');
        generatorPanel.classList.add('hidden');
      });
    }
  }

  addEventListeners() {
    const form = document.getElementById('generate-form');
    const downloadButton = document.getElementById('download-button');
    const saveGalleryButton = document.getElementById('save-gallery-button');
    const optimizeButton = document.getElementById('optimize-button');
    const useOptimizedPromptButton = document.getElementById('use-optimized-prompt');
    
    if (form) {
      form.addEventListener('submit', this.handleGenerateImage.bind(this));
    }
    
    if (downloadButton) {
      downloadButton.addEventListener('click', this.handleDownloadImage.bind(this));
    }
    
    if (saveGalleryButton) {
      saveGalleryButton.addEventListener('click', this.handleSaveToGallery.bind(this));
    }
    
    if (optimizeButton) {
      optimizeButton.addEventListener('click', this.handleOptimizePrompt.bind(this));
    }
    
    if (useOptimizedPromptButton) {
      useOptimizedPromptButton.addEventListener('click', this.handleUseOptimizedPrompt.bind(this));
    }
  }

  startProgressIndicator() {
    // Show progress container
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const timeCounter = document.getElementById('time-counter');
    const placeholder = document.getElementById('placeholder');
    const result = document.getElementById('result');
    
    if (progressContainer && progressBar && progressPercentage && timeCounter) {
      // Hide placeholder and result
      if (placeholder) placeholder.classList.add('hidden');
      if (result) result.classList.add('hidden');
      
      // Show progress container
      progressContainer.classList.remove('hidden');
      progressBar.style.width = '0%';
      
      // Store start time
      this.progressStartTime = Date.now();
      
      // Update progress indicator
      this.progressInterval = setInterval(() => {
        const elapsedSeconds = (Date.now() - this.progressStartTime) / 1000;
        timeCounter.textContent = `${elapsedSeconds.toFixed(1)}s`;
        
        // Calculate estimated percentage (capped at 95% until complete)
        const estimatedPercentage = Math.min(95, Math.round((elapsedSeconds / 5) * 100));
        progressBar.style.width = `${estimatedPercentage}%`;
        progressPercentage.textContent = `${estimatedPercentage}%`;
      }, 100);
    }
  }
  
  stopProgressIndicator(success = true) {
    clearInterval(this.progressInterval);
    
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (progressContainer && progressBar) {
      if (success) {
        // Complete the progress bar animation
        progressBar.style.width = '100%';
        if (progressPercentage) progressPercentage.textContent = '100%';
        
        // Hide after a delay
        setTimeout(() => {
          progressContainer.classList.add('hidden');
        }, 500);
      } else {
        // Show error state
        progressBar.style.backgroundColor = '#EF4444';
        progressBar.style.width = '100%';
        
        // Hide after a delay
        setTimeout(() => {
          progressContainer.classList.add('hidden');
          progressBar.style.backgroundColor = '';
          
          // Show placeholder with error message
          const placeholder = document.getElementById('placeholder');
          if (placeholder) {
            placeholder.classList.remove('hidden');
            placeholder.innerHTML = `
              <div class="placeholder-content">
                <i class="fas fa-exclamation-triangle placeholder-icon" style="color: #EF4444;"></i>
                <p>Error generating image. Please try again.</p>
              </div>
            `;
          }
        }, 2000);
      }
    }
  }
  
  async handleGenerateImage(event) {
    if (event) event.preventDefault();
    
    // Get form values
    const model = document.getElementById('model').value;
    const style = document.getElementById('style').value;
    const prompt = document.getElementById('prompt').value;
    const negativePrompt = document.getElementById('negative-prompt').value;
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const steps = parseInt(document.getElementById('steps').value);
    
    // Validate prompt
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    // Start progress indicator
    this.startProgressIndicator();
    
    try {
      let imageData;
      
      // Check if we're using real API or demo mode
      if (API_CONFIG.enabled) {
        // Use real API for image generation - Venice AI format
        const payload = {
          model: model,
          prompt: prompt,
          embed_exif_metadata: false,
          format: "webp",
          height: height,
          width: width,
          hide_watermark: false,
          return_binary: false,
          safe_mode: true,
          seed: 0,
          steps: steps
        };
        
        // Add style if not None
        if (style && style !== "None") {
          payload.style_preset = style;
        }
        
        // Add negative prompt if provided
        if (negativePrompt) {
          payload.negative_prompt = negativePrompt;
        }
        
        console.log("Sending request to Venice AI:", payload);
        
        // Call the API
        const response = await fetch(API_CONFIG.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_CONFIG.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        // Process the response
        const result = await response.json();
        
        if (!response.ok) {
          console.error("API Error Response:", result);
          throw new Error(result.error?.message || result.error || 'Failed to generate image');
        }
        
        console.log("Venice API Response:", result);
        
        // Extract the image data from the response
        let imageUrl = null;
        
        if (result.images && Array.isArray(result.images) && result.images.length > 0) {
          imageUrl = result.images[0];
        } else if (result.image) {
          imageUrl = result.image;
        } else if (result.objectid) {
          console.log('Image generated with objectid:', result.objectid);
          if (result.images) {
            if (typeof result.images === 'string') {
              imageUrl = result.images;
            } else if (Array.isArray(result.images) && result.images.length > 0) {
              imageUrl = result.images[0];
            }
          }
        }
        
        if (!imageUrl) {
          throw new Error('No image data found in API response');
        }
        
        // Ensure the image data is properly formed for rendering
        if (!imageUrl.startsWith('data:image')) {
          imageUrl = 'data:image/png;base64,' + imageUrl;
        }
        
        // Create image data object
        imageData = {
          id: Date.now(),
          model: model,
          modelName: MODELS.find(m => m.id === model)?.name || model,
          style: style,
          prompt: prompt,
          negativePrompt: negativePrompt,
          width: width,
          height: height,
          steps: steps,
          imageUrl: imageUrl,
          timestamp: new Date().toISOString()
        };
        
      } else {
        // Use demo mode with placeholder images
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
        
        // Generate a placeholder image with the correct dimensions
        const placeholderUrl = getPlaceholderImage(model, width, height);
        
        // Create image data
        imageData = {
          id: Date.now(),
          model: model,
          modelName: MODELS.find(m => m.id === model)?.name || model,
          style: style,
          prompt: prompt,
          negativePrompt: negativePrompt,
          width: width,
          height: height,
          steps: steps,
          imageUrl: placeholderUrl,
          timestamp: new Date().toISOString()
        };
      }
      
      // Update UI with generated image
      this.updateImageDetails(imageData);
      
      // Stop progress indicator
      this.stopProgressIndicator(true);
      
      // Show gallery section
      const gallerySection = document.getElementById('gallery-section');
      if (gallerySection) gallerySection.classList.remove('hidden');
      
    } catch (error) {
      console.error('Error generating image:', error);
      this.stopProgressIndicator(false);
      
      // Show error in placeholder
      const placeholder = document.getElementById('placeholder');
      if (placeholder) {
        placeholder.classList.remove('hidden');
        placeholder.innerHTML = `
          <div class="placeholder-content">
            <i class="fas fa-exclamation-triangle placeholder-icon" style="color: #EF4444;"></i>
            <p>Error: ${error.message}</p>
          </div>
        `;
      }
    }
  }
  
  updateImageDetails(imageData) {
    const result = document.getElementById('result');
    const generatedImage = document.getElementById('generated-image');
    const resultModel = document.getElementById('result-model');
    const resultStyle = document.getElementById('result-style');
    const resultSize = document.getElementById('result-size');
    const resultSteps = document.getElementById('result-steps');
    
    if (result && generatedImage && resultModel && resultStyle && resultSize && resultSteps) {
      // Update image and details
      generatedImage.src = imageData.imageUrl;
      resultModel.textContent = imageData.modelName;
      resultStyle.textContent = imageData.style;
      resultSize.textContent = `${imageData.width}×${imageData.height}`;
      resultSteps.textContent = imageData.steps;
      
      // Store current image data for download and gallery
      this.currentImageData = imageData;
      
      // Show result
      result.classList.remove('hidden');
      result.classList.add('fadeIn');
    }
  }
  
  async handleOptimizePrompt(event) {
    if (event) event.preventDefault();
    
    // Get initial prompt
    const initialPrompt = document.getElementById('initial-prompt').value;
    
    if (!initialPrompt.trim()) {
      alert('Please enter a prompt to optimize');
      return;
    }
    
    // Show loading state
    const optimizeButton = document.getElementById('optimize-button');
    if (optimizeButton) {
      optimizeButton.disabled = true;
      optimizeButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Optimizing...';
    }
    
    try {
      let optimizedPrompt;
      
      // Check if we're using real API or demo mode
      if (API_CONFIG.enabled && API_CONFIG.key !== "YOUR_API_KEY") {
        // Use real API for prompt optimization
        const chatPayload = {
          model: "llama-3.3-70b", // Using Llama model for text generation
          messages: [
            {
              role: "system",
              content: "You are an expert image prompt engineer. Your job is to enhance user prompts for AI image generation to make them more detailed, descriptive, and likely to produce high-quality images. Focus on adding visual details, style references, lighting, composition elements, and mood/atmosphere descriptions. Format your response to be just the enhanced prompt with no explanations or other text."
            },
            {
              role: "user",
              content: `Please optimize this image generation prompt: "${initialPrompt}"`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        };
        
        // Call the API
        const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_CONFIG.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(chatPayload)
        });
        
        // Process the response
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to optimize prompt');
        }
        
        if (result.choices && result.choices.length > 0) {
          optimizedPrompt = result.choices[0].message.content.trim();
        } else {
          throw new Error('No optimized prompt was returned');
        }
        
      } else {
        // Use demo mode with placeholder optimization
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        // Enhancement terms to add
        const enhancementTerms = [
          'highly detailed',
          'professional quality',
          'sharp focus',
          'dramatic lighting',
          'award winning',
          '8k resolution',
          'trending on artstation',
          'hyperrealistic',
          'stunning',
          'photorealistic',
          'intricate details'
        ];
        
        // Style terms to add
        const styleTerms = [
          'vivid colors',
          'professional lighting',
          'masterpiece',
          'beautiful composition'
        ];
        
        // Select random terms
        const randomEnhancements = [];
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * enhancementTerms.length);
          randomEnhancements.push(enhancementTerms[randomIndex]);
          enhancementTerms.splice(randomIndex, 1);
        }
        
        const randomStyleIndex = Math.floor(Math.random() * styleTerms.length);
        const randomStyle = styleTerms[randomStyleIndex];
        
        // Create optimized prompt
        optimizedPrompt = `${initialPrompt}, ${randomEnhancements.join(', ')}, ${randomStyle}`;
      }
      
      // Update UI
      const optimizedPromptText = document.getElementById('optimized-prompt-text');
      const optimizationResult = document.getElementById('optimization-result');
      
      if (optimizedPromptText && optimizationResult) {
        optimizedPromptText.textContent = optimizedPrompt;
        optimizationResult.classList.remove('hidden');
        optimizationResult.classList.add('fadeIn');
      }
      
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      alert(`Error: ${error.message}`);
    } finally {
      // Restore button state
      if (optimizeButton) {
        optimizeButton.disabled = false;
        optimizeButton.innerHTML = '<i class="fas fa-wand-magic-sparkles mr-2"></i> Optimize Prompt';
      }
    }
  }
  
  handleUseOptimizedPrompt() {
    // Get optimized prompt
    const optimizedPromptText = document.getElementById('optimized-prompt-text');
    const promptInput = document.getElementById('prompt');
    
    if (optimizedPromptText && promptInput) {
      // Set prompt value
      promptInput.value = optimizedPromptText.textContent;
      
      // Switch to generator tab
      const generatorTab = document.getElementById('generator-tab');
      if (generatorTab) {
        generatorTab.click();
      }
      
      // Focus prompt input
      promptInput.focus();
      promptInput.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  handleDownloadImage() {
    if (!this.currentImageData) return;
    
    try {
      // For base64 images from real API
      if (this.currentImageData.imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = this.currentImageData.imageUrl;
        link.download = `genai-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      } else {
        // For placeholder images in demo mode, open in new tab
        window.open(this.currentImageData.imageUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image. Please try again.');
    }
  }
  
  handleSaveToGallery() {
    if (!this.currentImageData) return;
    
    // Add to generated images array
    this.galleryImages.unshift(this.currentImageData);
    
    // Save to local storage
    localStorage.setItem('genai-gallery', JSON.stringify(this.galleryImages));
    
    // Update gallery
    this.updateGallery();
    
    // Show confirmation
    alert('Image saved to gallery!');
  }
  
  updateGallery() {
    const galleryContainer = document.getElementById('image-gallery');
    const gallerySection = document.getElementById('gallery-section');
    
    if (galleryContainer) {
      if (this.galleryImages.length === 0) {
        if (gallerySection) gallerySection.classList.add('hidden');
        return;
      }
      
      // Show gallery section
      if (gallerySection) gallerySection.classList.remove('hidden');
      
      // Clear gallery
      galleryContainer.innerHTML = '';
      
      // Add images to gallery
      this.galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
          <div class="gallery-image">
            <img src="${image.imageUrl}" alt="Generated image" loading="lazy">
          </div>
          <div class="gallery-details">
            <div class="gallery-prompt">${image.prompt}</div>
            <div class="gallery-actions">
              <button class="view-button" title="View Full Size">
                <i class="fas fa-eye"></i>
              </button>
              <button class="download-button" title="Download">
                <i class="fas fa-download"></i>
              </button>
              <button class="delete-button" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
        
        // Add event listeners
        const viewButton = galleryItem.querySelector('.view-button');
        const downloadButton = galleryItem.querySelector('.download-button');
        const deleteButton = galleryItem.querySelector('.delete-button');
        
        if (viewButton) {
          viewButton.addEventListener('click', () => {
            window.open(image.imageUrl, '_blank');
          });
        }
        
        if (downloadButton) {
          downloadButton.addEventListener('click', () => {
            if (image.imageUrl.startsWith('data:')) {
              const link = document.createElement('a');
              link.href = image.imageUrl;
              link.download = `genai-image-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              setTimeout(() => {
                document.body.removeChild(link);
              }, 100);
            } else {
              window.open(image.imageUrl, '_blank');
            }
          });
        }
        
        if (deleteButton) {
          deleteButton.addEventListener('click', () => {
            this.galleryImages.splice(index, 1);
            localStorage.setItem('genai-gallery', JSON.stringify(this.galleryImages));
            this.updateGallery();
          });
        }
        
        galleryContainer.appendChild(galleryItem);
      });
    }
  }

  // Populate model options in the dropdown
  populateModelOptions() {
    const modelSelect = document.getElementById('model');
    if (modelSelect) {
      modelSelect.innerHTML = '';
      
      // Create and select the flux-dev option first
      const fluxDevOption = document.createElement('option');
      fluxDevOption.value = "flux-dev";
      fluxDevOption.textContent = "FLUX.1-dev";
      fluxDevOption.selected = true;
      modelSelect.appendChild(fluxDevOption);
      
      // Add the rest of the models
      MODELS.forEach(model => {
        if (model.id !== "flux-dev") {  // Skip flux-dev since we already added it
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = model.name;
          modelSelect.appendChild(option);
        }
      });
      
      // Force select flux-dev
      modelSelect.value = "flux-dev";
      
      console.log("Model options populated with flux-dev as default");
    }
  }
  
  // Populate style options in the dropdown
  populateStyleOptions() {
    const styleSelect = document.getElementById('style');
    if (styleSelect) {
      styleSelect.innerHTML = '';
      STYLE_PRESETS.forEach(style => {
        const option = document.createElement('option');
        option.value = style;
        option.textContent = style;
        styleSelect.appendChild(option);
      });
      console.log("Style options populated");
    }
  }

  // Initialize app components
  initialize() {
    console.log("Initializing image generator...");
    
    // First setup DOM elements and event listeners
    this.setupDOM();
    this.setupTabs();
    this.addEventListeners();
    
    // Always populate with default values first
    this.populateModelOptions();
    this.populateStyleOptions();
    
    // Then try to fetch from API if enabled
    if (API_CONFIG.enabled) {
      console.log("API enabled, fetching models and styles...");
      Promise.all([
        fetchAvailableModels().catch(error => {
          console.error("Error during model fetch:", error);
        }),
        fetchAvailableStyles().catch(error => {
          console.error("Error during style fetch:", error);
        })
      ]).finally(() => {
        // If the dropdowns are empty for some reason, populate with defaults
        const modelSelect = document.getElementById('model');
        const styleSelect = document.getElementById('style');
        
        if (modelSelect && modelSelect.options.length <= 1) {
          console.log("Fallback: repopulating models with defaults");
          this.populateModelOptions();
        }
        
        if (styleSelect && styleSelect.options.length <= 1) {
          console.log("Fallback: repopulating styles with defaults");
          this.populateStyleOptions();
        }
      });
    } else {
      console.log("API not enabled, using predefined models and styles");
    }
    
    // Load gallery from local storage
    this.galleryImages = JSON.parse(localStorage.getItem('genai-gallery')) || [];
    this.updateGallery();
    
    console.log("Image generator initialized");
  }
}

// Remove the duplicate initialization listener and create a single instance
const initializeApp = () => {
  console.log("Top-level initialization function called");
  if (!window.imageGenerator) {
    console.log("Creating new ImageGenerator instance");
    window.imageGenerator = new ImageGenerator();
  }
};

// Initialize the application when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  console.log("Document already loaded at script execution time");
  initializeApp();
} 