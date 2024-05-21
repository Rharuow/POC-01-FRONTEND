import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-3">
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
        </div>
        <Skeleton className="w-full min-h-[80px] rounded-xl" />
        <div className="flex flex-col gap-2">
          <p>Categorias</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton className="w-28 h-9 rounded-full" key={index} />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Loading
