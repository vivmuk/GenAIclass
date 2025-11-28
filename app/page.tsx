'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Rocket, Target, Zap, ArrowRight, BookOpen, Brain, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">GenAI Course Creator</span>
            </div>
            <button
              onClick={() => router.push('/create')}
              className="btn-secondary text-sm"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center fade-in-up">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 text-blue-600 font-semibold text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Powered by Venice AI
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-gradient">
                AI Education
              </span>
              <br />
              Tailored to Your Role
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform any job description into a comprehensive, personalized 10-chapter AI course.
              Science-backed learning, real-time updates, ready in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => router.push('/create')}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="btn-primary text-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Create Your Course
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${isHovering ? 'translate-x-2' : ''}`} />
                </span>
              </button>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary text-lg"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">10</div>
                <div className="text-gray-600">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">&lt;3</div>
                <div className="text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">100%</div>
                <div className="text-gray-600">Personalized</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">The Future of AI Learning</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three powerful AI models working together to create your perfect learning path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Deep Analysis</h3>
              <p className="text-gray-600 mb-4">
                Venice Large (Qwen3-235B) analyzes your role and creates a perfectly structured 10-chapter learning path.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Role-specific curriculum</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            <div className="card group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Rich Content</h3>
              <p className="text-gray-600 mb-4">
                GLM 4.6 generates comprehensive chapter content with exercises, examples, and actionable takeaways.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Adult learning science</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            <div className="card group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Latest Updates</h3>
              <p className="text-gray-600 mb-4">
                Mistral Medium searches the web for the latest developments, keeping your course current and relevant.
              </p>
              <div className="flex items-center text-pink-600 font-semibold">
                <span>Real-time industry news</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="card-glass max-w-4xl mx-auto p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-gradient">Why Choose GenAI Course Creator?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Role-Specific</h4>
                  <p className="text-gray-600">
                    Every chapter addresses your actual job responsibilities and challenges
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Fast Generation</h4>
                  <p className="text-gray-600">
                    Get your complete 10-chapter course in under 3 minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Export Ready</h4>
                  <p className="text-gray-600">
                    Download as HTML or PDF for offline learning and sharing
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Always Current</h4>
                  <p className="text-gray-600">
                    Real-time web search ensures latest tools and trends are covered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="card bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your AI Skills?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your personalized GenAI course in minutes
            </p>
            <button
              onClick={() => router.push('/create')}
              className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gradient">GenAI Course Creator</span>
          </div>
          <p className="text-sm">
            Powered by Venice AI • Built for the future of work
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
