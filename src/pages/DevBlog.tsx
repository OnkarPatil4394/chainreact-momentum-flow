
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Code, Lightbulb, Zap, Trophy, Palette, Database, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const DevBlog = () => {
  const navigate = useNavigate();

  const blogSections = [
    {
      id: 'inception',
      title: 'The Inception: Why ChainReact?',
      icon: <Lightbulb className="text-yellow-500" size={20} />,
      date: 'March 2024',
      content: `
        The idea for ChainReact came from a simple observation: most habit tracking apps are either too complex or too boring. We wanted to create something that felt like a game but actually helped people build real habits.

        Our core philosophy was simple:
        • Make it fun without being gimmicky
        • Keep it offline-first for privacy
        • Focus on visual progress representation
        • Build habit chains, not just individual habits
      `
    },
    {
      id: 'tech-stack',
      title: 'Tech Stack Decisions',
      icon: <Code className="text-blue-500" size={20} />,
      date: 'March 2024',
      content: `
        Choosing the right technology stack was crucial for our vision:

        **Frontend Framework: React + TypeScript**
        - Component-based architecture for reusable UI elements
        - TypeScript for better code quality and developer experience
        - Excellent ecosystem and community support

        **Build Tool: Vite**
        - Lightning-fast development experience
        - Excellent PWA support out of the box
        - Superior to Create React App in performance

        **Styling: Tailwind CSS + Shadcn/UI**
        - Utility-first approach for rapid development
        - Consistent design system with shadcn/ui components
        - Dark mode support built-in

        **Data Storage: IndexedDB + LocalStorage**
        - Completely offline-first approach
        - No user data leaves the device
        - Fast, browser-native storage solutions
      `
    },
    {
      id: 'design-philosophy',
      title: 'Design Philosophy & User Experience',
      icon: <Palette className="text-purple-500" size={20} />,
      date: 'April 2024',
      content: `
        Our design approach focused on three core principles:

        **Minimalist but Engaging**
        - Clean, distraction-free interface
        - Subtle animations to provide feedback
        - Color-coded progress indicators

        **Mobile-First Design**
        - Touch-friendly interactions
        - Responsive across all devices
        - Progressive Web App capabilities

        **Psychological Triggers**
        - Visual habit chains to show momentum
        - XP system for gamification
        - Streak celebrations to maintain motivation
        - Badge system for long-term engagement

        **Accessibility Considerations**
        - Dark mode for different preferences
        - Clear typography and contrast ratios
        - Keyboard navigation support
      `
    },
    {
      id: 'data-architecture',
      title: 'Data Architecture & Offline-First Approach',
      icon: <Database className="text-green-500" size={20} />,
      date: 'April 2024',
      content: `
        Building a truly offline-first app required careful data architecture:

        **Local Database Design**
        - IndexedDB for complex habit data and statistics
        - LocalStorage for user preferences and settings
        - JSON-based data structures for easy serialization

        **Data Models**
        \`\`\`typescript
        interface HabitChain {
          id: string;
          name: string;
          description: string;
          habits: Habit[];
          streak: number;
          createdAt: Date;
        }

        interface UserStats {
          level: number;
          totalXp: number;
          streakDays: number;
          totalCompletions: number;
          badges: Badge[];
        }
        \`\`\`

        **Background Sync Strategy**
        - Service Worker implementation for offline functionality
        - Automatic data backup to prevent loss
        - Sync queue for when connectivity returns
      `
    },
    {
      id: 'challenges',
      title: 'Major Technical Challenges',
      icon: <Zap className="text-red-500" size={20} />,
      date: 'May 2024',
      content: `
        Every project has its hurdles. Here are the major challenges we faced:

        **1. State Management Complexity**
        - Managing habit chains with interdependent habits
        - Ensuring UI reactivity across multiple components
        - Solution: Custom hooks and careful prop drilling

        **2. PWA Implementation**
        - Service Worker configuration for offline support
        - App manifest for installation experience
        - Background sync for data persistence

        **3. Cross-Browser Compatibility**
        - IndexedDB inconsistencies across browsers
        - CSS animation performance on mobile devices
        - Solution: Progressive enhancement and feature detection

        **4. Performance Optimization**
        - Large habit lists causing render lag
        - Memory leaks in long-running sessions
        - Solution: Virtual scrolling and component memoization

        **5. Data Migration**
        - Updating data structures without losing user progress
        - Backward compatibility with older app versions
        - Solution: Versioned data schemas and migration scripts
      `
    },
    {
      id: 'security',
      title: 'Privacy & Security Implementation',
      icon: <Shield className="text-indigo-500" size={20} />,
      date: 'May 2024',
      content: `
        Privacy was a core requirement from day one:

        **Data Privacy**
        - Zero data collection - everything stays on device
        - No analytics or tracking scripts
        - No external API calls for core functionality

        **Security Measures**
        - Content Security Policy (CSP) headers
        - Secure data serialization to prevent XSS
        - Input validation and sanitization

        **User Control**
        - Export functionality for data portability
        - Clear data deletion options
        - Transparent about what data is stored locally
      `
    },
    {
      id: 'features',
      title: 'Feature Development Journey',
      icon: <Trophy className="text-amber-500" size={20} />,
      date: 'June 2024',
      content: `
        Building features incrementally allowed us to validate concepts:

        **Core Features (MVP)**
        - Habit chain creation and management
        - Daily habit completion tracking
        - Basic progress visualization
        - Streak tracking

        **Gamification Layer**
        - XP system with levels
        - Achievement badges
        - Streak celebrations with confetti
        - Progress bars and visual feedback

        **Advanced Features**
        - Statistics and analytics page
        - Dark mode toggle
        - PWA installation prompts
        - Background sync capabilities

        **Polish & Quality of Life**
        - Welcome screen for new users
        - How-to-use guides
        - Smooth animations and transitions
        - Comprehensive settings page
      `
    },
    {
      id: 'lessons',
      title: 'Lessons Learned & Future Plans',
      icon: <Calendar className="text-teal-500" size={20} />,
      date: 'July 2024',
      content: `
        Key takeaways from building ChainReact:

        **What Worked Well**
        - Offline-first approach resonated with users
        - Simple, focused feature set prevented scope creep
        - React + TypeScript provided excellent developer experience
        - PWA capabilities made distribution effortless

        **What We'd Do Differently**
        - Earlier user testing for UX validation
        - More modular component architecture from the start
        - Automated testing suite implementation
        - Better documentation throughout development

        **Future Enhancements**
        - Habit sharing and social features (optional)
        - Data export in multiple formats
        - Custom habit templates
        - Advanced analytics and insights
        - Widget support for quick habit checking

        **Technical Debt to Address**
        - Component refactoring for better reusability
        - Performance optimization for large datasets
        - Accessibility improvements
        - Internationalization support
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ChainReact Development Blog</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">The complete journey of building a habit tracking PWA</p>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-blue-500" size={24} />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">What is ChainReact?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  ChainReact is a minimalist, gamified habit tracker designed to help users build and maintain powerful habit chains. 
                  It's a Progressive Web App (PWA) that works completely offline and prioritizes user privacy by storing all data locally.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">PWA</Badge>
                  <Badge variant="secondary">Offline-First</Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Habit chain creation and management</li>
                  <li>• Gamified progress tracking with XP and levels</li>
                  <li>• Streak celebrations and achievements</li>
                  <li>• Comprehensive statistics and analytics</li>
                  <li>• Complete offline functionality</li>
                  <li>• Dark mode support</li>
                  <li>• PWA installation capabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Timeline */}
        <div className="space-y-6">
          {blogSections.map((section, index) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {section.date}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {section.content.split('\n').map((paragraph, i) => {
                    if (paragraph.trim() === '') return null;
                    
                    if (paragraph.includes('```')) {
                      const codeContent = paragraph.replace(/```\w*/, '').replace('```', '');
                      return (
                        <pre key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-xs overflow-x-auto">
                          <code>{codeContent}</code>
                        </pre>
                      );
                    }
                    
                    if (paragraph.includes('**')) {
                      const parts = paragraph.split('**');
                      return (
                        <p key={i} className="mb-3">
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      );
                    }
                    
                    return (
                      <p key={i} className="mb-3 text-gray-700 dark:text-gray-300">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Want to Learn More?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                ChainReact is open source and built with ❤️ by Vaion Developers. 
                Check out our code, contribute to the project, or reach out with questions!
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://github.com/vaiondevelopers', '_blank')}
                >
                  <Code size={16} className="mr-2" />
                  View Source Code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/about')}
                >
                  About the Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevBlog;
