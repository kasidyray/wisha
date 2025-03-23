import React from 'react';

interface EventIllustrationProps {
  className?: string;
}

const EventIllustration: React.FC<EventIllustrationProps> = ({ className }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Background decoration */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-accent rounded-full opacity-60 animate-bounce-slow"></div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary opacity-20 rounded-full animate-pulse-soft animation-delay-1000"></div>
      
      {/* Main card content */}
      <div className="relative z-10 bg-white p-6 rounded-2xl shadow-md airbnb-card hover:scale-[1.02] transition-transform duration-300">
        {/* Event card preview */}
        <div className="mb-6 relative">
          <div className="absolute -top-3 -left-3 w-10 h-10 bg-accent rounded-full animate-spin-slow"></div>
          <div className="border border-gray-100 rounded-xl p-3 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-24 bg-accent/20 rounded-xl mb-3 flex items-center justify-center group">
              <span className="text-4xl group-hover:scale-125 transition-transform duration-300">🎂</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full w-2/3 animate-pulse"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full animate-pulse animation-delay-200"></div>
              <div className="h-2 bg-gray-100 rounded-full w-5/6 animate-pulse animation-delay-400"></div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary opacity-20 rounded-full animate-ping"></div>
        </div>
        
        {/* Messages preview */}
        <div className="space-y-3">
          <div className="flex items-start transform hover:-translate-x-1 transition-transform duration-300">
            <div className="w-7 h-7 rounded-full bg-indigo-200 flex-shrink-0 mr-2 flex items-center justify-center text-xs border-2 border-white animate-bounce-slow">JD</div>
            <div className="flex-1 p-2 bg-gray-50 rounded-xl rounded-tl-none hover:bg-gray-100 transition-colors duration-300">
              <div className="h-2 bg-gray-200 rounded-full w-2/3 mb-1 animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded-full w-full mb-1 animate-pulse animation-delay-200"></div>
            </div>
          </div>
          
          <div className="flex items-start transform hover:-translate-x-1 transition-transform duration-300 animation-delay-300">
            <div className="w-7 h-7 rounded-full bg-emerald-200 flex-shrink-0 mr-2 flex items-center justify-center text-xs border-2 border-white animate-bounce-slow animation-delay-500">KM</div>
            <div className="flex-1 p-2 bg-gray-50 rounded-xl rounded-tl-none hover:bg-gray-100 transition-colors duration-300">
              <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-1 animate-pulse animation-delay-400"></div>
              <div className="h-2 bg-gray-200 rounded-full w-full animate-pulse animation-delay-600"></div>
            </div>
          </div>
          
          <div className="flex items-start transform hover:-translate-x-1 transition-transform duration-300 animation-delay-600">
            <div className="w-7 h-7 rounded-full bg-amber-200 flex-shrink-0 mr-2 flex items-center justify-center text-xs border-2 border-white animate-bounce-slow animation-delay-1000">TR</div>
            <div className="flex-1 p-2 bg-gray-50 rounded-xl rounded-tl-none hover:bg-gray-100 transition-colors duration-300">
              <div className="h-2 bg-gray-200 rounded-full w-1/2 mb-1 animate-pulse animation-delay-800"></div>
              <div className="h-2 bg-gray-200 rounded-full w-4/5 animate-pulse animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 animate-spin-slow">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8L26.9282 14.9282L20 21.8564L13.0718 14.9282L20 8Z" fill="#FF385C" fillOpacity="0.2" />
          <path d="M20 18.1436L26.9282 25.0718L20 32L13.0718 25.0718L20 18.1436Z" fill="#FF385C" fillOpacity="0.4" />
        </svg>
      </div>
      <div className="absolute -bottom-8 left-8 animate-spin-reverse-slow">
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="20" stroke="#FF385C" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
};

export default EventIllustration; 