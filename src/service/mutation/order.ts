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
      client {
        id
        name
        address {
          delivery
          billing
        }
      }
      orderItems {
        amount
        totalPrice
        product {
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
    $updateOrderId: String!
  ) {
    updateOrder(
      orderItems: $orderItems
      clientId: $clientId
      totalPrice: $totalPrice
      id: $updateOrderId
    ) {
      id
      client {
        id
        name
        address {
          delivery
          billing
        }
      }
      orderItems {
        amount
        totalPrice
        product {
          name
          price
        }
      }
    }
  }
`;
