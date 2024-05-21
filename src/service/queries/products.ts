import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
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
  query Product($where: ProductWhereUniqueInput!) {
    product(where: $where) {
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
