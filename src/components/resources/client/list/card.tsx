import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export const CardClient = ({ client }: { client: Client }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between">
        <h1>{client.name}</h1>
      </CardHeader>
    </Card>
  );
};
