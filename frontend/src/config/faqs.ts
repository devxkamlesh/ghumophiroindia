/**
 * FAQ content — shared by the on-page accordion (components/.../FAQ.tsx) and the
 * FAQPage JSON-LD on the homepage. Keeping one source means the visible answers
 * and the structured data can never drift apart (a Google rich-results rule).
 *
 * Answers are written to be concise and self-contained so answer engines
 * (Google AI Overviews, ChatGPT, Perplexity) can quote them directly (AEO).
 */

export interface Faq {
  q: string
  a: string
}

export const homeFaqs: Faq[] = [
  {
    q: 'What is the best time to visit Rajasthan?',
    a: 'The best time to visit Rajasthan is from October to March, when days are pleasant (20–28°C) and ideal for sightseeing forts, palaces and desert safaris. Avoid April to June, when temperatures often cross 40°C. July to September brings the monsoon and a green, quieter Rajasthan.',
  },
  {
    q: 'How many days do you need for a Rajasthan tour?',
    a: 'A first Rajasthan trip works well in 7 to 10 days, covering Jaipur, Pushkar, Udaipur and Jodhpur. With 12–14 days you can add Jaisalmer’s desert, Bikaner and Ranthambore. A short 5–6 day trip usually focuses on the Golden Triangle (Delhi–Agra–Jaipur) plus one extra city.',
  },
  {
    q: 'What does the Golden Triangle tour cover?',
    a: 'The Golden Triangle covers Delhi, Agra and Jaipur — including the Taj Mahal, Agra Fort, Amber Fort, City Palace and Hawa Mahal. It is India’s most popular circuit for first-time visitors and is usually done in 5 to 7 days.',
  },
  {
    q: 'How much does a Rajasthan tour package cost?',
    a: 'A guided Rajasthan tour typically costs ₹3,000–₹6,000 per person per day for budget travel, ₹6,000–₹12,000 for mid-range, and ₹12,000+ for luxury heritage stays. The final price depends on hotels, group size, season and inclusions like guides, transport and entry fees.',
  },
  {
    q: 'Are your tour guides government-approved?',
    a: 'Yes. Our tours are led by a government-approved, licensed Rajasthan tourist guide with 5 years of experience. You get authentic historical context, local access and safe, well-planned itineraries rather than a rushed group bus tour.',
  },
  {
    q: 'Is Rajasthan safe for tourists, including solo and female travellers?',
    a: 'Rajasthan is one of India’s most popular and welcoming tourist regions and is generally safe. We use verified hotels, insured private vehicles, a licensed guide and 24/7 support. Female and solo travellers are looked after with vetted drivers and sensible daily plans.',
  },
  {
    q: 'How do I book a tour?',
    a: 'Pick a tour and submit the booking form, or use the Custom Tour Builder for a tailored trip. Our team replies within 24 hours to confirm dates, itinerary and payment details. You can also message us directly on WhatsApp.',
  },
  {
    q: 'What is included in the tour price?',
    a: 'Multi-day packages typically include accommodation, air-conditioned private transport, a professional guide, monument entry fees and daily breakfast (and often dinner). Each tour page lists the exact inclusions and exclusions.',
  },
  {
    q: 'Can I customize my own itinerary?',
    a: 'Absolutely. Use our Custom Tour Builder or contact us to design an itinerary around your interests, budget, pace and travel dates — from heritage and photography to desert camping and food trails.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Free cancellation up to 7 days before the tour. Cancellations within 7 days incur a 50% fee, and there is no refund within 48 hours of the tour start. Custom trips may vary based on hotel and transport bookings.',
  },
]
