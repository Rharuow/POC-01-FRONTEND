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

export const DELETE_CLIENT = gql`
  mutation DeleteOneClient($where: ClientWhereUniqueInput!) {
    deleteOneClient(where: $where) {
      id
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateOneClient($data: ClientUpdateInput!, $where: ClientWhereUniqueInput!) {
    updateOneClient(data: $data, where: $where) {
      id
      name
      email
      address {
        billing
        delivery
      }
      document {
        cpf
        cnpj
      }
    }
}
`;
