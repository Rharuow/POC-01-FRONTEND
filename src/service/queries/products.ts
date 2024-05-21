import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      description
      price
      inventory_quantity
      categories {
        category {
          name
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      description
      price
      inventory_quantity
      categories {
        category {
          name
        }
      }
    }
  }
`;
