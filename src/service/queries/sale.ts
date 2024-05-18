import { gql } from "@apollo/client";

export const GET_SALES = gql`
  query {
    products {
      id
      name
      description
      inventory_quantity
      categories {
        category {
          name
        }
      }
    }
  }
`;

export const GET_SALE = gql`
  query Product($where: ProductWhereUniqueInput!) {
    product(where: $where) {
      id
      name
      description
      inventory_quantity
      categories {
        category {
          name
        }
      }
    }
  }
`;
