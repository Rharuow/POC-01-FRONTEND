import { gql } from "@apollo/client";

export const CREATE_SALE = gql`
  mutation CreateOneSale($data: SaleCreateInput!) {
    createOneSale(data: $data) {
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

export const DELETE_SALE = gql`
  mutation DeleteOneSale($where: SaleWhereUniqueInput!) {
    deleteOneSale(where: $where) {
      id
    }
  }
`;

export const UPDATE_SALE = gql`
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
