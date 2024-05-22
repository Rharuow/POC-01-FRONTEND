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
  mutation DeleteOneSale($where: SaleWhereUniqueInput!) {
    deleteOneSale(where: $where) {
      id
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOneSale(
    $data: SaleUpdateInput!
    $where: SaleWhereUniqueInput!
  ) {
    updateOneSale(data: $data, where: $where) {
      id
      client {
        id
        name
        address {
          delivery
          billing
        }
      }
      orders {
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
