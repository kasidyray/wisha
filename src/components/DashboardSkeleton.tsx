import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-2 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#FF385C]" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: "Total Events", icon: true },
            { title: "Participants", icon: true },
            { title: "Items", icon: true }
          ].map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-[#FF385C]/10 p-3">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="h-full hover:shadow-md transition-all duration-200 overflow-hidden border-none">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute top-4 right-4 w-16">
                    <Skeleton className="h-5 w-full rounded-full" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Create New Event Card */}
            <Card className="h-full border-dashed hover:shadow-md transition-all duration-200 flex flex-col justify-center items-center p-8">
              <Skeleton className="h-16 w-16 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </Card>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <Skeleton className="h-8 w-40 mb-6" />
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative pl-14">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#FF385C]/10" />
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <Skeleton className="h-5 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-3 px-4">
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton; 