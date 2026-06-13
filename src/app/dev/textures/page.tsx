import TextureDevPage from "@/components/TextureDevPage";
import { notFound } from "next/navigation";

export default function DevTexturesPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <TextureDevPage />;
}
