
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  className,
  delay = 0
}) => {
  return (
    <div 
      className={cn(
        "group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow transition-all duration-300 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4 inline-flex items-center justify-center p-2 bg-cream-100 rounded-lg group-hover:bg-cream-200 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
