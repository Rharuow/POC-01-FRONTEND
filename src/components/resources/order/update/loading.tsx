import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-10 rounded-full" />
        <div className="grid grid-cols-5 gap-2">
          <Skeleton className="h-10 col-span-2" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
        </div>
        <Skeleton className="w-full h-10 rounded-full" />
      </div>
    </div>
  )
}

export default Loading
