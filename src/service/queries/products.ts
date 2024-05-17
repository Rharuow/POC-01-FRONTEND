import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      inventory_quantity
      categories {
        id
        name
      }
    }
  }
`;