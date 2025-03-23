import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageSkeletonProps {
  hasMedia?: boolean;
}

export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ hasMedia = true }) => {
  return (
    <div className="break-inside-avoid bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
      {hasMedia && (
        <Skeleton className="w-full h-48" />
      )}
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-end">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export const MessageSkeletonGrid: React.FC = () => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <MessageSkeleton hasMedia={true} />
      <MessageSkeleton hasMedia={false} />
      <MessageSkeleton hasMedia={true} />
      <MessageSkeleton hasMedia={false} />
      <MessageSkeleton hasMedia={true} />
      <MessageSkeleton hasMedia={true} />
    </div>
  );
}; 