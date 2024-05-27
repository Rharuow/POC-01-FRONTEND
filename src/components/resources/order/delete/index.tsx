import { Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'

import { apolloClient } from '@/lib/apollo'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Order } from '../order'
import { DELETE_ORDER } from '@/service/mutation/order'
import { GET_ORDERS } from '@/service/queries/order'
import { useAccordionContext } from '@/pages'

export default function DeleteOrder({ order }: { order: Order }) {
  const { setAccordionValue } = useAccordionContext()

  const date = new Date(String(order.createdAt))

  const [deleteOrder] = useMutation(DELETE_ORDER)

  async function handleDeleteOrder(id: string) {
    try {
      setAccordionValue("")
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
      setAccordionValue("orders")
      toast("Venda deletada com sucesso...")
    } catch (error) {
      console.log("error = ", error);

      toast("Desculpe, mas não foi possível deletar a venda")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild >
        <Trash2 size={22} className="bg-red-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle><p>Você deseja deletar a compra do dia {date.getDate()}/{date.getMonth()}/{date.getFullYear()} às {date.getHours()}:{date.getMinutes()} do cliente {order.client?.name}?</p></DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <DialogClose className='rounded-lg text-white bg-primary p-2 w-full' onClick={() => handleDeleteOrder(String(order.id))}>
                Deletar
              </DialogClose>
              <DialogClose className='rounded-lg border border-primary p-2 w-full'>Cancelar</DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
