import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  ...(process.env.NODE_ENV === "test" && { link: ApolloLink.empty() }),
  cache: new InMemoryCache(),
});
