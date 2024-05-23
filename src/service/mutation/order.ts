import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $orderItems: [CreateOrderItemInput!]!
    $clientId: String!
    $totalPrice: Float!
  ) {
    createOrder(
      orderItems: $orderItems
      clientId: $clientId
      totalPrice: $totalPrice
    ) {
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

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: String!) {
    deleteOrder(id: $id)
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder(
    $orderItems: [CreateOrderItemInput!]!
    $clientId: String!
    $totalPrice: Float!
    $id: String!
  ) {
    updateOrder(
      orderItems: $orderItems
      clientId: $clientId
      totalPrice: $totalPrice
      id: $id
    ) {
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
