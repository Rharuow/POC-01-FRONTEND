import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Client } from "../client";
import UpdateClient from "../update";
import DeleteClient from "../delete";

export const CardClient = ({ client }: { client: Client }) => {
  return (
    <Card className="h-full relative">
      <CardHeader className="flex justify-between">
        <h1>{client.name}</h1>
      </CardHeader>
      <div className="absolute top-1 right-1 flex gap-1">
        <DeleteClient client={client} />
        <UpdateClient id={String(client.id)} />
      </div>
    </Card>
  );
};
