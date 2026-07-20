import Link from 'next/link'

/**
 * Reusable long-form SEO content block for landing pages.
 *
 * Renders semantic, crawlable copy (H2 -> H3 -> p / ul) with optional internal
 * links. Long-form, keyword-relevant text plus internal linking is what helps
 * these pages rank and gives answer engines (AEO/GEO) something to quote.
 */

export type SeoBullet = string | { text: string; href: string }

export interface SeoBlock {
  heading: string
  paragraphs?: string[]
  bullets?: SeoBullet[]
}

export default function SeoContentSection({
  title,
  intro,
  blocks,
  footnote,
}: {
  title: string
  intro?: string
  blocks: SeoBlock[]
  footnote?: string
}) {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="container-custom py-14 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        {intro && <p className="text-gray-600 leading-relaxed mb-8">{intro}</p>}

        <div className="space-y-8">
          {blocks.map((block) => (
            <div key={block.heading}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{block.heading}</h3>
              {block.paragraphs?.map((p, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
              {block.bullets && (
                <ul className="mt-2 space-y-1.5">
                  {block.bullets.map((b, i) => {
                    const isLink = typeof b !== 'string'
                    return (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                        {isLink ? (
                          <Link href={b.href} className="text-primary-600 hover:text-primary-700 hover:underline">
                            {b.text}
                          </Link>
                        ) : (
                          <span>{b}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {footnote && <p className="text-xs text-gray-400 mt-8">{footnote}</p>}
      </div>
    </section>
  )
}
