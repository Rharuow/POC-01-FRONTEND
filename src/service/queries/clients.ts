import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query {
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
  query Client($where: ClientWhereUniqueInput!) {
    getClient(where: $where) {
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
