import { Toaster } from "@/components/ui/sonner";
import { apolloClient } from "@/lib/apollo";
import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Toaster />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
