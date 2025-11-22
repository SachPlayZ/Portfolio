import BlurText from "@/components/BlurText";
import RotatingText from "@/components/RotatingText";
import SpotifyNowNotch from "@/components/SpotifyNowNotch";
import VoronoiBackground from "@/components/Voronoi";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";
import Image from "next/image";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const HERO_IMAGE = "/Portfolioalt.png";
const SOCIAL_LINKS = [
  {
    name: "X",
    href: "https://x.com/singhsach1",
    icon: "/x.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/singhsach",
    icon: "/linkedin.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/SachPlayZ",
    icon: "/github.svg",
  },
];

const Page = () => {
  return (
    <>
      <SpotifyNowNotch />
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fdf5e7] px-6 py-12 text-slate-900">
        <VoronoiBackground />
        <section className="relative z-10 flex w-full max-w-14/16 flex-col gap-8 rounded-[3rem] border border-white/60 bg-white/40 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-lg md:flex-row md:items-stretch md:gap-14 md:p-15 min-h-[75vh]">
          <div className="relative flex flex-1 flex-col text-balance">
            <div className="space-y-2">
              <div role="heading" aria-level={1}>
                <BlurText
                  text="Hi, I am Sachindra"
                  animateBy="words"
                  delay={225}
                  className={`${instrumentSerif.className} text-[clamp(2.75rem,6vw,5.5rem)] leading-tight text-zinc-600 [&>span:last-child]:text-[#3ba58b] [&>span:last-child]:italic`}
                  animationFrom={{ filter: "blur(12px)", opacity: 0, y: -60 }}
                  animationTo={[
                    { filter: "blur(6px)", opacity: 0.6, y: -10 },
                    { filter: "blur(0px)", opacity: 1, y: 0 },
                  ]}
                />
              </div>
              <div
                className={`${robotoCondensed.className} flex flex-wrap items-center gap-3 text-[clamp(1.4rem,2.5vw,2.1rem)] text-slate-600`}
              >
                <div className="inline-flex items-center rounded-lg bg-[#3ba58b] px-2">
                  <RotatingText
                    texts={["Full Stack", "Blockchain", "DevRel"]}
                    rotationInterval={2400}
                    staggerDuration={0.01}
                    staggerFrom="last"
                    transition={{
                      duration: 0.65,
                      type: "spring",
                      stiffness: 320,
                      damping: 30,
                    }}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-120%", opacity: 0 }}
                    mainClassName="justify-center tracking-wide"
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-0.5"
                    elementLevelClassName="text-white"
                    splitBy="characters"
                  />
                </div>
                <span>Engineer</span>
              </div>
              <p
                className={`${robotoCondensed.className} mt-12 text-[clamp(1.15rem,2vw,1.35rem)] leading-relaxed text-slate-700`}
              >
                I love building fast, scalable, and user-centric products while
                amplifying developer communities as a DevRel advocate. I&apos;ve
                worked across startups and hackathons, leading teams, shipping
                complex systems, and architecting various Web3 protocols and
                AI-driven platforms. Whether it&apos;s designing prediction
                markets, crafting intelligent agent pipelines, developing
                seamless frontend experiences, or guiding teams through new
                tooling via workshops and content, I focus on creating impactful
                solutions with clean engineering.
              </p>
            </div>
            <div
              className={`h-full flex items-end gap-4 ${robotoCondensed.className}`}
            >
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white/30 text-slate-600 shadow-md transition hover:-translate-y-1 hover:border-[#3ba58b] hover:text-[#3ba58b]"
                  aria-label={name}
                >
                  <Image src={Icon} alt={name} width={30} height={30} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="relative w-full max-w-md aspect-7/9 overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="Sachindra speaking at a conference"
                className="h-full w-full object-cover object-[45%_20%]"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;
