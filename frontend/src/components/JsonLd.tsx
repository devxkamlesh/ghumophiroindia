/**
 * Renders a schema.org JSON-LD <script> tag.
 *
 * Works in both server and client components. Pass a single object or an array
 * of objects (each becomes its own <script> so validators parse them cleanly).
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify escapes the payload; content is app-controlled (not user input).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
