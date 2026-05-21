import { notFound } from "next/navigation";
import { StitchViewport } from "@/components/StitchViewport";
import { SCREENS, type ScreenKey } from "@/lib/screens";

type Props = { params: Promise<{ screen: string }> };

export default async function DevScreenPage({ params }: Props) {
  const { screen } = await params;
  const key = screen as ScreenKey;
  const pair = SCREENS[key];
  if (!pair) notFound();
  return <StitchViewport screen={pair} />;
}

export function generateStaticParams() {
  return (Object.keys(SCREENS) as ScreenKey[]).map((screen) => ({ screen }));
}
