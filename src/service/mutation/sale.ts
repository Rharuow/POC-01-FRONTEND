import { gql } from "@apollo/client";

export const CREATE_SALE = gql`
  mutation CreateOneProduct($data: ProductCreateInput!) {
    createOneProduct(data: $data) {
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

export const DELETE_SALE = gql`
  mutation DeleteOneProduct($where: ProductWhereUniqueInput!) {
    deleteOneProduct(where: $where) {
      id
    }
  }
`;

export const UPDATE_SALE = gql`
  mutation UpdateOneProduct(
    $data: ProductUpdateInput!
    $where: ProductWhereUniqueInput!
  ) {
    updateOneProduct(data: $data, where: $where) {
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
