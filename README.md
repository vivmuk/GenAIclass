# GenAI Course Creator Platform

**Transform any job description into a comprehensive, personalized AI education course in minutes.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Powered by](https://img.shields.io/badge/powered%20by-Venice%20AI-purple)

## 🌟 Overview

GenAI Course Creator is a cutting-edge web application that leverages Venice AI's powerful model suite to automatically generate personalized, comprehensive AI education courses tailored to specific job roles and career paths. The platform transforms job descriptions into structured 10-chapter learning paths, complete with real-time industry insights and adult learning science principles.

### Key Features

- **🎯 Personalized Learning**: Custom AI curriculum based on specific job requirements
- **⚡ Fast Generation**: Complete 10-chapter courses in under 3 minutes
- **🔄 Real-time Relevance**: Integration of latest industry developments and trends
- **📚 Science-based Pedagogy**: Content structured using adult learning principles
- **📥 Multi-format Export**: Download courses as standalone HTML or PDF
- **🧠 Deep Role Analysis**: AI-driven insights on how GenAI will transform specific roles

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful, consistent icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Venice AI API** - Three powerful AI models:
  - **Venice Large (Qwen3-235B)** - Deep analysis and course planning
  - **GLM 4.6** - Comprehensive content generation
  - **Mistral Medium** - Web search and latest updates

### AI Models Architecture

```
Job Description Input
        ↓
[Venice Large - qwen3-235b]
   Role Analysis & Planning
   → 10-Chapter Outline
        ↓
[GLM 4.6 - zai-org-glm-4-6]
   Content Generation
   → Rich Chapter Content
        ↓
[Mistral Medium - mistral-31-24b]
   Web Research
   → Latest Industry Updates
        ↓
Complete Personalized Course
```

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Venice AI API key ([Get one here](https://venice.ai))

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AIPathway2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Venice AI Configuration
VENICE_API_KEY=your_api_key_here
VENICE_BASE_URL=https://api.venice.ai/api/v1

# Venice AI Models (these are defaults, can be customized)
VENICE_MODEL_REASONING=qwen3-235b
VENICE_MODEL_CONTENT=zai-org-glm-4-6
VENICE_MODEL_RESEARCH=mistral-31-24b

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Replace `your_api_key_here` with your actual Venice AI API key.

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🎮 Usage

### Creating a Course

1. **Navigate to the Home Page**: Click "Get Started" or "Create Your Course"

2. **Enter Job Description**:
   - Paste or type a job description
   - Include responsibilities, requirements, and key skills
   - Minimum 20 characters required

3. **Add Optional Details** (recommended):
   - Internal role/workflow description
   - Industry specification
   - Experience level (beginner/intermediate/advanced)

4. **Generate Course**: Click "Generate Course" and watch the magic happen!

5. **Track Progress**: Monitor the real-time generation progress:
   - Analyzing (0-20%)
   - Planning (20-30%)
   - Generating (30-80%)
   - Enriching (80-95%)
   - Finalizing (95-100%)

6. **Explore Your Course**:
   - Navigate through chapters
   - Complete exercises
   - Review latest industry updates
   - Export as HTML or PDF

### Export Options

#### HTML Export
- Standalone, self-contained file
- Includes all styling and functionality
- Works offline
- Interactive table of contents

#### PDF Export
- Professional layout and typography
- Print-optimized formatting
- Clickable table of contents
- Perfect for sharing and archiving

## 📚 API Documentation

### Create Course

**Endpoint**: `POST /api/courses`

**Request Body**:
```json
{
  "jobDescription": "string (required, min 20 chars)",
  "internalRole": "string (optional)",
  "industry": "string (optional)",
  "experienceLevel": "beginner|intermediate|advanced (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "courseId": "uuid",
  "message": "Course generation started"
}
```

### Get Course Status

**Endpoint**: `GET /api/courses/[id]/status`

**Response**:
```json
{
  "status": {
    "courseId": "uuid",
    "status": "analyzing|planning|generating|enriching|finalizing|completed|error",
    "progress": 0-100,
    "currentChapter": 1,
    "totalChapters": 10,
    "estimatedTimeRemaining": 120
  }
}
```

### Get Course

**Endpoint**: `GET /api/courses/[id]`

**Response**:
```json
{
  "course": {
    "id": "uuid",
    "metadata": {...},
    "analysis": {...},
    "chapters": [...]
  }
}
```

### Export Course

**Endpoint**: `POST /api/courses/[id]/export`

**Request Body**:
```json
{
  "format": "html|pdf"
}
```

**Response**: File download

## 🏗️ Project Structure

```
AIPathway2/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── courses/              # Course-related endpoints
│   ├── courses/                  # Course pages
│   │   └── [id]/                 # Dynamic course routes
│   │       ├── page.tsx          # Course viewer
│   │       └── progress/         # Progress tracking
│   ├── create/                   # Course creation page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components (future)
├── lib/                          # Core library code
│   ├── course-generator.ts       # Course generation pipeline
│   ├── export-service.ts         # HTML/PDF export
│   ├── venice-ai.ts              # Venice AI integration
│   └── venice-config.ts          # Venice AI configuration
├── types/                        # TypeScript type definitions
│   └── course.ts                 # Course-related types
├── public/                       # Static assets
├── .env.local                    # Environment variables (git-ignored)
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── README.md                     # This file
├── tailwind.config.js            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

## 🎨 Design Philosophy

The UI was designed with inspiration from world-class consulting firms and follows these principles:

- **Minimalist Elegance**: Clean, uncluttered interfaces
- **Thoughtful Motion**: Subtle animations that enhance UX
- **Visual Hierarchy**: Clear information architecture
- **Responsive Design**: Beautiful on all devices
- **Accessibility**: WCAG 2.1 compliant
- **Performance**: Optimized for speed and efficiency

## 🧪 Development

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

### Linting

```bash
npm run lint
```

## 🔒 Security

- **API Key Protection**: Environment variables are never exposed to the client
- **Input Validation**: All user inputs are validated and sanitized
- **XSS Prevention**: HTML content is properly escaped
- **Rate Limiting**: Implement rate limiting in production (recommended)

## 📊 Cost Estimation

Based on Venice AI pricing (per 1M tokens):

- **Venice Large (qwen3-235b)**: $0.90 input / $4.50 output
- **GLM 4.6 (zai-org-glm-4-6)**: $0.85 input / $2.75 output
- **Mistral Medium (mistral-31-24b)**: $0.50 input / $2.00 output

**Estimated cost per course**: ~$0.96

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## 🔮 Future Enhancements

- [ ] User authentication and course library
- [ ] Team/enterprise features
- [ ] Custom branding options
- [ ] Multi-language support
- [ ] Video content integration
- [ ] AI tutor chat interface
- [ ] Progress tracking and analytics
- [ ] Certification system
- [ ] API for third-party integrations

## 🐛 Known Issues

- PDF export currently returns HTML (client-side PDF conversion recommended)
- In-memory storage (implement Redis/database for production)
- No authentication system (implement for multi-user scenarios)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

For questions, issues, or feedback:

- Open an issue on GitHub
- Contact the development team
- Check the Venice AI documentation

## 🙏 Acknowledgments

- **Venice AI** for providing powerful AI models
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons

## 📸 Screenshots

### Landing Page
Beautiful, modern landing page with animated backgrounds and clear CTAs.

### Course Creation
Intuitive form with helpful examples and real-time validation.

### Progress Tracking
Engaging progress visualization with fun facts and estimated completion time.

### Course Viewer
Professional, easy-to-navigate course interface with expandable sections and smooth transitions.

---

**Built with ❤️ using Venice AI**

*Democratizing AI education, one course at a time.*
