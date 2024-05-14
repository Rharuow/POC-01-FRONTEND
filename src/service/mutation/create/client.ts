import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql`
  mutation CreateOneClient($data: ClientCreateInput!) {
    createOneClient(data: $data) {
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
