import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  cache: new InMemoryCache(),
});
