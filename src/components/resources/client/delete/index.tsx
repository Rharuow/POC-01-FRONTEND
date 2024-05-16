import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Client } from '../client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'
import { DELETE_CLIENT } from '@/service/mutation/delete/client'
import { GET_CLIENTS } from '@/service/queries/clients'
import { apolloClient } from '@/lib/apollo'

export default function DeleteClient({ client }: { client: Client }) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const [deleteOneClient] = useMutation(DELETE_CLIENT)

  async function handleDeleteClient(id: string) {
    try {
      await deleteOneClient({
        variables: { where: { id } },
        update: (cache, { data: { deleteOneClient } }) => {
          console.log("deleteOneClient = ", deleteOneClient);
          const { clients } = apolloClient.readQuery({ query: GET_CLIENTS });

          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              clients: clients.filter((client: Client) => client.id !== deleteOneClient.id),
            },
          });
        }
      })
      toast("Cliente deletado com sucesso...")
    } catch (error) {
      console.log("error = ", error);

      toast("Desculpe, mas não foi possível deletar o cliente")
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
            <DialogTitle><p>Você deseja deletar {client.name}?</p></DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={() => handleDeleteClient(String(client.id))}>Deletar</Button>
              <Button onClick={() => setDeleteModalIsOpen(false)}>Cancelar</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
