import { gql } from "@apollo/client";

export const DELETE_CLIENT = gql`
  mutation DeleteOneClient($where: ClientWhereUniqueInput!) {
    deleteOneClient(where: $where) {
      id
    }
  }
`;
