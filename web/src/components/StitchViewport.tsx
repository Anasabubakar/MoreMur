type ScreenLike = {
  desktop: string;
  mobile?: string;
  title: string;
};

type Props = {
  screen: ScreenLike;
  /** Public folder under web/public, e.g. `/screens` or `/screens-dark` */
  basePath?: string;
};

/** Renders exact Stitch HTML exports — desktop from md breakpoint, mobile below. */
export function StitchViewport({ screen, basePath = "/screens" }: Props) {
  const desktopSrc = `${basePath}/${screen.desktop}`;
  const mobileSrc = screen.mobile ? `${basePath}/${screen.mobile}` : desktopSrc;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-canvas">
      <iframe
        title={`${screen.title} (desktop)`}
        src={desktopSrc}
        className="hidden h-full w-full border-0 md:block"
      />
      <iframe
        title={`${screen.title} (mobile)`}
        src={mobileSrc}
        className="h-full w-full border-0 md:hidden"
      />
    </div>
  );
}
