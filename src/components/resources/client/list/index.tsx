import { GET_CLIENTS } from "@/service/queries/clients";
import { useQuery } from "@apollo/client";
import React from "react";

export const ListClient = () => {
  const { data, loading } = useQuery(GET_CLIENTS);

  return <div></div>;
};
