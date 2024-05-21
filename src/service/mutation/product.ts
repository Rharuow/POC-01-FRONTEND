import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $categories: [String!]!
    $inventory_quantity: Float!
    $description: String!
    $price: Float!
    $name: String!
  ) {
    createProduct(
      categories: $categories
      inventory_quantity: $inventory_quantity
      description: $description
      price: $price
      name: $name
    ) {
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
