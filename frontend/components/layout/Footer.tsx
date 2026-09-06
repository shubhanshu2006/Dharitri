import Link from "next/link";
import { Heart } from "lucide-react";
import { GithubIcon, XIcon } from "@/components/ui/BrandIcons";
import { InfraBanner } from "@/components/widgets/InfraBanner";
import { FOOTER_LINKS, TWITTER_URL } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="section-scroll-anchor relative bg-white/90">
      <InfraBanner
        as="div"
        className="mx-auto w-[90%] min-h-100 rounded-xl sm:min-h-95"
        imageUrl="/images/footer.png"
        fallbackGradient="linear-gradient(120deg, #cfe8da 0%, #f2b134 100%)"
        headingTag="h2"
        headingClassName="font-instrument-sans text-3xl font-semibold leading-[1.15] tracking-tight text-cream drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl"
        contentFontClassName="font-instrument-sans"
        overlay
        compact
        kicker="Land today. A stronger tomorrow."
        heading={
          <>
            Enabling progress
            <br />
            <span className="text-emerald-300">through trusted land data.</span>
          </>
        }
        description="DHARITRI brings land records, GIS intelligence, and verified government data together to support infrastructure, housing, industry and public services — for a better, more inclusive tomorrow."
      />

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="#hero"
            className="font-serif text-2xl italic tracking-wide text-black"
          >
            Dharitri
          </Link>
          <div className="flex items-center gap-2.5">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow DHARITRI on X"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/50 hover:text-emerald-600"
            >
              <XIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com/shubhanshu2006/Dharitri"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View DHARITRI on GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/50 hover:text-emerald-600"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 h-px w-full bg-paper-line" />

        <div className="mt-6 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-black">
            © {year} DHARITRI. All rights reserved.
          </p>
          <p className="flex items-center text-black gap-1.5 text-xs">
            Built with
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            by
            Team AMOGH
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-ink" />
    </footer>
  );
}
