import { CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
  return (
    Array.from({ length: 4 }).map((_, index) => (
      <CarouselItem
        className="md:basis-1/2 lg:basis-1/4 flex justify-center"
        key={index}
      >
        <Skeleton className="w-full h-20" />
      </CarouselItem>
    ))
  )
}

export default Loading
