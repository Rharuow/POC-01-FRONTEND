import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
        <Skeleton className="w-full h-10 rounded-full" />
        <Skeleton className="w-full h-10 rounded-full" />
      </div>
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
    </div>
  )
}

export default Loading
