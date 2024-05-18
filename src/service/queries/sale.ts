import { gql } from "@apollo/client";

export const GET_SALES = gql`
  query Sales {
    sales {
      id
      totalPrice
      client {
        id
        name
        email
      }
      orders {
        id
        amount
        totalPrice
        product {
          id
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
