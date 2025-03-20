
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
    <div className="min-h-screen bg-slate-50">
      {/* Event Header */}
      <div className="bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4 text-white">
                <span className="font-serif font-semibold">AG</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-medium">Alex's Graduation</h1>
                <p className="text-sm text-muted-foreground">May 15, 2025</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'form' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-transparent hover:bg-indigo-50'
                }`}
                onClick={() => setActiveTab('form')}
              >
                Leave a Message
              </button>
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'gallery' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-transparent hover:bg-indigo-50'
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
                Send your wishes to Alex
              </h2>
              <p className="text-muted-foreground">
                Share your congratulations, advice, or memories with Alex for their graduation.
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
                          ? 'bg-indigo-100 text-indigo-700' 
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
                          ? 'bg-indigo-100 text-indigo-700' 
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
                          ? 'bg-indigo-100 text-indigo-700' 
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
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-light mb-4">
                Gallery of Messages
              </h2>
              <p className="text-muted-foreground">
                See all the beautiful messages shared with Alex.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MessageCard 
                name="Emma Johnson"
                message="Congratulations on your graduation! Your hard work and dedication have finally paid off. So proud of you!"
                date="2 days ago"
              />
              
              <MessageCard 
                name="David Chen"
                message="What an amazing achievement! Wishing you all the best in your future endeavors. The world is yours to conquer!"
                date="1 day ago"
                mediaType="image"
                mediaUrl="/placeholder.svg"
              />
              
              <MessageCard 
                name="Sophia Williams"
                message="I'm so happy for you! Sorry I couldn't be there in person, but I'm sending you all my love and congratulations."
                date="5 hours ago"
                mediaType="audio"
              />
              
              <MessageCard 
                name="James Wilson"
                message="Congratulations on this incredible milestone! Your perseverance and determination have been truly inspiring."
                date="3 days ago"
              />
              
              <MessageCard 
                name="Olivia Martinez"
                message="As you celebrate your graduation, remember that this is just the beginning of an exciting journey ahead. Congrats!"
                date="4 days ago"
                mediaType="image"
                mediaUrl="/placeholder.svg"
              />
              
              <MessageCard 
                name="Michael Brown"
                message="Here's to your success! May your degree open doors to amazing opportunities. Congratulations, graduate!"
                date="1 week ago"
                mediaType="video"
                mediaUrl="/placeholder.svg"
              />
            </div>
            
            <div className="flex justify-center mt-10">
              <Button onClick={() => setActiveTab('form')}>
                Add Your Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
