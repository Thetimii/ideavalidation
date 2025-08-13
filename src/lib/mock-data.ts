// Mock data for testing when Gemini API quota is exceeded
export const mockPageSpec = {
  meta: {
    title: "VegaFuel - Premium Vegan Protein",
    description: "Clean, delicious vegan protein powder for busy professionals",
    locale: "en"
  },
  brand: {
    name: "VegaFuel",
    tone: "confident, friendly",
    palette: {
      primary: "#10b981",
      neutral: "#111827", 
      accent: "#059669"
    },
    fonts: {
      heading: "Inter",
      body: "Inter"
    },
    radius: "lg"
  },
  goals: ["collect-waitlist"],
  sections: [
    {
      id: "hero1",
      type: "Hero",
      variant: "image-right"
    },
    {
      id: "features1", 
      type: "FeaturesGrid",
      columns: 3
    },
    {
      id: "cta1",
      type: "CTA",
      variant: "card"
    },
    {
      id: "faq1",
      type: "FAQ"
    },
    {
      id: "footer1",
      type: "Footer"
    }
  ],
  forms: [
    {
      id: "waitlist",
      fields: ["email"],
      submitAction: "store-and-email"
    }
  ],
  images: {
    hero1: {
      query: "vegan protein powder studio minimal",
      orientation: "landscape"
    }
  }
}

export const mockCopySpec = {
  hero1: {
    eyebrow: "New Launch",
    headline: "Vegan protein that doesn't taste vegan",
    subhead: "24g plant protein, 0g compromise. Perfect for busy professionals who refuse to settle.",
    primaryCta: "Join the waitlist",
    secondaryCta: "See ingredients"
  },
  features1: [
    {
      title: "24g Complete Protein",
      desc: "Premium pea + rice blend provides all essential amino acids your body needs."
    },
    {
      title: "Incredible Taste",
      desc: "Microfiltered for smooth, creamy texture. No chalky aftertaste, ever."
    },
    {
      title: "Clean Ingredients",
      desc: "No artificial fillers, gums, or sweeteners. Just pure, plant-based nutrition."
    }
  ],
  cta1: {
    headline: "Be first in line",
    subhead: "Get exclusive early access and a special launch discount.",
    cta: "Join the waitlist"
  },
  faq1: [
    {
      q: "Is it allergen friendly?",
      a: "Yes! VegaFuel is dairy-free, soy-free, gluten-free, and contains no artificial additives."
    },
    {
      q: "How much protein per serving?",
      a: "Each serving contains 24g of complete plant-based protein from premium pea and rice sources."
    },
    {
      q: "When will it be available?",
      a: "We're launching in early 2024. Waitlist members get exclusive early access and discounts."
    }
  ],
  footer1: {
    links: ["Privacy", "Terms", "Contact"]
  }
}
