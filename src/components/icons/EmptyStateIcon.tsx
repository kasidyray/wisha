import React from 'react';

const EmptyStateIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#FF385C]"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
      <path d="m3 7 9 6 9-6"></path>
      <circle cx="12" cy="12" r="4" className="fill-current"></circle>
      <path d="M12 8v8"></path>
      <path d="M8 12h8"></path>
    </svg>
  );
};

export default EmptyStateIcon; 