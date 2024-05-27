import React from "react";

import { CreateClient } from "../create";
import { Client } from "../client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteClient from "../delete";
import UpdateClient from "../update";

export const ListClient = ({ clients }: { clients: Array<Client> }) => {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Cobrança</TableHead>
          <TableHead>Entrega</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell><p>{client.name}</p></TableCell>
            <TableCell><p>{client.email}</p></TableCell>
            <TableCell><p>{client.document && client.document?.cpf ? client.document?.cpf : "Não informado"}</p></TableCell>
            <TableCell><p>{client.document && client.document?.cnpj ? client.document?.cnpj : "Não informado"}</p></TableCell>
            <TableCell><p>{client.address?.billing}</p></TableCell>
            <TableCell><p>{client.address?.delivery}</p></TableCell>
            <TableCell>
              <div className="flex gap-2">
                <DeleteClient client={client} />
                <UpdateClient id={String(client.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={7}><CreateClient clients={clients} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
