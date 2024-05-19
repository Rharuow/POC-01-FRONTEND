import React, { useState } from 'react'
import { Pencil } from 'lucide-react'

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useQuery } from '@apollo/client'
import { GET_CLIENT } from '@/service/queries/clients'
import { Skeleton } from '@/components/ui/skeleton'
import { FormUpdateClient } from './form'

export default function UpdateClient({ id }: { id: string }) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)

  const { loading, data } = useQuery(GET_CLIENT, {
    variables: { where: { id } }
  })

  return (
    <Dialog open={editModalIsOpen}>
      <DialogTrigger asChild onClick={() => setEditModalIsOpen(true)}>
        <Pencil size={22} className="bg-yellow-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]">
        <div className="flex flex-col gap-4">
          {
            loading ? <Skeleton className='h-96 w-full' /> :
              <FormUpdateClient setEditModalIsOpen={setEditModalIsOpen} client={data?.getClient} />
          }
        </div>
      </DialogContent>
    </Dialog>

  )
}
