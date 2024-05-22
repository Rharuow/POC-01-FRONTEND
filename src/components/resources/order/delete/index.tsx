import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'

import { apolloClient } from '@/lib/apollo'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Order } from '../order'
import { DELETE_ORDER } from '@/service/mutation/order'
import { GET_ORDERS } from '@/service/queries/order'

export default function DeleteOrder({ order }: { order: Order }) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const [deleteOrder] = useMutation(DELETE_ORDER)

  async function handleDeleteOrder(id: string) {
    try {
      await deleteOrder({
        variables: { id },
        update: (cache) => {
          const { getOrders } = apolloClient.readQuery({ query: GET_ORDERS });

          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              getOrders: getOrders.filter((pdt: Order) => pdt.id !== id),
            },
          });
        }
      })
      toast("Venda deletada com sucesso...")
    } catch (error) {
      console.log("error = ", error);

      toast("Desculpe, mas não foi possível deletar a venda")
    } finally {
      setDeleteModalIsOpen(false)
    }
  }

  return (
    <Dialog open={deleteModalIsOpen}>
      <DialogTrigger asChild onClick={() => setDeleteModalIsOpen(true)}>
        <Trash2 size={22} className="bg-red-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle><p>Você deseja deletar {order.id} do cliente {order.client?.name}?</p></DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={() => handleDeleteOrder(String(order.id))}>Deletar</Button>
              <Button onClick={() => setDeleteModalIsOpen(false)}>Cancelar</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
