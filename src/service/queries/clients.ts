import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      email
      document {
        cnpj
        cpf
      }
      address {
        billing
        delivery
      }
    }
  }
`;

export const GET_CLIENT = gql`
  query Client($clientId: String!) {
    client(id: $clientId) {
      id
      name
      email
      address {
        billing
        delivery
      }
      document {
        cnpj
        cpf
      }
    }
  }
`;
