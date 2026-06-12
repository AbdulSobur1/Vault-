export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Vaulté",
    alternateName: "Vaulté Financial Technologies Ltd.",
    description:
      "Private banking built for the modern era. Instant transfers, multi-currency accounts, and cards that work everywhere.",
    url: "https://vaulte.vercel.app",
    logo: "https://vaulte.vercel.app/favicon.svg",
    founder: {
      "@type": "Person",
      name: "Vaulté Team",
    },
    foundingDate: "2025",
    slogan: "Where wealth is kept.",
    knowsAbout: [
      "Digital Banking",
      "Multi-Currency Accounts",
      "Virtual Cards",
      "Money Transfers",
      "Private Banking",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Starter",
        description: "Free account with virtual card and 5 free transfers/month",
      },
      {
        "@type": "Offer",
        name: "Private",
        description: "Premium account with physical card, unlimited transfers, and wealth insights",
      },
      {
        "@type": "Offer",
        name: "Elite",
        description: "Unlimited accounts, dedicated manager, and concierge support 24/7",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "NG",
    },
    funder: {
      "@type": "Organization",
      name: "Central Bank of Nigeria",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Banking Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Money Transfer Service",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Card Services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Multi-Currency Accounts",
          },
        },
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Vaulté",
    url: "https://vaulte.vercel.app",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    featureList: [
      "Bank-grade encryption",
      "Instant transfers",
      "Multi-currency accounts",
      "Virtual and physical cards",
      "MFA security",
      "Real-time balance updates",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
