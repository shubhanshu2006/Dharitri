import { InfraBanner } from "@/components/widgets/InfraBanner";

export function Hero() {
  return (
    <InfraBanner
      id="hero"
      as="section"
      className="section-scroll-anchor min-h-screen text-black"
      secondaryButtonClassName="!border-white/20 !bg-black !text-white backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:!border-white/40 hover:!bg-emerald-800 hover:!shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      headingClassName="font-serif text-5xl font-semibold sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-black "
      descriptionClassName="font-intern max-w-3xl text-lg font-semibold leading-relaxed text-black drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] sm:text-xl"
      contentClassName="-translate-y-12"
      imageUrl="/images/bg.png"
      fallbackGradient="linear-gradient(120deg, #0b1210 0%, #16241d 55%, #2a2016 100%)"
      headingTag="h1"
      buttonId="get-started"
      showMarkers={false}
      showCategories={false}
      descriptionOverlay={true}
      centerContent
      heading={
        <>
          One connected view of
          <br />
          <span className="bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent italic">
            every land acquisition.
          </span>
        </>
      }
      description="DHARITRI unifies project, parcel, family, document, compensation and possession data into a single traceable digital lifecycle - connecting GIS intelligence with verified government records for faster, more accountable land acquisition."
    />
  );
}
