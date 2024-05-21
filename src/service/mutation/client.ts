import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql`
  mutation CreateClient(
    $cnpj: String!
    $cpf: String!
    $delivery: String!
    $billing: String!
    $email: String!
    $name: String!
  ) {
    createClient(
      cnpj: $cnpj
      cpf: $cpf
      delivery: $delivery
      billing: $billing
      email: $email
      name: $name
    ) {
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
  mutation UpdateClient(
    $cnpj: String!
    $cpf: String!
    $delivery: String!
    $billing: String!
    $email: String!
    $name: String!
    $id: String!
  ) {
    updateClient(
      cnpj: $cnpj
      cpf: $cpf
      delivery: $delivery
      billing: $billing
      email: $email
      name: $name
      id: $id
    ) {
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
