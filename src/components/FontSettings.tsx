import React, { useState, useRef } from 'react';
import { Settings, Check, Upload } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface FontSettingsProps {
  currentFont: string;
  onFontChange: (font: string) => void;
  currentBgColor?: string;
  onBgColorChange?: (color: string) => void;
  currentBgImage?: string;
  onBgImageChange?: (imageUrl: string) => void;
}

const FontSettings = ({ 
  currentFont, 
  onFontChange,
  currentBgColor = 'bg-[rgb(255,228,233)]',
  onBgColorChange = () => {},
  currentBgImage = '',
  onBgImageChange = () => {}
}: FontSettingsProps) => {
  const [activeBackgroundTab, setActiveBackgroundTab] = useState<'color' | 'image'>('color');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const fonts = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-mono', label: 'Monospace' },
    { value: 'font-handwriting', label: 'Handwriting' },
    { value: 'font-display', label: 'Display' },
  ];

  const backgroundColors = [
    { value: 'bg-[rgb(255,228,233)]', color: 'rgb(255,228,233)' }, // Light Pink (Default)
    { value: 'bg-[#4A1942]', color: '#4A1942' }, // Purple
    { value: 'bg-[#C5A14E]', color: '#C5A14E' }, // Gold
    { value: 'bg-[#BFD345]', color: '#BFD345' }, // Lime
    { value: 'bg-[#2A4034]', color: '#2A4034' }, // Dark Green
    { value: 'bg-[#4EB8B9]', color: '#4EB8B9' }, // Teal
    { value: 'bg-[#B9E6E7]', color: '#B9E6E7' }, // Light Teal
    { value: 'bg-[#4F68C4]', color: '#4F68C4' }, // Blue
    { value: 'bg-[#9A87DD]', color: '#9A87DD' }, // Lavender
    { value: 'bg-[#B66EB2]', color: '#B66EB2' }, // Pink-Purple
    { value: 'bg-[#EC9AA3]', color: '#EC9AA3' }, // Pink
    { value: 'bg-[#E0E0E0]', color: '#E0E0E0' }, // Light Gray
    { value: 'bg-white', color: '#FFFFFF' },     // White
  ];

  const backgroundImages = [
    { value: 'url(/images/backgrounds/bg-pattern-1.jpg)', thumbnail: '/images/backgrounds/bg-pattern-1.jpg' },
    { value: 'url(/images/backgrounds/bg-pattern-2.jpg)', thumbnail: '/images/backgrounds/bg-pattern-2.jpg' },
    { value: 'url(/images/backgrounds/bg-pattern-3.jpg)', thumbnail: '/images/backgrounds/bg-pattern-3.jpg' },
    { value: 'url(/images/backgrounds/bg-pattern-4.jpg)', thumbnail: '/images/backgrounds/bg-pattern-4.jpg' },
    { value: 'url(/images/backgrounds/bg-pattern-5.jpg)', thumbnail: '/images/backgrounds/bg-pattern-5.jpg' },
    { value: 'url(/images/backgrounds/bg-pattern-6.jpg)', thumbnail: '/images/backgrounds/bg-pattern-6.jpg' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onBgImageChange(`url(${imageUrl})`);
    }
  };

  const handleBackgroundSelection = (type: 'color' | 'image') => {
    setActiveBackgroundTab(type);
    // Reset the other background type when switching
    if (type === 'color' && currentBgImage) {
      onBgImageChange('');
    } else if (type === 'image' && currentBgColor !== 'bg-[rgb(255,228,233)]') {
      onBgColorChange('bg-[rgb(255,228,233)]');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Tabs defaultValue="background">
          <TabsList className="w-full">
            <TabsTrigger value="background" className="flex-1">Background</TabsTrigger>
            <TabsTrigger value="font" className="flex-1">Font Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="background" className="p-4">
            <div className="flex gap-2 mb-3">
              <Button 
                variant={activeBackgroundTab === 'color' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleBackgroundSelection('color')}
                className="flex-1"
              >
                Color
              </Button>
              <Button 
                variant={activeBackgroundTab === 'image' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleBackgroundSelection('image')}
                className="flex-1"
              >
                Image
              </Button>
            </div>
            
            {activeBackgroundTab === 'color' && (
              <div className="grid grid-cols-6 gap-2">
                {backgroundColors.map((bgColor) => (
                  <button
                    key={bgColor.value}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${bgColor.value} border-2 ${
                      currentBgColor === bgColor.value ? 'border-black' : 'border-transparent'
                    }`}
                    onClick={() => onBgColorChange(bgColor.value)}
                    style={{ 
                      boxShadow: currentBgColor === bgColor.value ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {currentBgColor === bgColor.value && (
                      <Check className={`h-4 w-4 ${
                        bgColor.value === 'bg-white' || bgColor.value === 'bg-[rgb(255,228,233)]' 
                        ? 'text-black' 
                        : 'text-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {activeBackgroundTab === 'image' && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {backgroundImages.map((bgImage) => (
                    <button
                      key={bgImage.value}
                      className={`h-20 rounded-md flex items-center justify-center transition-all bg-cover bg-center border-2 ${
                        currentBgImage === bgImage.value ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ 
                        backgroundImage: bgImage.value,
                        boxShadow: currentBgImage === bgImage.value ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none'
                      }}
                      onClick={() => onBgImageChange(bgImage.value)}
                    >
                      {currentBgImage === bgImage.value && (
                        <div className="bg-black/30 rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Custom Background</span>
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="font" className="p-4 space-y-4">
            <RadioGroup
              value={currentFont}
              onValueChange={onFontChange}
              className="gap-3"
            >
              {fonts.map((font) => (
                <div key={font.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={font.value} id={`font-${font.value}`} />
                  <Label htmlFor={`font-${font.value}`} className={font.value}>
                    {font.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default FontSettings; 