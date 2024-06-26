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
        categoryName
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: String!
    $categories: [String!]!
    $inventory_quantity: Float!
    $description: String!
    $price: Float!
    $name: String!
  ) {
    updateProduct(
      id: $id
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
        categoryName
      }
    }
  }
`;
