import { notFound } from "next/navigation";
import { LOJAS } from "@/dados/lojas";
import { PaginaLoja } from "@/components/loja/PaginaLoja";

export function generateStaticParams() {
  return LOJAS.map((loja) => ({ slug: loja.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = LOJAS.find((l) => l.id === slug);
  if (!loja) notFound();
  return <PaginaLoja loja={loja} />;
}
