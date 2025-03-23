import React from 'react';
import { Settings, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FontSettingsProps {
  currentFont: string;
  onFontChange: (font: string) => void;
  currentBgColor?: string;
  onBgColorChange?: (color: string) => void;
}

const FontSettings = ({ 
  currentFont, 
  onFontChange,
  currentBgColor = 'bg-white',
  onBgColorChange = () => {}
}: FontSettingsProps) => {
  const fonts = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Serif' },
  ];

  const backgroundColors = [
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
            <h4 className="font-medium mb-3">Background</h4>
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
                    <Check className={`h-4 w-4 ${bgColor.value === 'bg-white' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
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