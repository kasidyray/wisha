import React from 'react';
import Lottie from 'lottie-react';
// You'll need to replace this with your actual Lottie JSON file path
import animationData from '@/assets/animations/empty-state.json';

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const EmptyState = ({
  title = "No messages yet",
  description = "Be the first one to leave a message!",
  className = ""
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-64 h-64 mb-6">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}; 