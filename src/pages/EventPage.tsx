
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Camera, Mic, X } from 'lucide-react';
import Button from '@/components/Button';
import MessageCard from '@/components/MessageCard';
import MediaUpload from '@/components/MediaUpload';
import { toast } from 'sonner';

const EventPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'gallery'>('form');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleMediaUpload = (file: File | null) => {
    setMediaFile(file);
    
    if (file) {
      if (file.type.startsWith('image/')) {
        setMediaType('image');
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else if (file.type.startsWith('audio/')) {
        setMediaType('audio');
      }
    } else {
      setMediaType(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log({
        name,
        message,
        mediaFile,
        mediaType
      });
      
      toast.success('Your message has been sent!');
      setName('');
      setMessage('');
      setMediaFile(null);
      setMediaType(null);
      setIsSubmitting(false);
      setActiveTab('gallery');
    }, 1500);
  };
  
  const handleClear = () => {
    setName('');
    setMessage('');
    setMediaFile(null);
    setMediaType(null);
  };
  
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Event Header */}
      <div className="bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-champagne-300 rounded-full flex items-center justify-center mr-4">
                <span className="font-serif font-semibold">S&J</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-medium">Sarah & John's Wedding</h1>
                <p className="text-sm text-muted-foreground">May 15, 2025</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'form' 
                    ? 'bg-champagne-200 text-foreground' 
                    : 'bg-transparent hover:bg-champagne-100'
                }`}
                onClick={() => setActiveTab('form')}
              >
                Leave a Wish
              </button>
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'gallery' 
                    ? 'bg-champagne-200 text-foreground' 
                    : 'bg-transparent hover:bg-champagne-100'
                }`}
                onClick={() => setActiveTab('gallery')}
              >
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'form' ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-slide-down">
              <h2 className="text-2xl font-serif font-light mb-4">
                Send your wishes to the happy couple
              </h2>
              <p className="text-muted-foreground">
                Share your congratulations, advice, or memories with Sarah & John.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-1 text-sm font-medium">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Add Media (Optional)
                </label>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`flex items-center px-3 py-2 rounded-md text-sm ${
                        mediaType === 'image' 
                          ? 'bg-champagne-200 text-foreground' 
                          : 'bg-gray-100 hover:bg-gray-200 text-muted-foreground'
                      }`}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`flex items-center px-3 py-2 rounded-md text-sm ${
                        mediaType === 'video' 
                          ? 'bg-champagne-200 text-foreground' 
                          : 'bg-gray-100 hover:bg-gray-200 text-muted-foreground'
                      }`}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('audio')}
                      className={`flex items-center px-3 py-2 rounded-md text-sm ${
                        mediaType === 'audio' 
                          ? 'bg-champagne-200 text-foreground' 
                          : 'bg-gray-100 hover:bg-gray-200 text-muted-foreground'
                      }`}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Audio
                    </button>
                  </div>
                  
                  {mediaType && (
                    <MediaUpload 
                      onChange={handleMediaUpload}
                      type={mediaType}
                      label={`Upload ${mediaType}`}
                    />
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClear}
                  icon={<X className="w-4 h-4" />}
                >
                  Clear Form
                </Button>
                <Button 
                  type="submit" 
                  loading={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send Wishes
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-light mb-4">
                Gallery of Wishes
              </h2>
              <p className="text-muted-foreground">
                See all the beautiful messages shared with Sarah & John.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MessageCard 
                name="Emma Johnson"
                message="Wishing you both all the love and happiness in the world! Your love story has been an inspiration to us all."
                date="2 days ago"
              />
              
              <MessageCard 
                name="David Chen"
                message="Congratulations on your special day! May your love continue to grow stronger with each passing day."
                date="1 day ago"
                mediaType="image"
                mediaUrl="/placeholder.svg"
              />
              
              <MessageCard 
                name="Sophia Williams"
                message="I'm so happy for you both! Sorry I couldn't be there in person, but I'm sending you all my love."
                date="5 hours ago"
                mediaType="audio"
              />
              
              <MessageCard 
                name="James Wilson"
                message="Here's to a lifetime of love, laughter, and adventure together! Congratulations on your wedding day!"
                date="3 days ago"
              />
              
              <MessageCard 
                name="Olivia Martinez"
                message="May your marriage be filled with all the right ingredients: a heap of love, a dash of humor, a touch of romance, and a spoonful of understanding."
                date="4 days ago"
                mediaType="image"
                mediaUrl="/placeholder.svg"
              />
              
              <MessageCard 
                name="Michael Brown"
                message="Congratulations to the beautiful couple! May the years ahead be filled with lasting joy."
                date="1 week ago"
                mediaType="video"
                mediaUrl="/placeholder.svg"
              />
            </div>
            
            <div className="flex justify-center mt-10">
              <Button onClick={() => setActiveTab('form')}>
                Add Your Wishes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
