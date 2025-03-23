import React from 'react';
import { Copy, Share, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SharePopoverProps {
  eventUrl: string;
  title?: string;
}

const SharePopover = ({ eventUrl, title = "Share Event" }: SharePopoverProps) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const socialPlatforms = [
    { name: 'Instagram', icon: '/assets/instagram.svg', color: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400' },
    { name: 'TikTok', icon: '/assets/tiktok.svg', color: 'bg-black' },
    { name: 'Facebook', icon: '/assets/facebook.svg', color: 'bg-blue-600' },
    { name: 'X', icon: '/assets/twitter.svg', color: 'bg-black' },
    { name: 'YouTube', icon: '/assets/youtube.svg', color: 'bg-red-600' },
    { name: 'LinkedIn', icon: '/assets/linkedin.svg', color: 'bg-blue-700' },
    { name: 'Twitch', icon: '/assets/twitch.svg', color: 'bg-purple-600' },
    { name: 'Snapchat', icon: '/assets/snapchat.svg', color: 'bg-yellow-400' },
  ];

  const handleSocialShare = (platform: string) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(eventUrl);
    const encodedTitle = encodeURIComponent(`Check out this event: ${title}`);
    
    switch(platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'X':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        // For platforms without direct share links, just copy the URL
        handleCopyLink();
        toast.info(`Share this link on ${platform}`);
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Button 
            variant="ghost" 
            className="flex-1 rounded-l-full border-r border-gray-200 px-4 gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-r-full px-3" 
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Share</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-medium">Share your Event</h4>
            <p className="text-gray-500 text-sm">
              Get more views by sharing your event everywhere
            </p>
          </div>
          
          <div className="relative">
            <Input
              value={eventUrl}
              readOnly
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium uppercase text-gray-500">Share on:</h5>
            <div className="grid grid-cols-4 gap-3">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  className="flex flex-col items-center gap-1"
                  onClick={() => handleSocialShare(platform.name)}
                >
                  <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center`}>
                    {platform.name === 'Instagram' ? (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-pink-500 text-lg font-bold">I</span>
                      </div>
                    ) : (
                      <span className="text-white text-lg font-bold">{platform.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-xs">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover; 