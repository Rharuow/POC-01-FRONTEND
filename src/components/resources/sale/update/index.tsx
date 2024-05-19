import React, { useState } from 'react'
import { Pencil } from 'lucide-react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useQuery } from '@apollo/client'
import { Skeleton } from '@/components/ui/skeleton'
import { GET_SALE } from '@/service/queries/sale'
import { FormUpdateSale } from './form'

export default function UpdateSale({ id }: { id: string }) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)

  const { loading, data } = useQuery(GET_SALE, {
    variables: { where: { id } }
  })

  return (
    <Dialog open={editModalIsOpen}>
      <DialogTrigger asChild onClick={() => setEditModalIsOpen(true)}>
        <Pencil size={22} className="bg-yellow-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent withoutCloseButton className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]">
        <div className="flex flex-col gap-4">
          {
            loading ? <Skeleton className='h-96 w-full' /> :
              <FormUpdateSale setEditModalIsOpen={setEditModalIsOpen} sale={data?.sale} />
          }
        </div>
      </DialogContent>
    </Dialog>

  )
}
