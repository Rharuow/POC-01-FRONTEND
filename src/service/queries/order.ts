import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
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
      orderItems {
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

export const GET_ORDER = gql`
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
