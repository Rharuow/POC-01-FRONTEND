import { Inter } from "next/font/google";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "@/service/queries/clients";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, loading } = useQuery(GET_CLIENTS);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      HELLOW
    </main>
  );
}
