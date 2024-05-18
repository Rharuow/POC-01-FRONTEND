import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateOneProduct($data: ProductCreateInput!) {
    createOneProduct(data: $data) {
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

export const DELETE_PRODUCT = gql`
  mutation DeleteOneProduct($where: ProductWhereUniqueInput!) {
    deleteOneProduct(where: $where) {
      id
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateOneProduct(
    $data: ProductUpdateInput!
    $where: ProductWhereUniqueInput!
  ) {
    updateOneProduct(data: $data, where: $where) {
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
