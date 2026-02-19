// Vocabulary Data - Complete GenAI Terms
const vocabularyData = [
    // Core AI Concepts
    {
        id: 1,
        term: "Artificial Intelligence (AI)",
        category: "core",
        icon: "🤖",
        definition: "The broad science of creating computer systems that can perform tasks normally requiring human intelligence, such as visual perception, reasoning, and decision-making.",
        purpose: "It's the overarching field that encompasses all other concepts. The ultimate goal is to build machines that can think, learn, and solve problems like humans.",
        analogy: "AI is like the entire field of 'Transportation.' It's a huge category that includes many different types.",
        example: "A GPS navigation app that calculates the best route in real-time is a form of AI."
    },
    {
        id: 2,
        term: "Machine Learning (ML)",
        category: "core",
        icon: "🔬",
        definition: "A subfield of AI where algorithms are 'trained' on data to find patterns and make predictions without being explicitly programmed for that specific task.",
        purpose: "This is the engine that powers most modern AI. It allows systems to learn and adapt from experience, making them incredibly flexible and powerful.",
        analogy: "ML is like a specific type of transportation, such as a 'Car.' It's one way to achieve the goal of AI.",
        example: "An email spam filter that learns to identify junk mail based on the emails you mark as spam."
    },
    {
        id: 3,
        term: "Deep Learning",
        category: "core",
        icon: "🧠",
        definition: "A subfield of Machine Learning that uses multi-layered 'deep' Neural Networks to learn from vast amounts of data. It excels at finding complex, subtle patterns.",
        purpose: "This is the cutting-edge technique behind the most advanced AI today, including LLMs, self-driving cars, and realistic image generators.",
        analogy: "Deep Learning is like a specific type of car, such as a 'High-Performance Electric Car.' It's a very advanced and powerful form of ML.",
        example: "The technology that allows your phone to recognize your face to unlock (Face ID) is powered by deep learning."
    },
    {
        id: 4,
        term: "Generative vs. Discriminative AI",
        category: "core",
        icon: "⚖️",
        definition: "Generative AI creates new, original content (text, images, music). Discriminative AI classifies or 'discriminates' between different types of existing data.",
        purpose: "This is a fundamental split in what AI models do. One creates, the other categorizes. Understanding this helps you know if you need to build a content creator or a data sorter.",
        analogy: "A generative model is like an artist who paints a new portrait. A discriminative model is like an art critic who determines if a painting is a real Picasso or a fake.",
        example: "ChatGPT (Generative) writes a new poem. A spam filter (Discriminative) classifies an email as 'spam' or 'not spam.'"
    },
    {
        id: 5,
        term: "Neural Networks",
        category: "core",
        icon: "🕸️",
        definition: "A computing system inspired by the human brain, consisting of interconnected nodes ('neurons') arranged in layers. Data is processed through these layers to recognize patterns.",
        purpose: "They are the foundational architecture for Deep Learning. Their layered structure allows them to learn very complex relationships in data, from identifying cats in photos to understanding grammar.",
        analogy: "A neural network is like a team of specialists. The first person looks for simple clues, passes their findings to the next, who looks for more complex patterns, and so on, until the final person makes a decision.",
        example: "When you speak to a voice assistant, a neural network processes the sound waves, identifies phonemes, forms words, and understands your command."
    },

    // LLM Core Concepts
    {
        id: 6,
        term: "Large Language Model (LLM)",
        category: "llm-concepts",
        icon: "📚",
        definition: "A type of neural network trained to predict the next token in an input sequence. A deep learning model, often with billions of parameters, that has been trained on vast amounts of text data to understand and generate human-like language.",
        purpose: "To generate human-like text, answer questions, and perform various language tasks. LLMs are the technology behind modern chatbots and AI assistants.",
        analogy: "An LLM is like an incredibly well-read librarian who has read nearly every book ever written and can use that knowledge to answer questions, write essays, and summarize documents.",
        example: "If you input 'The quick brown fox jumps', an LLM might predict 'over' as the next word. OpenAI's GPT-4, Google's Gemini, and Meta's Llama are all famous LLMs."
    },
    {
        id: 7,
        term: "Tokenization",
        category: "llm-concepts",
        icon: "✂️",
        definition: "The process of breaking down raw text into smaller units called 'tokens.' These tokens can be words, subwords, or even characters, chosen to represent meaningful units in a language.",
        purpose: "To convert human-readable text into a format that machine learning models can process. This is the essential first step for any LLM. Computers can't understand raw text; they need it converted into these discrete, manageable numerical units.",
        analogy: "Chopping vegetables before making a stew. You have to break down the ingredients into bite-sized pieces before you can cook with them.",
        example: "The phrase 'unbelievable' might be tokenized into 'un', 'believe', 'able' to capture its morphological structure. The phrase 'AI is powerful' might be tokenized into ['AI', 'is', 'power', 'ful']."
    },
    {
        id: 8,
        term: "Vectors (Embeddings)",
        category: "llm-concepts",
        icon: "📐",
        definition: "Numerical representations (coordinates in an N-dimensional space) that encapsulate the semantic meaning of tokens. Words with similar meanings are placed close to each other in this space.",
        purpose: "To allow LLMs to understand the inherent meaning of words and their relationships, enabling effective sentence construction. Vectors allow the model to understand the meaning and relationships between words mathematically.",
        analogy: "A map where every word is a city. Cities with similar characteristics (e.g., big capitals like Paris and London) are located close together, while different ones (Paris and a small village) are far apart.",
        example: "In a vector space, the word 'car' would be closer to 'automobile' and 'vehicle' than to 'tree.' In vector math, the relationship vector('King') - vector('Man') + vector('Woman') results in a vector very close to vector('Queen')."
    },
    {
        id: 9,
        term: "Attention Mechanism",
        category: "llm-concepts",
        icon: "👁️",
        definition: "A mechanism that allows an LLM to weigh the importance of different words in an input sequence to understand the context of ambiguous terms. It helps to clarify meaning by looking at nearby words.",
        purpose: "To derive contextual meaning from words, especially those with multiple possible interpretations. This was a revolutionary breakthrough that allows models to handle long, complex sentences and understand how words relate to each other.",
        analogy: "When you read a sentence, you subconsciously focus more on the key words (nouns, verbs) to understand the meaning. Attention lets the model do the same thing.",
        example: "If you say 'The bank is eroding,' attention would help the LLM understand 'bank' refers to a riverbank, not a financial institution, by considering 'eroding.' In 'The car, which was red, went through the green light,' the attention mechanism helps the model link 'car' and 'went,' ignoring the less critical words in between."
    },
    {
        id: 10,
        term: "Transformer",
        category: "llm-concepts",
        icon: "⚡",
        definition: "A specific neural network architecture that relies heavily on the attention mechanism. It has become the standard design for most high-performing LLMs.",
        purpose: "To efficiently process sequential data and capture long-range dependencies, leading to high-quality text generation. This architecture is highly efficient at processing sequential data like text.",
        analogy: "A transformer is like a state-of-the-art engine design for a car (the LLM). While other engines exist, this one has proven to be the most powerful and efficient for the job.",
        example: "While an LLM is the 'car,' the transformer is often considered its 'engine,' a powerful component enabling its functionality. The 'T' in GPT (Generative Pre-trained Transformer) stands for Transformer."
    },

    // Training Concepts
    {
        id: 11,
        term: "Self-Supervised Learning",
        category: "training",
        icon: "🎯",
        definition: "A training paradigm where the model generates its own labels or tasks from the input data itself, without explicit human annotation. Parts of the input data are used to create their own labels.",
        purpose: "To allow models to learn from vast amounts of unlabeled data, making training highly scalable and cost-effective. This is a highly scalable training method that gets the benefits of supervised learning without needing expensive human labeling.",
        analogy: "Reading a sentence with a word blacked out and trying to guess the missing word based on the context.",
        example: "If you show an image of a cat and mask a portion of it, the model is trained to predict the missing pixels, thus learning the inherent structure of cats. An LLM is trained on billions of sentences from the internet by being tasked to predict the next word in each sentence."
    },
    {
        id: 12,
        term: "Supervised Learning",
        category: "training",
        icon: "👨‍🏫",
        definition: "A type of ML where the model learns from data that has been manually labeled with the correct answers.",
        purpose: "This is the most common form of machine learning. It's highly effective for tasks where you have a clear outcome you want to predict, like classification or regression.",
        analogy: "Learning with flashcards. Each card has a question (the data) and the correct answer on the back (the label).",
        example: "Training an AI on 10,000 images of animals, where each image is labeled 'cat,' 'dog,' 'bird,' etc., to build an animal classifier."
    },
    {
        id: 13,
        term: "Unsupervised Learning",
        category: "training",
        icon: "🔍",
        definition: "A type of ML where the model learns from unlabeled data, trying to find hidden structures, patterns, or groupings on its own.",
        purpose: "This is powerful for exploring data and discovering insights you didn't know existed. It's used for tasks like customer segmentation and anomaly detection.",
        analogy: "Being given a box of assorted Lego bricks and sorting them into piles based on color and shape without any instructions.",
        example: "A streaming service using your viewing history to group you with other users who have similar tastes to recommend new shows."
    },
    {
        id: 14,
        term: "Reinforcement Learning (RL)",
        category: "training",
        icon: "🎮",
        definition: "A machine learning paradigm where an agent learns to make decisions by performing actions in an environment to maximize a cumulative reward.",
        purpose: "To train models to behave in a particular, desirable way by rewarding good outcomes and penalizing undesirable ones. This is ideal for teaching AI to master tasks with clear goals and rules.",
        analogy: "Training a dog. You give it a treat (reward) when it sits on command and a firm 'no' (penalty) when it doesn't.",
        example: "An RL agent learning to play chess would be rewarded for winning games and penalized for losing, gradually improving its strategic decisions. Google's AlphaGo AI learned to master the game of Go by playing millions of games against itself."
    },
    {
        id: 15,
        term: "Reinforcement Learning with Human Feedback (RLHF)",
        category: "training",
        icon: "👥",
        definition: "A variation of RL where human preferences are used to provide the reward signal, guiding the model to generate responses that are preferred by humans.",
        purpose: "To align LLM behavior with human values and preferences, making their outputs more helpful, harmless, and honest.",
        analogy: "Getting feedback from taste-testers when perfecting a recipe, then adjusting the ingredients based on their preferences.",
        example: "When an LLM generates two different explanations for a concept, humans rate which explanation is better, and the model learns to prioritize generating responses similar to the highly-rated one."
    },

    // Enhancement Techniques
    {
        id: 16,
        term: "Fine-Tuning",
        category: "enhancement",
        icon: "🎨",
        definition: "The process of taking a pre-trained base LLM and further training it on a smaller, domain-specific dataset (e.g., medical, financial) to specialize its responses.",
        purpose: "To tailor a general-purpose LLM to perform specific tasks or generate responses in a particular style or jargon. This is far more efficient than training a model from scratch.",
        analogy: "Hiring a brilliant, highly-educated generalist (the pre-trained model) and then giving them a short, intensive training course to become a specialist in your company's field (fine-tuning).",
        example: "A base LLM can be fine-tuned on legal documents to become an expert legal assistant, using appropriate terminology and focusing on legal precedents. Taking a general LLM like Llama and fine-tuning it on thousands of medical research papers to create a medical chatbot."
    },
    {
        id: 17,
        term: "Few-Shot Prompting",
        category: "enhancement",
        icon: "💡",
        definition: "Providing a few examples of desired input-output pairs within the prompt itself to guide the LLM's response during inference time.",
        purpose: "To improve the quality and relevance of an LLM's output without retraining the model.",
        analogy: "Showing someone a few examples of how you want a task done before asking them to do it themselves.",
        example: "When asking an LLM to classify sentiments, you might provide 'Happy: Positive, Sad: Negative, Excited: Positive' before giving the text to classify."
    },
    {
        id: 18,
        term: "Retrieval Augmented Generation (RAG)",
        category: "enhancement",
        icon: "🔗",
        definition: "Augmenting an LLM's input with relevant information retrieved from external databases or documents in real-time. A technique that enhances an LLM's response by first retrieving relevant information from an external knowledge base.",
        purpose: "To provide the LLM with specific, up-to-date, or proprietary context, leading to more accurate and informed responses, especially for factual queries or company-specific policies. RAG allows LLMs to answer questions using information that wasn't in their original training data.",
        analogy: "An 'open-book' exam. Instead of just relying on what it has memorized, the LLM can look up the correct information in a textbook (the knowledge base) before answering the question.",
        example: "When a user asks a customer service bot a question about a product, the RAG system might fetch the product manual and warranty information from a database to provide a precise answer. A customer service bot uses RAG to fetch a user's specific order history before answering 'Where is my package?'"
    },
    {
        id: 19,
        term: "Vector Database",
        category: "enhancement",
        icon: "🗄️",
        definition: "A database optimized for storing and querying high-dimensional vectors. It efficiently finds documents or data points whose vectors are 'closest' (most semantically similar) to a given query vector.",
        purpose: "To enable fast and relevant context retrieval for RAG systems. These databases are the backbone of RAG systems and other applications that rely on similarity search.",
        analogy: "A massive library where books are organized not alphabetically, but by topic and meaning. When you ask for a book on 'brave knights,' the librarian can instantly find all books about heroes, chivalry, and castles.",
        example: "If a user queries 'My laptop screen is flickering,' a vector database could quickly find support documents related to 'display issues' or 'graphics driver problems' even if the word 'flickering' isn't explicitly in the documents. Pinecone, Milvus, and Chroma are popular vector databases."
    },
    {
        id: 20,
        term: "Model Context Protocol (MCP)",
        category: "enhancement",
        icon: "🔌",
        definition: "A protocol or standardized way for an LLM to interact with and retrieve real-time information from external tools, APIs, or databases, and even perform actions.",
        purpose: "To extend the capabilities of LLMs beyond their pre-trained knowledge, allowing them to access current data and execute tasks. MCP turns an LLM from a simple knowledge base into an action-taker.",
        analogy: "Giving a brilliant but isolated librarian (the LLM) a phone and a list of approved contacts (the MCP). Now they can call the airline to check flight times or a weather service for a forecast, instead of just relying on the old books in their library.",
        example: "An MCP client could allow an LLM to check current train schedules from multiple railway providers and then book a ticket based on user preferences. You ask an AI assistant, 'What's the cheapest flight to Denver next Tuesday?' The assistant uses MCP to connect to airline APIs in real-time."
    },
    {
        id: 21,
        term: "Context Engineering",
        category: "enhancement",
        icon: "🛠️",
        definition: "A comprehensive approach that combines techniques like few-shot prompting, RAG, and MCP to build dynamic and personalized contexts for LLMs. It involves managing user preferences and summarization of past interactions.",
        purpose: "To create highly relevant and evolving interactions with LLMs, moving beyond stateless prompt engineering to a more adaptive system.",
        analogy: "It's like a lawyer preparing a star witness before a trial. The lawyer doesn't just ask the witness a question cold; they provide them with all the relevant case files, exhibits, and background information (the context) so the witness can give the most informed and effective testimony.",
        example: "A personalized AI assistant that remembers your dietary preferences (user preferences) and summarizes your past meal planning discussions (prompt summarization) to suggest new recipes. A financial advisor AI pulls your real-time stock portfolio, risk tolerance, and recent market news into the context."
    },
    {
        id: 22,
        term: "Context Window",
        category: "llm-concepts",
        icon: "🪟",
        definition: "The maximum number of tokens a language model can process at one time. This limit includes both the input prompt from the user and the model's generated output.",
        purpose: "It defines the model's short-term memory. A larger context window allows for longer, more coherent conversations and the ability to process large documents.",
        analogy: "It's like a whiteboard with a fixed size. You can write down information to work on a problem, but if you need to add new information, you must erase something old.",
        example: "If a model has a 4096-token window and you're discussing a 4000-token document, the very beginning of the document will get 'erased' from the model's memory as you continue the conversation."
    },
    {
        id: 23,
        term: "Prompt Summarization",
        category: "enhancement",
        icon: "📝",
        definition: "The technique of condensing long chat histories or documents into shorter summaries to fit within the LLM's context window.",
        purpose: "To maintain conversation context over extended interactions without exceeding token limits or incurring excessive computational costs.",
        analogy: "Creating an executive summary of a long report so busy executives can grasp the key points quickly.",
        example: "Instead of sending an entire week's worth of project emails, a system summarizes the key decisions and action items for the LLM to understand the project's current status."
    },

    // Advanced Concepts
    {
        id: 24,
        term: "Agents",
        category: "advanced",
        icon: "🤖",
        definition: "Long-running processes that utilize LLMs, external systems, and other agents to achieve complex user goals autonomously, often involving multiple steps and decision-making. AI systems that can operate autonomously to achieve specific goals on behalf of users.",
        purpose: "To enable LLMs to perform multi-step tasks, manage complex workflows, and make decisions based on user requirements. Agents represent a move from passive tools to active assistants.",
        analogy: "A personal assistant. You don't tell them every single keystroke; you give them a goal like 'Book me a flight to Miami for next Tuesday,' and they figure out the steps to get it done.",
        example: "A personal assistant agent that, upon receiving a request to 'plan my weekend getaway,' could book flights, reserve a hotel, and even suggest local activities based on your stored preferences. An AI agent tasked with 'researching the best laptops of 2025' might browse review sites, compile a spreadsheet, and present a summary report."
    },
    {
        id: 25,
        term: "Agentic AI",
        category: "advanced",
        icon: "🎭",
        definition: "Advanced autonomous AI systems that can chain together multiple steps, interact with software or services, make decisions, and adapt their approach based on outcomes.",
        purpose: "Agentic AI can complete complex tasks much like a personal assistant, moving beyond simple Q&A to active problem-solving.",
        analogy: "Like having an intelligent robot butler who can handle complicated tasks independently.",
        example: "An agentic AI system booking a multi-city vacation by comparing prices, checking availability, and making reservations across multiple platforms."
    },
    {
        id: 26,
        term: "Chain of Thought (CoT)",
        category: "advanced",
        icon: "💭",
        definition: "A prompting technique that encourages LLMs to explain their reasoning process step-by-step, mimicking human thought.",
        purpose: "To improve the model's ability to tackle complex problems by breaking them down into manageable steps, leading to more accurate and robust answers.",
        analogy: "Showing your work on a math test. By writing out each step, you are more likely to arrive at the correct final answer.",
        example: "When asked to solve a multi-step math problem, the LLM would first outline the formula, then show the intermediate calculations, and finally provide the answer. For 'If I have 5 apples and eat 2, then buy 3 more, how many do I have?', a CoT prompt encourages: 5-2=3, then 3+3=6."
    },
    {
        id: 27,
        term: "Reasoning Model",
        category: "advanced",
        icon: "🧩",
        definition: "An LLM specifically designed or trained to perform logical deductions and inferences, often employing techniques like Chain of Thought, Tree of Thought, or Graph of Thought.",
        purpose: "To enable models to 'think' through problems, apply logical steps, and arrive at well-reasoned solutions.",
        analogy: "A detective piecing together clues to solve a mystery, explaining each logical step.",
        example: "A reasoning model could analyze a series of medical symptoms and lab results to deduce a probable diagnosis, explaining each step of its diagnostic process."
    },
    {
        id: 28,
        term: "Multimodal Models",
        category: "advanced",
        icon: "🎨",
        definition: "AI models that can process and generate information across multiple modalities, such as text, images, and video.",
        purpose: "To achieve a deeper and more comprehensive understanding of information by integrating different forms of data, leading to richer interactions and applications. The future of AI is multimodal.",
        analogy: "A human who can read a book (text), look at its illustrations (image), and listen to the audiobook (audio) to get a complete understanding of the story.",
        example: "A multimodal model could analyze a video of a cooking show, identifying ingredients (image), transcribing instructions (text), and understanding cooking techniques (video), then generate a new recipe based on that. Google's Gemini can analyze a user-submitted image of ingredients and generate a text-based recipe."
    },
    {
        id: 29,
        term: "Inference",
        category: "llm-concepts",
        icon: "⚙️",
        definition: "The process of using a trained machine learning model to make a prediction or generate an output based on new, unseen data. It is the 'live' or 'production' phase after the model has finished training.",
        purpose: "This is the phase where the AI model performs its useful task for an end-user. All the training is done so that the model can perform inference quickly and accurately.",
        analogy: "Inference is 'exam day' or 'performance night' for the model. The model has spent months 'studying' or 'rehearsing' (training), and inference is when it uses that knowledge to answer new questions.",
        example: "When you type a search query into Google and it auto-completes your sentence, the model is performing inference to predict what you're going to type next."
    },

    // Architecture & Optimization
    {
        id: 30,
        term: "Small Language Models (SLM)",
        category: "architecture",
        icon: "📱",
        definition: "Language models with fewer parameters (millions instead of billions) that are often trained or fine-tuned for specific, narrow tasks.",
        purpose: "SLMs are much cheaper and faster to run than LLMs. They are ideal for on-device applications (like on your phone) or for businesses that need a specialized model without the massive cost of an LLM.",
        analogy: "A pocket calculator versus a supercomputer. The calculator can't do everything, but it's incredibly fast, efficient, and perfect for its specific job (arithmetic).",
        example: "A company creating a small model that only does one thing: categorizing customer support tickets into 'Urgent,' 'Billing,' or 'Technical.' LLMs with fewer parameters, often trained on smaller, more focused datasets."
    },
    {
        id: 31,
        term: "Distillation",
        category: "architecture",
        icon: "🧪",
        definition: "A technique where a smaller 'student' model is trained to mimic the behavior and outputs of a larger, more complex 'teacher' model.",
        purpose: "To create a smaller, faster, and more efficient model (SLM) that retains much of the performance of a larger model, reducing inference costs. This 'distills' the essential knowledge from a massive model into a smaller, more efficient one.",
        analogy: "A master chef (teacher model) writing a simplified cookbook for home cooks (student model). The recipes are less complex but capture the essence of the master's techniques.",
        example: "After a powerful AI model is fully trained for facial recognition, its weights are quantized to make it run efficiently on a smartphone camera. Using GPT-4 (teacher) to generate hundreds of thousands of example outputs to train a much smaller model (student) for a specific task."
    },
    {
        id: 32,
        term: "Quantization",
        category: "architecture",
        icon: "📊",
        definition: "The process of reducing the precision of the numbers (parameters) used in a model, for example, converting 32-bit numbers to 8-bit numbers.",
        purpose: "Primarily to reduce the memory footprint and computational cost of running models during inference, making them faster and more deployable on resource-constrained devices.",
        analogy: "Compressing a high-resolution photo into a smaller JPEG file. The file size is much smaller and it looks almost identical, even though some of the original data has been lost.",
        example: "Taking a 20 GB model and quantizing it so it becomes a 5 GB model that can run efficiently on a laptop's CPU."
    },
    {
        id: 33,
        term: "Parameters & Hyperparameters",
        category: "architecture",
        icon: "🎛️",
        definition: "Parameters are internal variables the model learns on its own during training (e.g., the weights between neurons). Hyperparameters are external settings configured by the developer before training (e.g., the learning speed).",
        purpose: "This distinction is crucial for building and improving models. The model adjusts its own parameters, but a developer must expertly tune the hyperparameters to get the best performance.",
        analogy: "When baking a cake, the parameters are how the batter changes inside the oven (something you can't directly control). The hyperparameters are the oven temperature and baking time (settings you choose beforehand).",
        example: "The millions of internal connection strengths in an LLM are parameters. The developer's choice to train the model for 100 cycles is a hyperparameter."
    },
    {
        id: 34,
        term: "Overfitting & Underfitting",
        category: "training",
        icon: "📈",
        definition: "Overfitting: When a model learns the training data too well, including its noise and quirks, and fails to perform on new, unseen data. Underfitting: When a model is too simple to capture the underlying patterns in the data.",
        purpose: "These are the two primary failure modes in model training. An effective model must generalize well to new data, avoiding both memorizing the old (overfitting) and being too simplistic (underfitting).",
        analogy: "Overfitting is a student who memorizes the exact questions and answers for a practice test but can't solve any new problems. Underfitting is a student who didn't study at all and can't answer any questions, old or new.",
        example: "An overfit house price model predicts your neighbor's house price perfectly but is wildly wrong for a house in the next town. An underfit model just predicts every house is the average price."
    },

    // Additional Core & Applied Concepts
    {
        id: 35,
        term: "Natural Language Processing (NLP)",
        category: "core",
        icon: "💬",
        definition: "The broad field of AI focused on enabling computers to understand, interpret, and generate human language.",
        purpose: "NLP is the science behind chatbots, translation apps, sentiment analysis, and more. LLMs are a powerful technique within the broader field of NLP.",
        analogy: "NLP is like the entire academic field of 'Linguistics' for computers.",
        example: "Google Translate, which can translate text between hundreds of languages, is a classic NLP application."
    },
    {
        id: 36,
        term: "Computer Vision",
        category: "core",
        icon: "👁️‍🗨️",
        definition: "The field of AI that trains computers to interpret and understand information from the visual world, like images and videos.",
        purpose: "This technology powers everything from self-driving cars and medical imaging analysis to photo tagging on social media. It gives machines a sense of sight.",
        analogy: "Computer Vision is like teaching a computer the biological process of 'Sight and Visual Cortex Processing.'",
        example: "The checkout system at a grocery store that can automatically identify the fruits and vegetables you place on the scale."
    },
    {
        id: 37,
        term: "AI Ethics & Governance",
        category: "advanced",
        icon: "⚖️",
        definition: "The framework of principles and practices for developing AI responsibly, addressing issues like fairness, transparency, accountability, and bias.",
        purpose: "As AI becomes more powerful and integrated into society, ensuring it is used safely and for good is one of the most critical challenges. It's about building trust in AI systems.",
        analogy: "The traffic laws and safety regulations for cars. The rules exist to ensure a powerful technology is used in a way that minimizes harm and benefits society.",
        example: "Auditing a hiring AI to ensure it doesn't unfairly penalize candidates from certain backgrounds due to biases in its training data."
    },
    {
        id: 38,
        term: "API (Application Programming Interface)",
        category: "core",
        icon: "🔌",
        definition: "A set of rules and protocols that allows one software application to communicate with and use the services of another.",
        purpose: "Most people and applications access powerful AI models (like GPT-4) through an API. It's the 'front door' that lets developers integrate AI capabilities into their own products without hosting the massive model themselves.",
        analogy: "A restaurant menu. You (the developer) don't need to know how to cook the food (run the model). You just look at the menu (API documentation), place an order (make an API call), and the kitchen (AI service) sends back your food (the model's response).",
        example: "A travel website uses the Google Maps API to show maps on its site. An AI writing app uses the OpenAI API to generate text."
    },

    // More Specialized Terms
    {
        id: 39,
        term: "Prompt Engineering",
        category: "enhancement",
        icon: "✍️",
        definition: "The practice of crafting effective prompts (inputs) to guide AI models toward desired outputs. It involves understanding how to structure questions, provide context, and use specific techniques.",
        purpose: "Getting better results from AI models by learning how to communicate effectively with them.",
        analogy: "Learning to ask questions in a way that gets you the best answer from an expert.",
        example: "Instead of asking 'Tell me about dogs,' a better prompt would be 'Provide a 200-word overview of Golden Retrievers, focusing on temperament and care requirements.'"
    },
    {
        id: 40,
        term: "Zero-Shot Learning",
        category: "enhancement",
        icon: "🎯",
        definition: "The ability of a model to perform a task it wasn't explicitly trained for, without any examples, just from the prompt description.",
        purpose: "Demonstrates the generalization capabilities of LLMs and their ability to understand new tasks.",
        analogy: "Being asked to do something you've never done before but figuring it out based on your general knowledge.",
        example: "Asking an LLM to 'Translate this English sentence to French' without providing any translation examples."
    },
    {
        id: 41,
        term: "Temperature",
        category: "llm-concepts",
        icon: "🌡️",
        definition: "A parameter that controls the randomness of an AI model's outputs. Higher temperature means more creative/random, lower means more deterministic/focused.",
        purpose: "Allows users to control the creativity vs. consistency trade-off in generated content.",
        analogy: "Like adjusting the heat on a stove - higher heat makes things more unpredictable and varied.",
        example: "Temperature 0.2 for factual Q&A, temperature 0.8 for creative writing."
    },
    {
        id: 42,
        term: "Hallucination",
        category: "llm-concepts",
        icon: "🌫️",
        definition: "When an AI model generates information that is false, fabricated, or not grounded in its training data, but presents it confidently as fact.",
        purpose: "Understanding this limitation is critical for responsible AI use, especially in high-stakes applications.",
        analogy: "Like someone confidently telling you a story they think is true but actually made up.",
        example: "An LLM citing a research paper that doesn't exist or providing incorrect historical dates."
    },
    {
        id: 43,
        term: "Emergent Abilities",
        category: "advanced",
        icon: "✨",
        definition: "Capabilities that appear in large AI models that weren't explicitly programmed or present in smaller versions.",
        purpose: "Demonstrates how scaling models can lead to unexpected and powerful new capabilities.",
        analogy: "Like how water molecules suddenly gain new properties (liquidity) when they come together in large numbers.",
        example: "LLMs suddenly being able to do arithmetic or translate languages without specific training for those tasks."
    },
    {
        id: 44,
        term: "Bias in AI",
        category: "training",
        icon: "⚠️",
        definition: "Systematic and unfair preferences or prejudices in AI model outputs, often reflecting biases present in training data.",
        purpose: "Critical to identify and mitigate to ensure fair and equitable AI systems.",
        analogy: "Like a scale that's slightly tilted - it gives inaccurate measurements favoring one side.",
        example: "A hiring AI that favors certain demographics due to biased historical hiring data in its training set."
    },
    {
        id: 45,
        term: "Transfer Learning",
        category: "training",
        icon: "🔄",
        definition: "Using knowledge gained from training on one task to improve performance on a different but related task.",
        purpose: "Enables efficient model development by leveraging existing learned features rather than starting from scratch.",
        analogy: "Like how learning to play guitar helps you learn bass guitar faster.",
        example: "A model trained on general images can be adapted to identify specific medical conditions in X-rays."
    },
    {
        id: 46,
        term: "Epoch",
        category: "training",
        icon: "🔁",
        definition: "One complete pass through the entire training dataset during model training.",
        purpose: "Training typically involves multiple epochs to allow the model to learn patterns effectively.",
        analogy: "Reading a textbook from cover to cover once - you might need to read it multiple times to fully understand.",
        example: "Training a model for 10 epochs means it sees every training example 10 times."
    },
    {
        id: 47,
        term: "Gradient Descent",
        category: "training",
        icon: "⛰️",
        definition: "An optimization algorithm that adjusts model parameters iteratively to minimize error by following the gradient (slope) of the loss function.",
        purpose: "The fundamental method by which neural networks learn and improve.",
        analogy: "Like walking down a foggy mountain by always stepping in the direction that goes most steeply downward.",
        example: "The algorithm that adjusts billions of weights in an LLM to make better predictions."
    },
    {
        id: 48,
        term: "Loss Function",
        category: "training",
        icon: "📉",
        definition: "A mathematical function that measures how far off a model's predictions are from the actual correct answers.",
        purpose: "Provides the feedback signal that guides the training process.",
        analogy: "Like a scorecard that tells you how many points you lost in a game.",
        example: "Calculating the difference between predicted house prices and actual sale prices."
    },
    {
        id: 49,
        term: "Batch Size",
        category: "training",
        icon: "📦",
        definition: "The number of training examples processed together before updating model parameters.",
        purpose: "Balances training speed, memory usage, and model performance.",
        analogy: "Like grading homework - you could grade each paper individually or grade them in stacks of 32.",
        example: "A batch size of 64 means the model looks at 64 examples before updating its weights."
    },
    {
        id: 50,
        term: "Learning Rate",
        category: "training",
        icon: "🎚️",
        definition: "A hyperparameter that controls how much to adjust model parameters during each training step.",
        purpose: "Critical for successful training - too high and training becomes unstable, too low and training is very slow.",
        analogy: "Like deciding how big of steps to take when walking - too big and you might fall, too small and you'll never reach your destination.",
        example: "A learning rate of 0.001 means parameters are adjusted by 0.1% of the calculated gradient."
    },
    {
        id: 51,
        term: "Activation Function",
        category: "architecture",
        icon: "⚡",
        definition: "A mathematical function applied to neuron outputs that introduces non-linearity, enabling neural networks to learn complex patterns.",
        purpose: "Without activation functions, neural networks would only be able to learn linear relationships.",
        analogy: "Like the on/off switch and dimmer combined - it decides how much signal to pass through.",
        example: "ReLU (Rectified Linear Unit), sigmoid, and tanh are common activation functions."
    },
    {
        id: 52,
        term: "Backpropagation",
        category: "training",
        icon: "↩️",
        definition: "The algorithm used to calculate gradients for each parameter in a neural network by working backwards from the output error.",
        purpose: "Enables efficient training of deep neural networks by determining how to adjust each parameter.",
        analogy: "Like retracing your steps to figure out where you went wrong on a road trip.",
        example: "After seeing the error in output, backpropagation calculates how much each neuron contributed to that error."
    },
    {
        id: 53,
        term: "Dropout",
        category: "training",
        icon: "🎲",
        definition: "A regularization technique where random neurons are temporarily 'dropped out' (ignored) during training to prevent overfitting.",
        purpose: "Forces the network to learn more robust features that work even when some neurons are missing.",
        analogy: "Like practicing a team sport where random players sit out each practice - the team learns to work well regardless of who's playing.",
        example: "A dropout rate of 0.5 means each neuron has a 50% chance of being ignored during each training step."
    },
    {
        id: 54,
        term: "Regularization",
        category: "training",
        icon: "🛡️",
        definition: "Techniques used to prevent overfitting by adding constraints or penalties to the learning process.",
        purpose: "Helps models generalize better to new, unseen data rather than just memorizing training data.",
        analogy: "Like rules in a game that prevent players from exploiting loopholes.",
        example: "L1 and L2 regularization add penalties for large parameter values, encouraging simpler models."
    },
    {
        id: 55,
        term: "Convolutional Neural Network (CNN)",
        category: "architecture",
        icon: "🖼️",
        definition: "A specialized neural network architecture designed for processing grid-like data such as images, using convolutional layers.",
        purpose: "Highly effective for computer vision tasks like image classification, object detection, and facial recognition.",
        analogy: "Like having specialized cells in your eye that detect edges, colors, and shapes before combining them into full images.",
        example: "CNNs power facial recognition in smartphones and autonomous vehicle vision systems."
    },
    {
        id: 56,
        term: "Recurrent Neural Network (RNN)",
        category: "architecture",
        icon: "🔄",
        definition: "A neural network architecture designed to handle sequential data by maintaining an internal state (memory) that persists across time steps.",
        purpose: "Effective for tasks involving sequences like time series prediction, speech recognition, and language modeling (though largely superseded by Transformers).",
        analogy: "Like reading a book and remembering what happened in previous chapters to understand the current page.",
        example: "Early language models and speech recognition systems used RNNs before Transformers became dominant."
    },
    {
        id: 57,
        term: "Encoder-Decoder",
        category: "architecture",
        icon: "🔀",
        definition: "An architecture where one network (encoder) processes input into a compressed representation, and another (decoder) generates output from that representation.",
        purpose: "Effective for tasks where input and output have different structures, like translation or summarization.",
        analogy: "Like a interpreter who first listens and understands a speech in one language (encoder), then speaks it in another language (decoder).",
        example: "Machine translation systems that convert English to French use encoder-decoder architectures."
    },
    {
        id: 58,
        term: "Foundation Model",
        category: "core",
        icon: "🏛️",
        definition: "Large-scale models trained on vast amounts of diverse data that can be adapted to many downstream tasks through fine-tuning or prompting.",
        purpose: "Provides a versatile base that reduces the need to train specialized models from scratch for every new task.",
        analogy: "Like a universal tool that can be adapted for many different jobs with slight modifications.",
        example: "GPT-5.2, Claude Opus 4.6, and Gemini 3 Pro are foundation models that can be adapted for translation, summarization, classification, and more."
    }
];

// DOM Elements
const vocabGrid = document.getElementById('vocab-grid');
const searchInput = document.getElementById('vocab-search');
const clearSearchBtn = document.getElementById('clear-search');
const categoryBtns = document.querySelectorAll('.category-btn');
const resultsCount = document.getElementById('results-count');
const totalCount = document.getElementById('total-count');
const noResults = document.getElementById('no-results');
const modal = document.getElementById('term-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const refBtns = document.querySelectorAll('.ref-btn');

// State
let currentFilter = 'all';
let currentSearch = '';

// Category Icons Mapping
const categoryIcons = {
    'core': '🔬',
    'llm-concepts': '🧠',
    'training': '🎓',
    'enhancement': '🚀',
    'advanced': '🔮',
    'architecture': '🏗️'
};

// Initialize
function init() {
    totalCount.textContent = vocabularyData.length;
    renderVocabulary();
    attachEventListeners();
}

// Render Vocabulary Cards
function renderVocabulary() {
    const filteredData = vocabularyData.filter(term => {
        const matchesCategory = currentFilter === 'all' || term.category === currentFilter;
        const matchesSearch = term.term.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              term.definition.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    resultsCount.textContent = filteredData.length;

    if (filteredData.length === 0) {
        vocabGrid.style.display = 'none';
        noResults.classList.remove('hidden');
        return;
    }

    vocabGrid.style.display = 'grid';
    noResults.classList.add('hidden');

    vocabGrid.innerHTML = filteredData.map((term, index) => `
        <div class="vocab-card" data-category="${term.category}" data-id="${term.id}" style="animation-delay: ${index * 0.05}s">
            <div class="vocab-card-header">
                <div class="vocab-icon">${term.icon}</div>
                <div class="vocab-title-section">
                    <h3 class="vocab-title">${term.term}</h3>
                    <span class="vocab-category-tag">${getCategoryName(term.category)}</span>
                </div>
            </div>
            <p class="vocab-definition">${truncateText(term.definition, 120)}</p>
            <div class="vocab-card-footer">
                <span class="view-details-btn">
                    View Details <i class="fas fa-arrow-right"></i>
                </span>
            </div>
        </div>
    `).join('');

    // Attach click handlers to cards
    document.querySelectorAll('.vocab-card').forEach(card => {
        card.addEventListener('click', () => {
            const termId = parseInt(card.dataset.id);
            showTermDetails(termId);
        });
    });
}

// Get Category Display Name
function getCategoryName(category) {
    const names = {
        'core': 'Core AI',
        'llm-concepts': 'LLM Concepts',
        'training': 'Training',
        'enhancement': 'Enhancement',
        'advanced': 'Advanced',
        'architecture': 'Architecture'
    };
    return names[category] || category;
}

// Truncate Text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show Term Details in Modal
function showTermDetails(termId) {
    const term = vocabularyData.find(t => t.id === termId);
    if (!term) return;

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon-title">
                <div class="modal-icon">${term.icon}</div>
                <h2 class="modal-title">${term.term}</h2>
            </div>
            <span class="modal-category">${getCategoryName(term.category)}</span>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-book"></i> Definition
            </h3>
            <p class="modal-text">${term.definition}</p>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-bullseye"></i> Why It Matters
            </h3>
            <p class="modal-text">${term.purpose}</p>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-lightbulb"></i> Analogy
            </h3>
            <div class="analogy-box">
                <strong>Think of it this way:</strong>
                <p class="modal-text">${term.analogy}</p>
            </div>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-code"></i> Example
            </h3>
            <div class="example-box">
                <strong>Real-world example:</strong>
                <p class="modal-text">${term.example}</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Attach Event Listeners
function attachEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        if (currentSearch) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }
        renderVocabulary();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearSearchBtn.classList.add('hidden');
        renderVocabulary();
    });

    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderVocabulary();
            
            // Smooth scroll to vocabulary grid
            document.querySelector('.vocab-content').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Reference buttons
    refBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            currentFilter = category;
            
            // Update active category button
            categoryBtns.forEach(b => {
                if (b.dataset.category === category) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            renderVocabulary();
            
            // Smooth scroll to vocabulary grid
            document.querySelector('.vocab-content').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Smooth scroll for sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add scroll animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

