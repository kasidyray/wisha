
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import Button from './Button';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="inline-block bg-blue-100 bg-opacity-80 backdrop-blur-sm px-4 py-1 rounded-full mb-4">
            <span className="text-sm font-medium">Collect wishes for any occasion</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-6">
            Create & collect <span className="font-medium text-indigo-500">memories</span> <br />from your loved ones
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
            Share a unique link for friends and family to send heartfelt wishes, photos, videos, 
            and audio messages for any special occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/create-event">
              <Button size="lg" icon={<Sparkles className="h-5 w-5" />} iconPosition="right">
                Create Your Collection
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-200 rounded-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-emerald-100 rounded-xl"></div>
            
            <div className="relative glass-card overflow-hidden rounded-xl shadow-lg">
              <div className="bg-white p-6 rounded-t-xl border-b border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center">
                    <span className="font-serif font-semibold">GE</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-serif font-medium text-lg">Graduation Event</h3>
                    <p className="text-sm text-muted-foreground">June 15, 2025</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Share your wishes, photos and videos for this special occasion</p>
              </div>
              
              <div className="bg-slate-50 p-6 space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-200 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="font-medium text-xs">AS</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Anna Smith</p>
                      <p className="text-sm mt-1">Congratulations on your achievement! So proud of you! 🎓</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-300 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="font-medium text-xs">MJ</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Mike Johnson</p>
                      <p className="text-sm mt-1">Your hard work paid off! Can't wait to celebrate!</p>
                      <div className="mt-2 bg-gray-50 rounded-md p-2 text-xs text-gray-500 flex items-center">
                        <span>Voice message (0:32)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
