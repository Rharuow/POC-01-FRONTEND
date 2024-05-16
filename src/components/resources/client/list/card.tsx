import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardHeader } from "@/components/ui/card";
import { Client } from "../client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DELETE_CLIENT } from "@/service/mutation/delete/client";
import { apolloClient } from "@/lib/apollo";
import { GET_CLIENTS } from "@/service/queries/clients";

export const CardClient = ({ client }: { client: Client }) => {

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [deleteOneClient, { }] = useMutation(DELETE_CLIENT)

  function handleCloseModal() { setModalIsOpen(false) }

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
      setModalIsOpen(false)
    }

  }

  return (
    <Card className="h-full relative">
      <CardHeader className="flex justify-between">
        <h1>{client.name}</h1>
      </CardHeader>
      <div className="absolute top-1 right-1 flex gap-1">
        <Dialog open={modalIsOpen}>
          <DialogTrigger asChild onClick={() => setModalIsOpen(true)}>
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
                  <Button onClick={() => handleCloseModal()}>Cancelar</Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
