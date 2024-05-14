import { NavBar } from "@/components/nav-bar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className}`}>
      <NavBar />
    </main>
  );
}
