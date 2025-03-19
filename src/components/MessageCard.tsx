
import React, { useState } from 'react';
import { Play, Pause, Image as ImageIcon, Volume2 } from 'lucide-react';

interface MessageCardProps {
  name: string;
  message: string;
  date: string;
  mediaType?: 'image' | 'video' | 'audio' | null;
  mediaUrl?: string;
  avatarUrl?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  name,
  message,
  date,
  mediaType,
  mediaUrl,
  avatarUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in">
      <div className="p-4">
        <div className="flex items-center mb-3">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-champagne-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{getInitials(name)}</span>
            </div>
          )}
          <div className="ml-3">
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        
        <p className="text-sm mb-3">{message}</p>
        
        {mediaType && (
          <div className="mt-4">
            {mediaType === 'image' && mediaUrl && (
              <div className="relative">
                <div 
                  className={`cursor-pointer transition-all duration-300 ${
                    isImageExpanded ? 'h-auto' : 'h-40 overflow-hidden'
                  }`}
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                >
                  <img 
                    src={mediaUrl} 
                    alt="Shared media" 
                    className="w-full rounded-lg object-cover"
                  />
                </div>
                {!isImageExpanded && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2"
                    onClick={() => setIsImageExpanded(true)}
                  >
                    <button className="text-xs bg-white bg-opacity-80 px-2 py-1 rounded-full shadow-sm">
                      View full image
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {mediaType === 'video' && mediaUrl && (
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <video 
                  className="w-full rounded-lg" 
                  controls
                  poster="/placeholder.svg"
                >
                  <source src={mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {mediaType === 'audio' && (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                <button 
                  className="w-8 h-8 bg-champagne-300 rounded-full flex items-center justify-center mr-3"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className="h-full bg-champagne-400 rounded-full w-1/3"></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">0:15</span>
                    <span className="text-xs text-muted-foreground">0:45</span>
                  </div>
                </div>
                
                <Volume2 className="w-4 h-4 ml-3 text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
