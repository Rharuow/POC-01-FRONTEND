import { gql } from "@apollo/client";

export const GET_SALES = gql`
  query Sales {
    sales {
      id
      totalPrice
      client {
        id
        name
        address {
          delivery
          billing
        }
      }
      orders {
        id
        amount
        totalPrice
        product {
          id
          name
          price
        }
      }
    }
  }
`;

export const GET_SALE = gql`
  query Sales($where: SaleWhereUniqueInput!) {
    sale(where: $where) {
      id
      totalPrice
      client {
        id
        name
        address {
          billing
          delivery
        }
      }
      orders {
        id
        amount
        totalPrice
        product {
          id
          name
          price
        }
      }
    }
  }
`;
