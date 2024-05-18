import React, { useState } from 'react'
import { Pencil } from 'lucide-react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useQuery } from '@apollo/client'
import { Skeleton } from '@/components/ui/skeleton'
import { FormUpdateProduct } from './form'
import { GET_PRODUCT } from '@/service/queries/products'

export default function UpdateProduct({ id }: { id: string }) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)

  const { loading, data } = useQuery(GET_PRODUCT, {
    variables: { where: { id } }
  })

  return (
    <Dialog open={editModalIsOpen}>
      <DialogTrigger asChild onClick={() => setEditModalIsOpen(true)}>
        <Pencil size={22} className="bg-yellow-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent withoutCloseButton>
        <div className="flex flex-col gap-4">
          {
            loading ? <Skeleton className='h-96 w-full' /> :
              <FormUpdateProduct setEditModalIsOpen={setEditModalIsOpen} product={data?.product} />
          }
        </div>
      </DialogContent>
    </Dialog>

  )
}
