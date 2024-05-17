import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateOneCategory($data: CategoryCreateInput!) {
    createOneCategory(data: $data) {
      id
      name
    }
  }
`;