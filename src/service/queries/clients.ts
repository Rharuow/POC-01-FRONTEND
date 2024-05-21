import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClients {
    getClients {
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
  query Client($id: String!) {
    getClient(id: $id) {
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
