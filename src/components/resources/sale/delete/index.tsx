import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'

import { apolloClient } from '@/lib/apollo'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sale } from '../sale'
import { DELETE_SALE } from '@/service/mutation/sale'
import { GET_SALES } from '@/service/queries/sale'

export default function DeleteSale({ sale }: { sale: Sale }) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const [deleteOneSale] = useMutation(DELETE_SALE)

  async function handleDeleteSale(id: string) {
    try {
      await deleteOneSale({
        variables: { where: { id } },
        update: (cache, { data: { deleteOneSale } }) => {
          const { sales } = apolloClient.readQuery({ query: GET_SALES });

          cache.writeQuery({
            query: GET_SALES,
            data: {
              sales: sales.filter((pdt: Sale) => pdt.id !== deleteOneSale.id),
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
            <DialogTitle><p>Você deseja deletar {sale.id} do cliente {sale.client?.name}?</p></DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={() => handleDeleteSale(String(sale.id))}>Deletar</Button>
              <Button onClick={() => setDeleteModalIsOpen(false)}>Cancelar</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
