export function MarqueeBar() {
  const logos = [
    "Forbes",
    "TechCrunch",
    "Business Insider",
    "CNN Africa",
    "TechCabal",
    "Nairametrics",
  ];

  return (
    <section className="py-10 border-y border-[#222220] bg-[#0D0D0E] overflow-hidden">
      <div className="flex flex-col items-center gap-4 mb-6">
        <span className="text-[10px] uppercase tracking-[3px] text-text-tertiary">
          Featured in
        </span>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee gap-16 md:gap-24">
          {/* First set */}
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-lg md:text-xl font-light text-text-tertiary hover:text-text-secondary transition-colors duration-300 whitespace-nowrap"
            >
              {logo}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo) => (
            <span
              key={`${logo}-dup`}
              className="text-lg md:text-xl font-light text-text-tertiary hover:text-text-secondary transition-colors duration-300 whitespace-nowrap"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
