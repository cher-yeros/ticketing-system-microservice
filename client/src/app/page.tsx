import Link from "next/link";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <div>
      <Link href={"/users"}>Users</Link>
      <ProductCard />
    </div>
  );
}
