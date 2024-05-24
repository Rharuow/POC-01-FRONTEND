import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query Categories {
    getCategories {
      id
      name
    }
  }
`;
