'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Brain, BookOpen, TrendingUp } from 'lucide-react';

interface GenerationStatus {
  courseId: string;
  status: 'analyzing' | 'planning' | 'generating' | 'enriching' | 'finalizing' | 'completed' | 'error';
  progress: number;
  currentChapter?: number;
  totalChapters?: number;
  error?: string;
  estimatedTimeRemaining?: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) return;

    // Poll for status updates
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/status`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch status');
        }

        setStatus(data.status);

        // If completed, redirect to course viewer
        if (data.status.status === 'completed') {
          setTimeout(() => {
            router.push(`/courses/${courseId}`);
          }, 1000);
        }

        // If error, stop polling
        if (data.status.status === 'error') {
          setError(data.status.error || 'An error occurred');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch status');
      }
    };

    // Initial fetch
    pollStatus();

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [courseId, router]);

  const getStatusInfo = () => {
    if (!status) {
      return {
        title: 'Initializing...',
        description: 'Setting up your course generation',
        icon: Loader2,
        color: 'blue',
      };
    }

    switch (status.status) {
      case 'analyzing':
        return {
          title: 'Analyzing Your Role',
          description: 'Venice Large is analyzing the job requirements and impact of GenAI on this role',
          icon: Brain,
          color: 'blue',
        };
      case 'planning':
        return {
          title: 'Planning Your Curriculum',
          description: 'Creating a personalized 10-chapter learning path based on role requirements',
          icon: Sparkles,
          color: 'purple',
        };
      case 'generating':
        return {
          title: `Generating Chapter ${status.currentChapter || 1} of ${status.totalChapters || 10}`,
          description: 'GLM 4.6 is creating comprehensive content with exercises and examples',
          icon: BookOpen,
          color: 'indigo',
        };
      case 'enriching':
        return {
          title: 'Adding Latest Updates',
          description: 'Mistral Medium is searching for the latest industry developments and news',
          icon: TrendingUp,
          color: 'pink',
        };
      case 'finalizing':
        return {
          title: 'Finalizing Your Course',
          description: 'Putting the finishing touches on your personalized learning path',
          icon: Sparkles,
          color: 'green',
        };
      case 'completed':
        return {
          title: 'Course Ready!',
          description: 'Your personalized GenAI course is complete and ready to explore',
          icon: CheckCircle2,
          color: 'green',
        };
      case 'error':
        return {
          title: 'Error Occurred',
          description: status.error || 'An error occurred during generation',
          icon: AlertCircle,
          color: 'red',
        };
      default:
        return {
          title: 'Processing...',
          description: 'Working on your course',
          icon: Loader2,
          color: 'blue',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const progress = status?.progress || 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-3xl w-full">
          {/* Main Card */}
          <div className="card text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className={`w-24 h-24 bg-gradient-to-br from-${statusInfo.color}-500 to-${statusInfo.color}-600 rounded-3xl flex items-center justify-center`}>
                <StatusIcon className={`w-12 h-12 text-white ${status?.status === 'error' ? '' : 'animate-pulse'}`} />
              </div>
            </div>

            {/* Status Title */}
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient">{statusInfo.title}</span>
            </h1>

            {/* Status Description */}
            <p className="text-xl text-gray-600 mb-8">
              {statusInfo.description}
            </p>

            {/* Progress Bar */}
            {status?.status !== 'error' && (
              <div className="mb-8">
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-semibold text-gray-600">
                    {progress}% Complete
                  </span>
                  {status?.estimatedTimeRemaining && status.estimatedTimeRemaining > 0 && (
                    <span className="text-sm text-gray-500">
                      ~{Math.ceil(status.estimatedTimeRemaining / 60)} min remaining
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 text-left">
                <p className="font-semibold text-red-800 mb-2">Error Details</p>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => router.push('/create')}
                  className="mt-4 text-red-600 hover:text-red-700 font-semibold hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Processing Steps */}
            {status && status.status !== 'error' && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
                {[
                  { key: 'analyzing', label: 'Analyze', icon: Brain },
                  { key: 'planning', label: 'Plan', icon: Sparkles },
                  { key: 'generating', label: 'Generate', icon: BookOpen },
                  { key: 'enriching', label: 'Enrich', icon: TrendingUp },
                  { key: 'finalizing', label: 'Finalize', icon: CheckCircle2 },
                ].map((step, index) => {
                  const StepIcon = step.icon;
                  const isComplete = progress > (index * 20);
                  const isCurrent = status.status === step.key;

                  return (
                    <div
                      key={step.key}
                      className={`p-4 rounded-2xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'
                          : isComplete
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <StepIcon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          isCurrent
                            ? 'text-blue-600 animate-pulse'
                            : isComplete
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <div className={`text-sm font-semibold ${
                        isCurrent || isComplete ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Completion Message */}
            {status?.status === 'completed' && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                <p className="text-green-800 font-semibold mb-2">
                  🎉 Success! Redirecting to your course...
                </p>
                <p className="text-green-700 text-sm">
                  Your personalized learning path is ready
                </p>
              </div>
            )}
          </div>

          {/* Fun Facts */}
          {status && status.status !== 'error' && status.status !== 'completed' && (
            <div className="card-glass mt-8 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">Did you know?</p>
              <p className="text-gray-700">
                {status.status === 'analyzing' && "GenAI can automate up to 40% of work tasks, transforming how we work."}
                {status.status === 'planning' && "Adult learners retain 70% more when content is directly applicable to their work."}
                {status.status === 'generating' && "AI-powered learning paths can reduce training time by up to 60%."}
                {status.status === 'enriching' && "The AI field advances so rapidly that new breakthroughs happen almost daily."}
                {status.status === 'finalizing' && "Personalized learning increases engagement by 2-3x compared to generic courses."}
              </p>
            </div>
          )}
        </div>
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

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
