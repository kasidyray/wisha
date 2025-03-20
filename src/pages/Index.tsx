
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import Button from '@/components/Button';
import MessageCard from '@/components/MessageCard';
import { 
  MessageCircle, 
  Image, 
  Video, 
  Mic, 
  Share2, 
  Lock, 
  Download,
  Heart,
  PartyPopper
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block bg-emerald-100 px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium">Why choose Wisha</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              Collect memories in multiple formats
            </h2>
            <p className="text-lg text-muted-foreground">
              Let your friends and family share their heartfelt wishes in the way that feels most personal to them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<MessageCircle className="h-6 w-6 text-indigo-600" />}
              title="Text Messages"
              description="Simple written messages and wishes from your guests."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Image className="h-6 w-6 text-indigo-600" />}
              title="Photo Uploads"
              description="Share beautiful memories through photos and images."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Video className="h-6 w-6 text-indigo-600" />}
              title="Video Messages"
              description="Capture personal video messages from anywhere in the world."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Mic className="h-6 w-6 text-indigo-600" />}
              title="Audio Recordings"
              description="Voice messages to hear the emotion in every wish."
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block bg-indigo-100 px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium">Simple process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              How Wisha works
            </h2>
            <p className="text-lg text-muted-foreground">
              Collecting beautiful memories from your friends and family has never been easier.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif">1</span>
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">Create your event</h3>
              <p className="text-muted-foreground mb-4">
                Set up your event in less than a minute. Customize it with your event details.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif">2</span>
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">Share your unique link</h3>
              <p className="text-muted-foreground mb-4">
                Send your personalized link to friends and family through text, email, or include it in your invitation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif">3</span>
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">Collect memories</h3>
              <p className="text-muted-foreground mb-4">
                Watch as beautiful messages flow in. Download them all together as a keepsake.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/create-event">
              <Button>Create Your Event</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Preview Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block bg-emerald-200 px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium">Preview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              See how it looks
            </h2>
            <p className="text-lg text-muted-foreground">
              Beautiful design that showcases each memory in the best possible way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MessageCard 
              name="Emma Johnson"
              message="Happy birthday! Wishing you all the joy and happiness today and always. So glad to be celebrating you!"
              date="2 days ago"
            />
            
            <MessageCard 
              name="David Chen"
              message="Congratulations on your graduation! All your hard work has finally paid off. We're all so proud of you!"
              date="1 day ago"
              mediaType="image"
              mediaUrl="/placeholder.svg"
            />
            
            <MessageCard 
              name="Sophia Williams"
              message="Best wishes on your retirement! Looking forward to hearing about all your new adventures."
              date="5 hours ago"
              mediaType="audio"
            />
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <div className="max-w-lg">
                <div className="inline-block bg-indigo-100 px-4 py-1 rounded-full mb-4">
                  <span className="text-sm font-medium">Why you'll love it</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
                  More than just messages
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Wisha provides a comprehensive solution for collecting and preserving heartfelt wishes from your friends and family.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                      <Share2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Easy Sharing</h3>
                      <p className="text-muted-foreground text-sm">
                        Share your unique link via WhatsApp, email, social media, or even a QR code.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                      <Lock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Privacy & Moderation</h3>
                      <p className="text-muted-foreground text-sm">
                        You control who can view the messages and can moderate content.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                      <Download className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Download & Keep</h3>
                      <p className="text-muted-foreground text-sm">
                        Download all your messages as a PDF or digital album to cherish forever.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-full h-full bg-emerald-100 rounded-3xl transform rotate-6"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-indigo-200 rounded-3xl transform -rotate-3"></div>
                
                <div className="relative bg-white p-8 rounded-3xl shadow-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="Birthday celebration" 
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                  
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-serif font-medium text-lg">Alex's Birthday</h3>
                      <p className="text-sm text-muted-foreground">May 15, 2025</p>
                    </div>
                    <div className="bg-indigo-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <PartyPopper className="h-5 w-5 text-indigo-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <p className="text-sm">56 messages received</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <p className="text-sm">12 photos shared</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                      <p className="text-sm">8 video messages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-indigo-100">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 max-w-2xl mx-auto">
            Ready to collect beautiful memories for your special occasion?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create your own Wisha event in minutes and start collecting heartfelt messages from your loved ones.
          </p>
          <Link to="/create-event">
            <Button size="lg">
              Create Your Event
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-serif font-semibold">Wisha</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Collect and cherish memories for any occasion
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/" className="text-sm hover:text-indigo-500 transition-colors">
                Home
              </Link>
              <Link to="/how-it-works" className="text-sm hover:text-indigo-500 transition-colors">
                How It Works
              </Link>
              <Link to="/pricing" className="text-sm hover:text-indigo-500 transition-colors">
                Pricing
              </Link>
              <Link to="/create-event" className="text-sm hover:text-indigo-500 transition-colors">
                Create Event
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Wisha. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-indigo-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-indigo-500 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-indigo-500 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
