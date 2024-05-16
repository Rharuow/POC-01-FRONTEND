import React, { useState } from 'react'
import { Pencil } from 'lucide-react'

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function UpdateClient({ id }: { id: string }) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)

  return (
    <Dialog open={editModalIsOpen}>
      <DialogTrigger asChild onClick={() => setEditModalIsOpen(true)}>
        <Pencil size={22} className="bg-yellow-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">

          <DialogFooter>
            <div className="flex gap-2">
              <Button type='submit'>Salvar</Button>
              <Button onClick={() => setEditModalIsOpen(false)}>Cancelar</Button>
            </div>
          </DialogFooter>

        </div>
      </DialogContent>
    </Dialog>

  )
}
