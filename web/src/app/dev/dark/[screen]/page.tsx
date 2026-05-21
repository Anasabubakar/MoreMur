import { notFound } from "next/navigation";
import { StitchViewport } from "@/components/StitchViewport";
import { DARK_SCREENS, type DarkScreenKey } from "@/lib/screens-dark";

type Props = { params: Promise<{ screen: string }> };

export default async function DevDarkScreenPage({ params }: Props) {
  const { screen } = await params;
  const key = screen as DarkScreenKey;
  const pair = DARK_SCREENS[key];
  if (!pair) notFound();
  return <StitchViewport screen={pair} basePath="/screens-dark" />;
}

export function generateStaticParams() {
  return (Object.keys(DARK_SCREENS) as DarkScreenKey[]).map((screen) => ({ screen }));
}
