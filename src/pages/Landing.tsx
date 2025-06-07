
/**
 * © 2025 Vaion Developers. ChainReact — Free Forever, Not Yours to Rebrand.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Check, Zap, Shield, Download, Star, Target, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: "Build Habit Chains",
      description: "Create powerful habit chains that build momentum throughout your day"
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Visualize your streak and see your consistency improve over time"
    },
    {
      icon: Zap,
      title: "Stay Motivated",
      description: "Celebrate milestones and keep the momentum going with streak celebrations"
    },
    {
      icon: Shield,
      title: "100% Private",
      description: "All your data stays on your device. No tracking, no ads, no nonsense."
    }
  ];

  const benefits = [
    "Create unlimited habit chains",
    "Track daily progress and streaks",
    "Works completely offline",
    "No ads or tracking",
    "Free forever",
    "Install as PWA"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 vaion-trust">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Build momentum.<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              One habit at a time.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            ChainReact helps you build powerful habit chains that create unstoppable momentum in your daily routine. 
            Track, celebrate, and maintain your streaks with our beautiful, privacy-first app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Download className="mr-2" size={20} />
              Install App
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Star className="mr-1 text-yellow-500" size={16} />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-1 text-green-500" size={16} />
              <span>No Tracking</span>
            </div>
            <div className="flex items-center">
              <Zap className="mr-1 text-blue-500" size={16} />
              <span>Works Offline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to build lasting habits
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple, powerful features designed to help you create momentum and maintain consistency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why choose ChainReact?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Built with privacy and simplicity in mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mr-3">
                        <Check className="text-green-600 dark:text-green-400" size={16} />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                  <p className="mb-6 opacity-90">
                    Join thousands of users building better habits with ChainReact
                  </p>
                  <Link to="/app">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">
                      Start Building Habits
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
            <div className="flex items-center justify-center text-green-700 dark:text-green-400 text-lg font-medium mb-4">
              <Shield size={24} className="mr-3" />
              Built by Vaion Developers — Free Forever
            </div>
            <p className="text-green-600 dark:text-green-300 mb-4">
              No ads. No tracking. No nonsense. Always free.
            </p>
            <p className="text-sm text-green-500 dark:text-green-400">
              © 2025 Vaion Developers. ChainReact — Free Forever, Not Yours to Rebrand.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
