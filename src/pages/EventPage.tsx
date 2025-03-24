import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Mic, X, Calendar, Users, Gift, MessageSquare, Image as ImageIcon, Plus, FileImage, PenLine, MicOff, Disc } from 'lucide-react';
import { GifIcon } from '@/components/icons/GifIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback, UserAvatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MobileDialog, MobileDialogContent, MobileDialogTrigger, MobileDialogClose } from '@/components/MobileDialog';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import SharePopover from '@/components/SharePopover';
import FontSettings from '@/components/FontSettings';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { eventsService } from '@/services/events';
import { messagesService } from '@/services/messages';
import { usersService } from '@/services/users';
import { activitiesService } from '@/services/activities';
import { uploadMessageMedia } from '@/lib/data';
import type { Message, Event, User } from '@/lib/mock-db/types';
import { MessageSkeletonGrid } from '@/components/MessageSkeleton';
import { Spinner } from '@/components/ui/spinner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import EmptyStateIcon from '@/components/icons/EmptyStateIcon';

const GIPHY_API_KEY = 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My'; // Replace with your actual Giphy API key when deploying

// Add this to the global CSS or a component-specific style
const pulseAnimation = `
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-recording {
  animation: pulse 1.5s infinite;
  background-color: rgba(255, 56, 92, 0.15);
}
`;

const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'messages'>('messages');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | 'gif' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [host, setHost] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGifSearchOpen, setIsGifSearchOpen] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const { user: currentUser } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newMessage, setNewMessage] = useState({
    name: currentUser?.name || '',
    message: '',
    mediaFile: null as File | null,
    mediaType: null as 'image' | 'video' | 'audio' | 'gif' | null,
    mediaUrl: null as string | null,
    gifUrl: ''
  });

  const [messageNameMap, setMessageNameMap] = useState<Record<string, string>>({});

  // Update newMessage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setNewMessage(prev => ({
        ...prev,
        name: currentUser.name || prev.name
      }));
    }
  }, [currentUser]);

  const isCreator = event?.creatorId === currentUser?.id;
  
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const titleRef = useRef<HTMLDivElement>(null);
  
  const [currentFont, setCurrentFont] = useState('font-sans');
  const [currentBgColor, setCurrentBgColor] = useState('bg-[rgb(255,228,233)]');
  const [currentBgImage, setCurrentBgImage] = useState('');
  const eventUrl = window.location.href;
  
  // Search for GIFs using Giphy API
  const searchGifs = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=20&offset=0&rating=g&lang=en`
      );
      const data = await response.json();
      setGifResults(data.data || []);
    } catch (error) {
      console.error('Error searching GIFs:', error);
      toast.error('Failed to search GIFs');
    }
  };

  // Handle GIF selection
  const handleGifSelect = (gifUrl: string) => {
    setNewMessage({
      ...newMessage,
      mediaType: 'gif',
      gifUrl
    });
    setIsGifSearchOpen(false);
  };

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' });
        
        setNewMessage({
          ...newMessage,
          mediaFile: audioFile,
          mediaType: 'audio'
        });
        
        setAudioChunks([]);
        setIsRecordingAudio(false);
      };
      
      setAudioRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecordingAudio(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error('Failed to start audio recording');
    }
  };

  // Stop audio recording
  const stopAudioRecording = () => {
    if (audioRecorder && audioRecorder.state !== 'inactive') {
      audioRecorder.stop();
      audioRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Handle media file upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (file.type.startsWith('image/')) {
        const mediaType = file.type.includes('gif') ? 'gif' : 'image';
        setNewMessage({...newMessage, mediaFile: file, mediaType, gifUrl: ''});
      } else if (file.type.startsWith('video/')) {
        setNewMessage({...newMessage, mediaFile: file, mediaType: 'video', gifUrl: ''});
      } else if (file.type.startsWith('audio/')) {
        setNewMessage({...newMessage, mediaFile: file, mediaType: 'audio', gifUrl: ''});
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) {
      console.log('No event found');
      return;
    }
    
    if (isSubmitting) {
      console.log('Already submitting');
      return;
    }
    
    // Check if we have a message or media content
    if (!newMessage.message.trim() && !newMessage.mediaFile && !newMessage.gifUrl) {
      toast.error('Please enter a message or add media');
      return;
    }
    
    // Ensure guest users enter a name
    if (!currentUser && !newMessage.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let media: {
        type: 'image' | 'video' | 'audio' | 'gif';
        url: string;
        thumbnailUrl?: string;
      } | undefined = undefined;

      // Handle GIF media
      if (newMessage.gifUrl) {
        media = {
          type: 'gif',
          url: newMessage.gifUrl
        };
      }
      // Upload media if exists
      else if (newMessage.mediaFile && newMessage.mediaType) {
        const uploadResult = await uploadMessageMedia(newMessage.mediaFile);
        
        if (uploadResult) {
          media = {
            type: uploadResult.type as 'image' | 'video' | 'audio' | 'gif',
            url: uploadResult.url
          };
        } else {
          toast.error('Failed to upload media');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create new message
      const message = await messagesService.create({
        eventId: event.id,
        content: newMessage.message,
        authorId: currentUser?.id,
        authorName: newMessage.name,
        media
      });
      
      // Create activity record for the new message
      if (message) {
        const userId = currentUser?.id || "00000000-0000-0000-0000-000000000000";
        await activitiesService.create({
          type: 'new_message',
          eventId: event.id,
          userId: userId,
          details: newMessage.name || currentUser?.name
        });
        
        setMessages((prev) => [message, ...prev]);
        setNewMessage({
          name: currentUser?.name || newMessage.name || '',
          message: '',
          mediaFile: null,
          mediaType: null,
          mediaUrl: null,
          gifUrl: ''
        });
        
        setMediaType(null);
        setIsModalOpen(false);
        toast.success('Your message has been added!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchEventData = async () => {
      if (!id) return;
      
      setLoadingError('');
      setIsLoading(true);
      
      try {
        // Get event
        const eventData = await eventsService.getById(id);
        
        if (!isMounted) return;
        
        if (!eventData) {
          setLoadingError('Event not found');
          setIsLoading(false);
          return;
        }
        
        setEvent(eventData);
        
        // Get host
        if (eventData.creatorId) {
          const host = await usersService.getById(eventData.creatorId);
          if (isMounted && host) {
            setHost(host);
          }
        }
        
        // Get messages
        const messagesData = await messagesService.list(id);
        if (isMounted) {
          // Sort messages to show newest first
          setMessages(messagesData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
        }
      } catch (error) {
        console.error('Error loading event:', error);
        if (isMounted) {
          setLoadingError('Failed to load event');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchEventData();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    // Load saved font and background color preferences
    if (id) {
      const savedFont = localStorage.getItem(`event_${id}_font`);
      const savedBgColor = localStorage.getItem(`event_${id}_bgColor`);
      const savedBgImage = localStorage.getItem(`event_${id}_bgImage`);
      
      if (savedFont) {
        setCurrentFont(savedFont);
      }
      
      if (savedBgColor) {
        setCurrentBgColor(savedBgColor);
      }
      
      if (savedBgImage) {
        setCurrentBgImage(savedBgImage);
      }
    }
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    if (id) {
      localStorage.setItem(`event_${id}_font`, font);
    }
  };
  
  const handleBgColorChange = (color: string) => {
    setCurrentBgColor(color);
    setCurrentBgImage(''); // Reset background image when color is set
    if (id) {
      localStorage.setItem(`event_${id}_bgColor`, color);
      localStorage.removeItem(`event_${id}_bgImage`);
    }
  };
  
  const handleBgImageChange = (imageUrl: string) => {
    setCurrentBgImage(imageUrl);
    setCurrentBgColor('bg-[rgb(255,228,233)]'); // Reset background color when image is set
    if (id) {
      localStorage.setItem(`event_${id}_bgImage`, imageUrl);
      localStorage.setItem(`event_${id}_bgColor`, 'bg-[rgb(255,228,233)]');
    }
  };
  
  // Handle keyboard appearance on mobile
  useEffect(() => {
    if (!isModalOpen) return;
    
    // Visual Viewport API to detect keyboard
    const handleResize = () => {
      if (!window.visualViewport) return;
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      
      // If visual viewport is significantly smaller than window height, keyboard is likely open
      if (windowHeight - viewportHeight > 150) {
        setKeyboardHeight(windowHeight - viewportHeight);
      } else {
        setKeyboardHeight(0);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);
    
    // Focus the textarea when the modal opens
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 300);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, [isModalOpen]);

  // Focus the textarea when switching from GIF search back to message input
  useEffect(() => {
    if (!isGifSearchOpen && isModalOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isGifSearchOpen, isModalOpen]);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Update textarea height when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage.message]);

  // Position the modal near the add message button on desktop
  useEffect(() => {
    if (!isModalOpen || !addButtonRef.current || !modalRef.current) return;
    
    const modalElement = modalRef.current;
    
    // Apply different positioning based on screen size
    if (window.innerWidth >= 768) {
      // Desktop positioning - above the button
      const buttonRect = addButtonRef.current.getBoundingClientRect();
      modalElement.style.position = 'fixed';
      modalElement.style.bottom = `${window.innerHeight - buttonRect.top + 16}px`;
      modalElement.style.left = '50%';
      modalElement.style.transform = 'translateX(-50%)';
      modalElement.style.top = 'auto'; // Clear any top positioning
    } else {
      // Mobile positioning - at the top of the screen
      modalElement.style.position = 'fixed';
      modalElement.style.top = '0';
      modalElement.style.left = '0';
      modalElement.style.right = '0';
      modalElement.style.bottom = 'auto'; // Clear any bottom positioning
      modalElement.style.transform = 'none'; // Clear any transform
    }
  }, [isModalOpen]);

  // Load default GIFs based on event title and type when GIF search is opened
  useEffect(() => {
    if (isGifSearchOpen && event) {
      // Construct search term based on event title and type
      const searchTerm = `${event.type || ''} ${event.title || ''}`.trim();
      if (searchTerm) {
        // Set the search term internally but don't update the input field
        const initialSearchTerm = searchTerm;
        setGifSearchTerm(''); // Keep input empty with placeholder visible
        searchGifs(initialSearchTerm); // Use the event-based term for initial search
      } else {
        // Fallback to general celebration GIFs
        setGifSearchTerm('');
        searchGifs('celebration');
      }
    }
  }, [isGifSearchOpen, event]);

  // Toggle body scroll when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = '';
    }
    
    return () => {
      // Cleanup - ensure scrolling is re-enabled when component unmounts
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    // Add the animation style to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = pulseAnimation;
    document.head.appendChild(styleElement);
    
    return () => {
      // Clean up on component unmount
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!event || !host) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {isLoading ? (
          <div className="text-center">
            <Spinner size="lg" withText={true} />
          </div>
        ) : loadingError ? (
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{loadingError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-primary hover:bg-primary/90"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="text-center max-w-md">
            <div className="text-yellow-500 text-5xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't seem to exist.</p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                Go Home
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen pb-20 event-page-background ${currentBgColor}`} 
      style={{
        backgroundImage: currentBgImage || 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-2 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="text-xl font-bold">Wisha</span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-200" />
            <h1 className={`hidden md:block text-lg font-medium transition-opacity duration-200 ${isTitleVisible ? 'opacity-0' : 'opacity-100'}`}>
              {event?.title}
            </h1>
          </div>
          {currentUser ? (
            <UserAvatar user={{
              name: currentUser.name || '',
              email: currentUser.email || '',
              avatarUrl: currentUser.avatar
            }} />
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="rounded-full text-gray-700 hover:bg-gray-100">
                  Log in
                </Button>
              </Link>
              <Link to="/create-event">
                <Button variant="airbnb" className="rounded-full flex items-center gap-2">
                  <span className="hidden md:inline">Try Wisha - It's Free!</span>
                  <span className="md:hidden">Try Wisha</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header with Title and Controls */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left" ref={titleRef}>
          <div className="mb-4 md:mb-0 w-full">
            <h2 className={`text-2xl font-bold ${currentFont}`}>{event?.title}</h2>
            <div className="text-gray-500">
              {event.instructions ? (
                <div className="mt-2 text-gray-700 text-sm italic">
                  {event.instructions}
                </div>
              ) : messages.length > 0 ? (
                `${messages.length} messages shared with ${host?.name}`
              ) : (
                `No messages shared yet, be the first!`
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            <SharePopover eventUrl={eventUrl} title={event?.title} />
            {isCreator && (
              <FontSettings 
                currentFont={currentFont} 
                onFontChange={handleFontChange}
                currentBgColor={currentBgColor}
                onBgColorChange={handleBgColorChange}
                currentBgImage={currentBgImage}
                onBgImageChange={handleBgImageChange}
              />
            )}
          </div>
        </div>
        
        <div className="animate-fade-in">
          {isLoading ? (
            <MessageSkeletonGrid />
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-48 h-48 mb-8">
                <img 
                  src="https://illustrations.popsy.co/red/communication.svg" 
                  alt="Start a conversation"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-2 max-w-md">
                Be the first to {event.title?.toLowerCase().startsWith('write') ? event.title.toLowerCase() : `share a message for ${event.title}`}.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="break-inside-avoid bg-white rounded-xl shadow-sm mb-6 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {message.media ? (
                    <div className="relative">
                      {message.media.type === 'image' && (
                        <img 
                          src={message.media.url} 
                          alt="Shared content" 
                          className="w-full object-cover" 
                        />
                      )}
                      {message.media.type === 'video' && (
                        <video 
                          src={message.media.url} 
                          controls 
                          className="w-full h-auto" 
                        />
                      )}
                      {message.media.type === 'audio' && (
                        <div className="p-4 bg-gray-50">
                          <audio 
                            src={message.media.url} 
                            controls 
                            className="w-full" 
                          />
                        </div>
                      )}
                      {message.media.type === 'gif' && (
                        <img 
                          src={message.media.url} 
                          alt="Shared GIF" 
                          className="w-full object-cover" 
                        />
                      )}
                    </div>
                  ) : null}
                  
                  <div className="p-4 relative">
                    <p className={`text-gray-800 ${currentFont}`}>{message.content}</p>
                    <p className="text-right mt-3 italic font-handwriting text-gray-600">
                      ~ {messageNameMap[message.id] || message.author?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed Add Message Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <Button 
          ref={addButtonRef}
          variant="airbnb" 
          size="lg"
          className="rounded-full shadow-xl px-8 py-7 text-base font-medium 
                    hover:scale-105 transition-all duration-300 
                    bg-gradient-to-r from-[#FF385C] to-[#FF385C]/90
                    animate-border-glow
                    flex items-center"
          id="add-message-button"
          onClick={() => setIsModalOpen(true)}
        >
          <PenLine className="mr-2 h-5 w-5" />
          Write a message
        </Button>
      </div>
            
      {/* Custom Mobile-Friendly Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="relative w-full md:w-[500px] bg-white md:rounded-xl shadow-xl
                      flex flex-col h-auto md:h-auto min-h-[auto] md:min-h-[auto] md:max-h-[80vh] overflow-hidden z-10"
            style={{
              // On mobile, adjust position and height based on keyboard height and viewport
              maxHeight: window.innerWidth < 768 
                ? (keyboardHeight > 0 ? `calc(100vh - ${keyboardHeight}px)` : '100vh')
                : '80vh'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full w-8 h-8 p-0 hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-sm font-semibold">Share your message</span>
              </div>
              <div className="w-8 h-8"></div> {/* Empty div for flex spacing */}
            </div>
              
            {/* Modal Body with Flexible Height */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {isGifSearchOpen ? (
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 bg-white p-4 border-b">
                    <div className="flex gap-2">
                      <Input
                        value={gifSearchTerm}
                        onChange={(e) => setGifSearchTerm(e.target.value)}
                        placeholder="Search for GIFs..."
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => searchGifs(gifSearchTerm)}
                        className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 overflow-y-auto max-h-[300px]">
                    <div className="grid grid-cols-2 gap-2">
                      {gifResults.map((gif) => (
                        <div 
                          key={gif.id} 
                          className="cursor-pointer rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                          onClick={() => handleGifSelect(gif.images.fixed_height.url)}
                        >
                          <img 
                            src={gif.images.fixed_height_small.url} 
                            alt={gif.title}
                            className="w-full h-auto" 
                          />
                        </div>
                      ))}
                      
                      {gifResults.length === 0 && gifSearchTerm && (
                        <div className="text-center py-8 text-gray-500 col-span-2">
                          No GIFs found. Try another search term.
                        </div>
                  )}
                </div>
              </div>
              
                  <div className="p-4 bg-white border-t sticky bottom-0">
                <Button 
                      className="w-full"
                  variant="outline" 
                      onClick={() => setIsGifSearchOpen(false)}
                    >
                      Cancel
                </Button>
              </div>
          </div>
        ) : (
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <div className="overflow-y-auto">
                    <div className="flex p-4 pb-2">
                      <div className="mr-3 flex-shrink-0">
                        <div className="h-10 w-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-semibold">
                          {currentUser?.name?.charAt(0) || newMessage.name.charAt(0) || '?'}
                        </div>
                      </div>
              
                      <div className="flex-1">
                        {!currentUser && (
                          <Input
                            id="name"
                            value={newMessage.name}
                            onChange={(e) => setNewMessage({...newMessage, name: e.target.value})}
                            placeholder="Your name"
                            className="border-0 p-0 text-base focus-visible:ring-0 placeholder:text-gray-500 mb-2"
                            required
                          />
                        )}
                        
                        <Textarea
                          id="message"
                          ref={textareaRef}
                          value={newMessage.message}
                          onChange={(e) => {
                            setNewMessage({...newMessage, message: e.target.value});
                          }}
                          placeholder="What's your message?"
                          className="border-0 p-0 resize-none text-lg focus-visible:ring-0 placeholder:text-gray-500 min-h-[80px] overflow-hidden mb-2"
                          required
                        />
                      </div>
                    </div>
                    
                    {(newMessage.mediaFile && newMessage.mediaType) || newMessage.gifUrl ? (
                      <div className="mx-4 mb-6 relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        {newMessage.mediaType === 'gif' && newMessage.gifUrl ? (
                          <img 
                            src={newMessage.gifUrl} 
                            alt="Selected GIF" 
                            className="w-full h-auto max-h-64 object-cover" 
                          />
                        ) : newMessage.mediaType === 'image' || newMessage.mediaType === 'gif' ? (
                          <img 
                            src={URL.createObjectURL(newMessage.mediaFile!)} 
                            alt="Preview" 
                            className="w-full h-auto max-h-64 object-cover" 
                          />
                        ) : newMessage.mediaType === 'video' ? (
                          <video 
                            src={URL.createObjectURL(newMessage.mediaFile!)} 
                            controls 
                            className="w-full h-auto max-h-64" 
                          />
                        ) : (
                          <audio 
                            src={URL.createObjectURL(newMessage.mediaFile!)} 
                            controls 
                            className="w-full p-4" 
                          />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/60 text-white h-8 w-8 p-0"
                          onClick={() => setNewMessage({...newMessage, mediaFile: null, mediaType: null, gifUrl: ''})}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Footer */}
                  <div className="p-4 pt-3 border-t bg-white z-10 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <label className="p-2 rounded-full text-[#FF385C] hover:bg-[#FF385C]/10 cursor-pointer transition-colors flex items-center justify-center w-10 h-10">
                                <ImageIcon className="h-5 w-5" />
                                <input 
                                  type="file" 
                                  accept="image/*,video/*" 
                                  className="hidden"
                                  onChange={handleMediaUpload}
                                />
                              </label>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Photo / Video</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button"
                                variant="ghost"
                                className="p-2 rounded-full text-[#FF385C] hover:bg-[#FF385C]/10 flex items-center justify-center w-10 h-10"
                                onClick={() => setIsGifSearchOpen(true)}
                              >
                                <GifIcon className="h-5 w-5 text-[#FF385C] fill-current" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>GIF</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button"
                                variant="ghost"
                                className={`p-2 rounded-full flex items-center justify-center w-10 h-10 ${isRecordingAudio ? 'bg-red-100 text-red-500 animate-recording' : 'text-[#FF385C] hover:bg-[#FF385C]/10'}`}
                                onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
                              >
                                {isRecordingAudio ? (
                                  <Disc className="h-5 w-5 animate-spin" />
                                ) : (
                                  <Mic className="h-5 w-5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{isRecordingAudio ? 'Stop Recording' : 'Record Audio'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="airbnb"
                        className="rounded-full px-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <Spinner size="sm" className="mr-2" />
                            Posting...
                          </div>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Post
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default EventPage;
