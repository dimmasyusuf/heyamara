import type { Metadata } from "next";

export const appConfig = {
  name: "Hey Amara",
  description:
    "Streamline your hiring process and attract top talent with an all-in-one recruitment platform for HR teams. Effortlessly source, assess, and hire the best candidates to build high-performing teams. Optimize your recruitment strategy and boost company growth with advanced, AI-powered tools.",
  domain: "heyamara.app",
  seo: {
    defaultKeywords: [
      "recruitment",
      "hiring",
      "talent",
      "HR",
      "HR management",
      "recruitment platform",
      "candidate sourcing",
      "talent acquisition",
      "job posting",
      "applicant tracking",
      "AI hiring",
      "HR software",
      "employee onboarding",
      "interview scheduling",
      "team building",
      "company growth",
      "human resources",
      "staffing",
      "workforce management",
      "recruitment automation",
      "talent management",
      "career development",
      "job search",
      "employer branding",
      "recruitment strategy",
    ],
    defaultLocale: "en_US",
    openGraphImage: "/opengraph-image.png",
  },
  social: {
    twitter: "@heyamara",
    linkedIn: "https://www.linkedin.com/company/heyamara",
    facebook: "https://www.facebook.com/heyamara",
    instagram: "https://www.instagram.com/heyamara",
  },
  theme: {
    backgroundColor: "#FFFFFF",
    primaryColor: "#171717",
  },
};

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  openGraph?: Metadata["openGraph"];
  canonicalUrlRelative?: string;
  extraTags?: Record<string, unknown>;
} = {}) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : `https://${appConfig.domain}/`;

  const absoluteCanonicalUrl = canonicalUrlRelative
    ? `${baseUrl}${canonicalUrlRelative.replace(/^\//, "")}`
    : baseUrl;

  const ogImage = openGraph?.images || `${baseUrl}opengraph-image.png`;

  let finalKeywords: string[] = appConfig.seo.defaultKeywords;

  if (keywords) {
    if (Array.isArray(keywords)) {
      finalKeywords = [...appConfig.seo.defaultKeywords, ...keywords];
    } else if (typeof keywords === "string") {
      finalKeywords = [...appConfig.seo.defaultKeywords, keywords];
    }
  }

  return {
    title: title || appConfig.name,
    description: description || appConfig.description,
    keywords: finalKeywords,
    applicationName: appConfig.name,
    metadataBase: new URL(baseUrl),
    robots: "index, follow",
    referrer: "no-referrer-when-downgrade",
    canonical: absoluteCanonicalUrl,
    openGraph: {
      title: title || appConfig.name,
      description: description || appConfig.description,
      url: absoluteCanonicalUrl,
      siteName: appConfig.name,
      locale: appConfig.seo.defaultLocale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Hey Amara",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: appConfig.social.twitter,
      title: title || appConfig.name,
      description: description || appConfig.description,
      image: ogImage,
      imageAlt: "Hey Amara",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    manifest: "/site.webmanifest",
    alternates: { canonical: absoluteCanonicalUrl },
    structuredData: [],

    ...extraTags,
  };
};
