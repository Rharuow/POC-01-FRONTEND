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
  query GetOrder($id: String!) {
    getOrder(id: $id) {
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
